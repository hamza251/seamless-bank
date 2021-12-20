//During the test the env variable is set to test
// process.env.NODE_ENV = 'test';

// let mongoose = require("mongoose");
// let Book = require('../app/models/book');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../index');
let should = chai.should();


chai.use(chaiHttp);
//Our parent block
describe('Bank of seamless', () => {
    /*
    * Test the /GET route of balance to get the amount
    */
    describe('/GET', () => {
        it('it should GET the balance that are available in env', (done) => {
            chai.request('http://localhost:2400')
                .get('/v1/api/balance')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                done();
                });
        });
    });

    /** 
     * Test the /GET route of bank by passing the wrong iban number 
     */
    describe('/GET', () => {
        it('it should validate the iban if wrong iban is passed', (done) => {
        let randomString = (Math.random() + 1).toString(36).substring(7);

        chai.request('http://localhost:2400')
            .get(`/v1/api/bank/${randomString}`)
            .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                done();
            });
        });
    })

    /** 
     * Test the /GET route of bank by passing the correct iban number 
     */
    describe('/GET', () => {
        it('it should fetch the bank info if correct iban is passed', (done) => {
          chai.request('http://localhost:2400')
              .get('/v1/api/bank/AE480218297336485969785')
              .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                done();
              });
        });
    });


    /** 
     * Test /POST route of transfer api to check if it validates the wrong iban number
     */
    describe('/POST', () => {   
        it('it should validate the iban', (done) => {
            let randomString = (Math.random() + 1).toString(36).substring(7);
            chai.request('http://localhost:2400')
              .post(`/v1/api/transfer/${randomString}`)
              .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                done();
              });
        });
    });

    /** 
     * Test /POST route of transfer api to check if it validates the empty currency 
     */
     describe('/POST', () => {   
        it('it should validate the empty currency', (done) => {
            chai.request('http://localhost:2400')
              .post(`/v1/api/transfer/AE480218297336485969785?currency=`)
              .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                done();
              });
        });
    });

    /** 
     * Test /POST route of transfer api to check if it validates the integer currency 
     */
     describe('/POST', () => {   
        it('it should validate the integer currency', (done) => {
            chai.request('http://localhost:2400')
              .post(`/v1/api/transfer/AE480218297336485969785?currency=123`)
              .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                done();
              });
        });
    });

    /** 
     * Test /POST route of transfer api to check if the currency is against the iban 
     */
     describe('/POST', () => {   
        it('it should validate if the currency is against the iban', (done) => {
            chai.request('http://localhost:2400')
              .post(`/v1/api/transfer/AE480218297336485969785?currency=PKR`)
              .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                done();
              });
        });
    });

    /** 
     * Test /POST route of transfer api to check if it validates the empty amount 
     */
    describe('/POST', () => {   
        it('it should validate if the amount is empty', (done) => {
            chai.request('http://localhost:2400')
              .post(`/v1/api/transfer/AE480218297336485969785?currency=AED&amount=`)
              .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                done();
              });
        });
    });

    /** 
     * Test /POST route of transfer api to check if it validates the empty amount 
     */
    describe('/POST', () => {   
        it('it should validate if the amount is in character', (done) => {
            chai.request('http://localhost:2400')
              .post(`/v1/api/transfer/AE480218297336485969785?currency=AED&amount=ABC_123`)
              .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                done();
              });
        });
    });

    /** 
     * Test /POST route of transfer api to check wheter the payment is made or not succesfully 
     */
    describe('/POST', () => {   
        it('it should validate if the amount is accepted', (done) => {
            chai.request('http://localhost:2400')
              .post(`/v1/api/transfer/AE480218297336485969785?currency=AED&amount=5000`)
              .end((err, res) => {
                    res.should.have.status(202);
                    res.body.should.be.a('object');
                done();
              });
        });
    });


    /** 
     * Test /POST route of transfer api to check if it validates the when the amount is higher the balance amount 
     */
     describe('/POST', () => {   
        it('it should validate if the amount is higher than the balance amount', (done) => {
            chai.request('http://localhost:2400')
              .post(`/v1/api/transfer/AE480218297336485969785?currency=AED&amount=5000000`)
              .end((err, res) => {
                    res.should.have.status(402);
                    res.body.should.be.a('object');
                done();
              });
        });
    });
});