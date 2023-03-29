const Prompter = require('../src/prompts/prompter.js');
const MockModel = require('../src/models/mock-model.js');
const crypto = require('crypto');


describe('hashPrompt function', () => {

  let model = new MockModel();
  let prompter = new Prompter(model);

  it('should hash the prompt object and return a hex string', () => {
    const promptObj = { prompt: 'What biggest city in the UK?' };
    const hash = crypto.createHash('sha256').update(JSON.stringify(promptObj)).digest('hex');
    expect(prompter.hashPrompt(promptObj)).toEqual(hash);
  });

  it('should return an empty string for an empty prompt object', () => {
    const emptyPromptObj = {};
    const hash = crypto.createHash('sha256').update(JSON.stringify(emptyPromptObj)).digest('hex');
    expect(prompter.hashPrompt(emptyPromptObj)).toEqual(hash);
  });
});

describe('parseJSON function', () => {

  let model = new MockModel();
  let prompter = new Prompter(model);

  it('should return a parsed JSON object when given valid JSON text', () => {
    const inputText = '{"name": "John", "age": 30, "city": "New York"}';
    const expectedOutput = [{ name: 'John', age: 30, city: 'New York' }];
    const result = prompter.parseJSON(inputText);
    expect(result).toEqual(expectedOutput);
  });

  it('should return a parsed JSON object when given valid JSON text', () => {
    const inputText = 'This is just text: {"name": "John", "age": 30, "city": "New York"}';
    const expectedOutput = [{ name: 'John', age: 30, city: 'New York' }];
    const result = prompter.parseJSON(inputText);
    expect(result).toEqual(expectedOutput);
  });

  it('should return an empty object when given just text', () => {
    const inputText = 'This is just text';
    const expectedOutput = [];
    const result = prompter.parseJSON(inputText);
    expect(result).toEqual(expectedOutput);
  });

  it('should return an empty object when given invalid JSON in the text', () => {
    const inputText = 'This is not valid JSON text {"test":{ "test"}';
    const expectedOutput = [];
    const result = prompter.parseJSON(inputText);
    expect(result).toEqual(expectedOutput);
  });

  it('should return an empty object when given empty string', () => {
    const inputText = '';
    const expectedOutput = [];
    const result = prompter.parseJSON(inputText);
    expect(result).toEqual(expectedOutput);
  });

});



describe('formatOutput function', () => {

  let model = new MockModel();
  let prompter = new Prompter(model);

  it('should return an object with camelCase keys and data property', () => {
    const inputObj = {
      some_text: 'foo',
      another_text: 'bar',
      text: ['a', 'b', 'c']
    };
    const expectedOutput = {
      someText: 'foo',
      anotherText: 'bar',
      data: ['a', 'b', 'c']
    };
    const result = prompter.formatOutput(inputObj);
    expect(result).toEqual(expectedOutput);
  });

  
  it('should return an empty object if input object is empty', () => {
    const inputObj = {};
    const expectedOutput = {};
    const result = prompter.formatOutput(inputObj);
    expect(result).toEqual(expectedOutput);
  });

  it('should return an object with only the data property if input object has no keys except text', () => {
    const inputObj = { text: ['a', 'b', 'c'] };
    const expectedOutput = { data: ['a', 'b', 'c'] };
    const result = prompter.formatOutput(inputObj);
    expect(result).toEqual(expectedOutput);
  });

  it('should not modify the original input object', () => {
    const inputObj = { some_text: 'foo', text: ['a', 'b', 'c'] };
    const expectedOutput = { someText: 'foo', data: ['a', 'b', 'c'] };
    prompter.formatOutput(inputObj);
    expect(inputObj).toEqual({ some_text: 'foo', text: ['a', 'b', 'c'] });
  });
  
});
