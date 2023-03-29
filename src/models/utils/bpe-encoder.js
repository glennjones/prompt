

const {encode, decode} = require('gpt-3-encoder')
//import {encode, decode} from 'gpt-3-encoder'

// Wrapper to match the interface of python's promptify
/**
 * @class Encoder - BPE encoder
 * */
class Encoder{
    constructor() {}

    /**
     * Encode text to OpenAI tokens
     * @param {string} text
     * @returns {number[]}
     * */
    encode(text) {
        return encode(text);
    }

    /**
     * Decode OpenAI tokens to text
     * @param {number[]} tokens 
     * @returns {string}
     */
    decode(tokens) {
        return decode(tokens);
    }
}

module.exports = {
    getEncoder() {
        return new Encoder();
    }
}
