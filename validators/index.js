const fs = require('fs');
const path = require('path');
const basename = path.basename(__filename);

const { DOC_TYPES } = require('../const/const');

const validators = Object.keys(DOC_TYPES).reduce((acc, docType) => {
    acc[docType] = require(path.join(__dirname, DOC_TYPES[docType].model));
    return acc;
}, {});

module.exports = validators;