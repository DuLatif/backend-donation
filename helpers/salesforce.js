'use strict';

const jsforce = require('jsforce');

class Salesforce {
    constructor() {
        this.SF = null;
    }

    #salesforceCredential = {
        loginUrl: process.env.SALESFORCE_ENV === 'production' ? 'https://login.salesforce.com' : 'https://test.salesforce.com',
        username: process.env.SALESFORCE_USERNAME,
        password: process.env.SALESFORCE_PASSWORD + process.env.SALESFORCE_SECURITY_TOKEN,
    };
    
    loginSalesforce = async () => {
        try {
            const SFConnection = new jsforce.Connection({
                loginUrl: this.#salesforceCredential.loginUrl,
            });
            await SFConnection.login(this.#salesforceCredential.username, this.#salesforceCredential.password);
            this.SF = SFConnection;
        } catch (error) {
            throw error;
        }
    };
}

module.exports = Salesforce;