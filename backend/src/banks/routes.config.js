const {BankController} = require('./controller/banks.controller');
const express = require('express');
let router = express.Router();

router
    .get('/balance', BankController.getBalance)
    .get('/bank/:iban?',BankController.getBankInfoByIban)
    .post('/transfer/:iban?',BankController.makePayment);

module.exports = router;