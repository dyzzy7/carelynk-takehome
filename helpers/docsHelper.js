const fs = require('fs');
const path = require('path');
const { PDFParse } = require('pdf-parse');
const models = require('../models');
const { DOC_TYPES, ERRORS } = require('../const/const');

const parsePdf = async (filePath) => {
    const dataBuffer = fs.readFileSync(filePath);
    const parser = new PDFParse({ data: dataBuffer });
    const rawText = await parser.getText();
    const data = rawText.text.split('\n').reduce((acc, line) => {
        const [key, value] = line.split(':').map(part => part.trim());
        if (key && value) {
            acc[key] = value;
        }
        return acc;
    }, {});
    
    return data;
};

const processDocs = async (workerIds, baseDir) => {
	try {
        const data = Object.keys(DOC_TYPES).reduce((acc, docType) => {
            acc[docType] = [];
            return acc;
        }, {});
        const errors = {
            missingDocs: [],
            unreadableDocs: []
        };
        
        const promises = workerIds.map(async (workerId) => {
            const workerDir = path.join(baseDir, workerId);
            const docPromises = Object.keys(DOC_TYPES).map(async (docType) => {
                const filename = DOC_TYPES[docType].filename;
                const filePath = path.join(workerDir, DOC_TYPES[docType].filename);
                if (!fs.existsSync(filePath)) {
                    errors.missingDocs.push({ workerId, filename });
                    return;
                }
                const pdfData = await parsePdf(filePath);
                if (!pdfData || Object.keys(pdfData).length === 0) {
                    errors.unreadableDocs.push({ workerId , filename});
                    return;
                }
                const parsedData = Object.keys(DOC_TYPES[docType].fields).reduce((acc, field) => {
                    if (pdfData[DOC_TYPES[docType].fields[field]]) {
                        // Special case when there is no expiration date (eg. citizen card)
                        if (field === 'expiration_date' && pdfData[DOC_TYPES[docType].fields[field]].includes('N/A')) {
                            acc[field] = null;
                        }
                        else {
                            acc[field] = models[DOC_TYPES[docType].model].rawAttributes[field].type instanceof models.Sequelize.DATE
                                ? new Date(pdfData[DOC_TYPES[docType].fields[field]])
                               : pdfData[DOC_TYPES[docType].fields[field]];
                        }
                    }
                    return acc;
                }, 
                { 
                    worker_id: workerId,
                    createdAt: new Date(),
                    updatedAt: new Date()
                });

                // Special case when there is no doc id
                if (!parsedData.document_id) {
                    parsedData.document_id = `${workerId}_${docType}`
                }

                data[docType].push(parsedData);
            });

            return await Promise.allSettled(docPromises);
        });

        await Promise.allSettled(promises);

        const sqlPromises = Object.keys(DOC_TYPES).map(async (docType) => {
            return await models[DOC_TYPES[docType].model].bulkCreate(data[docType], { ignoreDuplicates: true });
        });
        
        await Promise.allSettled(sqlPromises);

        const missingDocs = errors.missingDocs.map(({ workerId, filename }) => ({
            worker_id: workerId,
            filename,
            error: ERRORS.DOCUMENT_MISSING
        }));

        const unreadableDocs = errors.unreadableDocs.map(({ workerId, filename }) => ({
            worker_id: workerId,
            filename,
            error: ERRORS.DOCUMENT_UNREADABLE
        }));

        await models.error.bulkCreate([ ...missingDocs, ...unreadableDocs], { ignoreDuplicates: true });

        return errors;
	} catch (error) {
		console.error('Error processing documents:', error);
		throw error;
	}
};

const convertToWorkerMap = (docsRaw) => {
    const docs = Object.keys(DOC_TYPES).reduce((acc, docType) => {
        docsRaw[docType].forEach((doc) => {
            acc[doc.worker_id] = acc[doc.worker_id] || {};
            acc[doc.worker_id][docType] = doc;
        });
        return acc;
    }, {});

    return docs;
}

module.exports = {
    processDocs,
    convertToWorkerMap
};