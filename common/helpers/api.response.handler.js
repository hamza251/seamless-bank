const { response } = require("express");

module.exports = {
    responseObject:null,
    /**
     * function for catching error response only
     * @param {Object} responseObject
     * @param {Object} details 
     * @param {integer} statusCode 
     * @return JSON
     */
    errorApiResponse: function (detailsObj,statusCode) {
        let res = this.getResponseObject();
        res.status(statusCode);
        return res.send({
            "code": statusCode,
            "error": detailsObj
        });
    },

    /**
     * function for catching success response only
     * @param {Object} details 
     * @param {integer} statusCode
     * @return JSON 
     */
    successApiResponse: function (detailsObj, statusCode) {
        let res = this.getResponseObject();

        res.status(statusCode);
        return res.send({
            "code": statusCode,
            "data": detailsObj
        });
    },

    /**
     * function for catching response that belongs to 200
     * 
     * @param {Object} details 
     * @param {integer} statusCode 
     */
    success: function (detailsObj, statusCode = 200){
        return this.successApiResponse(detailsObj,statusCode);
    },

    /**
     * function for catching response that belongs to 202
     * 
     * @param {Object} details 
     * @param {integer} statusCode 
     */
     successAccepted: function (detailsObj, statusCode = 202){
        return this.successApiResponse(detailsObj,statusCode);
    },
    /**
     * function for catching response that belongs to 200
     * 
     * @param {Object} details 
     * @param {integer} statusCode 
     */
    error: function (detailsObj, statusCode = 500){
        return this.errorApiResponse(detailsObj,statusCode);
    },
    
    /**
     * function for catching response when the amount is exceeded
     * 
     * @param {Object} details 
     * @param {integer} statusCode 
     */
    amountExceed: function (detailsObj, statusCode = 402){
        return this.errorApiResponse(detailsObj,statusCode);
    },
     /**
     * function for catching response that conflicts for any reason 
     * 
     * @param {Object} details 
     * @param {integer} statusCode 
     */
    conflict: function (detailsObj, statusCode = 409){
        return this.errorApiResponse(detailsObj,statusCode);
    },
    /**
     * function for catching response that belongs to 200
     * 
     * @param {Object} details 
     * @param {integer} statusCode 
     */
     badRequest: function (detailsObj, statusCode = 400){
        return this.errorApiResponse(detailsObj,statusCode);
    },
    /**
     * function for catching gatway timeout 
     * 
     * @param {Object} responseObject
     * @param {Object} details 
     * @param {integer} statusCode 
     */
    timeout: function (detailsObj, statusCode = 503){
        return this.errorApiResponse(detailsObj,statusCode);
    },

    /**
     * missing required field
     * 
     * @param {Object} responseObject
     * @param {Object} details 
     * @param {integer} statusCode 
     */
     missingRequiredFields: function (detailsObj, statusCode = 412){
        return this.errorApiResponse(detailsObj,statusCode);
    },
    /**
     * set the request object 
     * 
     * @param {Object} reqObject
     * @return null 
     */
    setResponseObject: function (res){
        this.responseObject = res;
    },

    /**
     * get the request object 
     * @return {Object} 
     */
    getResponseObject: function (){
        return this.responseObject
    },

}