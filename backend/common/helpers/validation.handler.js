const ibanCountryLookup = require('./iban.country.lookup');
module.exports = {
    isIbanValid: function (input) {
        
        let rearrange = input.substring(4, input.length) + input.substring(0, 4);
        let alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');
        let alphaMap = {};
        let number = [];

        alphabet.forEach((value, index) => {
            alphaMap[value] = index + 10;
        });

        rearrange.split('').forEach((value, index) => {
            number[index] = alphaMap[value] || value;
        });

        return this.modulo(number.join('').toString(), 97) === 1;
    },
    
    modulo:function (aNumStr,aDiv) {
        var tmp = "";
        var i, r;
        for (i = 0; i < aNumStr.length; i++) {
            tmp += aNumStr.charAt(i);
            r = tmp % aDiv;
            tmp = r.toString();
        }
        return tmp / 1;
    },
}