const AdmZip = require('adm-zip');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { processWorkers } = require('../helpers/workersHelper');
const { processDocs } = require('../helpers/docsHelper');

const docsRouter = require('express').Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const extractTargetDir = path.join(__dirname, '..', 'extracted');
if (!fs.existsSync(extractTargetDir)) {
    fs.mkdirSync(extractTargetDir);
}

docsRouter.post('/upload', upload.single('file'), async (req, res) => {
    try{
        if (!req.file) {
            return res.status(400).send('No file uploaded.');
        }

        // Validate that the file is an archive
        if (path.extname(req.file.originalname).toLowerCase() !== '.zip') {
            return res.status(400).send({ error: 'Only .zip files are allowed.' });
        }

        // Read the zip file content directly from the memory buffer
        const zip = new AdmZip(req.file.buffer);
        
        // Extract all entries to the target directory
        // The true flag overwrites any existing files with the same names
        zip.extractAllTo(extractTargetDir, true);

        // Process csv file and upload to db
        const processedWorkers = await processWorkers(path.join(extractTargetDir, 'profiles.csv'));

        // Process fields from pdfs and upload to db
        const errors = await processDocs(Object.keys(processedWorkers), workerDir = path.join(extractTargetDir, 'documents'));

        res.status(200).send({
            message: 'Files uploaded successfully.',
            missingDocuments: errors.missingDocs.map(({ workerId, filename }) => `${workerId}/${filename}`),
            unreadableDocuments: errors.unreadableDocs.map(({ workerId, filename }) => `${workerId}/${filename}`),
        });
    } catch (error) {
        res.status(500).send({
            error: 'Failed to process zip file.',
            details: error.message
        });
    }
});

module.exports = docsRouter;