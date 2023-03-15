

const {encode, decode} = require('gpt-3-encoder')
//import {encode, decode} from 'gpt-3-encoder'

/*
function getEncoder() {
    return new Encoder();
}
*/

// wrap to match the interface of the python version
class Encoder{
    constructor() {}

    encode(text) {
        return encode(text);
    }

    decode(tokens) {
        return decode(tokens);
    }
}

module.exports = {
    getEncoder() {
        return new Encoder();
    }
}
