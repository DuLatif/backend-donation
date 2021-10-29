'use strict';

const Salesforce = require('../helpers/salesforce');

const salesforceMiddleware = async (req, res, next) => {
    try {
        const salesforce = new Salesforce();
        await salesforce.loginSalesforce();

        req.SF = salesforce.SF;
        next();
    } catch (error) {
        next(error);
    }
};

module.exports = salesforceMiddleware;