const ibanCountryLookup = require('./iban.country.lookup');
module.exports = {
    isIbanValid: function (input) {
        
        const CODE_LENGTHS = ibanCountryLookup();

        const iban = String(input).toUpperCase().replace(/[^A-Z0-9]/g, ''); // keep only alphanumeric characters
        const code = iban.match(/^([A-Z]{2})(\d{2})([A-Z\d]+)$/); // match and capture (1) the country code, (2) the check digits, and (3) the rest
        // check syntax and length
        if (!code || iban.length !== CODE_LENGTHS[code[1]][1]) {
            return false;
        }
        // rearrange country code and check digits, and convert chars to ints
        const digits = (code[3] + code[1] + code[2]).replace(/[A-Z]/g, function (letter) {
            return letter.charCodeAt(0) - 55;
        });
        // final check
        return this.mod97(digits);
    },
    
    mod97:function (string) {
        var checksum = string.slice(0, 2), fragment;
        for (var offset = 2; offset < string.length; offset += 7) {
            fragment = String(checksum) + string.substring(offset, offset + 7);
            checksum = parseInt(fragment, 10) % 97;
        }
        return checksum;
    },

}