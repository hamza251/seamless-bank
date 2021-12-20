export const ValidateIban = (value) => {
    let rearrange =
        value.substring(4, value.length)
        + value.substring(0, 4);
    let alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');
    let alphaMap = {};
    let number = [];

    alphabet.forEach((value, index) => {
        alphaMap[value] = index + 10;
    });

    rearrange.split('').forEach((value, index) => {
        number[index] = alphaMap[value] || value;
    });

    return modulo(number.join('').toString(), 97) === 1;
}

const modulo = (aNumStr, aDiv) => {
    var tmp = "";
    var i, r;
    for (i = 0; i < aNumStr.length; i++) {
        tmp += aNumStr.charAt(i);
        r = tmp % aDiv;
        tmp = r.toString();
    }
    return tmp / 1;
}

const objects = {ValidateIban}

export default objects;