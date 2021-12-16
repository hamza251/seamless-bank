// initialize the api-response-handler so that we can use the generic response
const responseHandler = require('../../../common/helpers/api.response.handler');
const ibanCountryLookup = require('../../../common/helpers/iban.country.lookup');
// intialize puppeter for web scrapping
const puppeteer = require('puppeteer');
// initialize user agents for acting as a user while scrapping the web page
const userAgent = require('user-agents');
const env = require('../../../common/config/env.config');
const { response } = require('express');
const validator = require('../../../common/helpers/validation.handler');

module.exports.BankController = {

    /**
     * Get iban details by scrapping the website 
     * @param {Object} req 
     * @param {Object} res 
     * @returns {JSON}
     */
    getBankInfoByIban: async function(req,res){
        responseHandler.setResponseObject(res);

        let iban = req.params.iban;
        // check if iban is not passed
        if(!iban) return responseHandler.badRequest({message:"Please pass the iban number."});        
        if(!validator.isIbanValid(iban)) return responseHandler.badRequest({message:"iban is incorrect."});

        try {
            const browser = await puppeteer.launch({
                headless: true
            });
            
            const page = await browser.newPage();
            // generate random user agent so that the crawler act as a browser
            await page.setUserAgent(userAgent.toString())
            await page.goto(env.web_url,{timeout: 15000}); // will timeout in 15 second
            
            await page.type('input[id=iban-number]', iban);
            await page.evaluate(() => {
                document.querySelector('button[type=submit]').click();
            });
            await page.waitForNavigation();
            
            // get the bank info from the DOM
            const bank = await page.evaluate('document.querySelector("img.bank-logo").getAttribute("src")');
            const logo = await page.evaluate('document.querySelector("img.bank-logo").getAttribute("alt")');

            return responseHandler.success({bank,logo});

        } catch (e) {
            if (e instanceof puppeteer.errors.TimeoutError) {
                return  responseHandler.success({
                    "status": e.name,
                    "message": e.message
                });
            }
            return responseHandler.error({
                "status":e.name,
                "message":e.message
            });
        }

    },
    
    /**
     * Get remaining balance  
     * @param {Object} req 
     * @param {Object} res 
     * @returns {JSON}
     */
    getBalance:function (req, res) {
        // set req object so that we can send response directly from the api response handler
        responseHandler.setResponseObject(res);
        try {
            // get numer of balance from environment
            const balance = process.env.BALANCE;
            return responseHandler.success({
                "balance":balance
            });
        } catch (error) {
            return this.error({
                "status":e.name,
                "message":e.message
            })  
        }
    },

    /**
     * validate and make payment  
     * @param {Object} req 
     * @param {Object} res 
     * @returns {JSON}
     */
    makePayment:function (req,res){
        responseHandler.setResponseObject(res);

        let iban = req.params.iban;
        // validate required parameter
        if(!iban) return responseHandler.badRequest({message:"Please pass the Iban number"});
        if(req.query.currency == undefined || req.query.currency == '') return responseHandler.badRequest({message:"Currency should not be empty"});
        if(req.query.amount == undefined || req.query.amount == '') return responseHandler.badRequest({message:"Amount should not be empty"});
        // validate iban
        if(!validator.isIbanValid(iban)) return responseHandler.badRequest({message:"iban is incorrect."});

        const countryIbanLookupObject = ibanCountryLookup();
        const balance                 = process.env.BALANCE;
        let countryCode               = iban.substr(0, 2);
        let currency                  = req.query.currency;
        let amount                    = req.query.amount;
        const ibanLookupArray = countryIbanLookupObject[countryCode]; // get iban lookup data by country code
        // validate if currency exists in lookup
        if(ibanLookupArray == undefined) return responseHandler.badRequest({message:`We don't support ${currency} currency.`});
        // validate if currency is an integer
        if(!isNaN(currency - parseFloat(currency))) return responseHandler.badRequest({message:"Currency should be a string"}); 
        if(isNaN(amount - parseFloat(amount))) return responseHandler.badRequest({message:"Amount should be an integer"}); 
        
        currency            = currency.toUpperCase();
        let lookupCurrency  = ibanLookupArray[0];
        // check currency by compare bank account currecny with the requested currency
        if(lookupCurrency != currency) return responseHandler.conflict({status:"Currenct Conflict",message:"Please use the native currency as per the country."});
        
        let remainingBalance = balance - amount;
        // check if amount is not exceed from the remaining balance
        if(remainingBalance < 0) return responseHandler.amountExceed({status:"Amount Exceeded", message:"Amount exceed from the remaining balance."});

        // update the remaining balance into envirnment
        process.env.BALANCE = remainingBalance;
        return responseHandler.successAccepted({
            amount,currency
        });


    }
}
