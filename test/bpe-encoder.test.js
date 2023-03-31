const { getEncoder, Encoder } = require('../src/models/utils/bpe-encoder.js');

describe('Encoder class', () => {
    const encoder = getEncoder();

    test('encode method encodes text to OpenAI tokens', () => {
        const text = "Hello, world!";
        const expectedTokens = [15496,11,995,0];

        const encoded = encoder.encode(text);

        expect(encoded).toEqual(expectedTokens);
    });

    test('decode method decodes OpenAI tokens to text', () => {
        const tokens = [15496,11,995,0];
        const expectedText = "Hello, world!";

        const decoded = encoder.decode(tokens);

        expect(decoded).toEqual(expectedText);
    });
});

