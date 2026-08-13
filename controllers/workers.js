const workersRouter = require('express').Router();
const models = require('../models');
const { DOC_TYPES } = require('../const/const');
const { convertToWorkerMap } = require('../helpers/docsHelper');
const { validateWorkers } = require('../helpers/workersHelper');

workersRouter.get('/validate', async (req, res) => {
  const workers = await models.worker.findAll({ raw: true });
  const docsRaw = {};
  const docsPromises = Object.keys(DOC_TYPES).map(async (docType) => {
    docsRaw[docType] = await models[DOC_TYPES[docType].model].findAll({ raw: true });
  });

  await Promise.allSettled(docsPromises);

  // Convert to workerId => workerData map for easier processing
  const docs = convertToWorkerMap(docsRaw);

  // Validate data
  const validationResults = await validateWorkers(workers, docs);

  res.status(200).json(validationResults);
});

module.exports = workersRouter;