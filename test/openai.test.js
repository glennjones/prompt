//const Model = require('..src/models/model.js');
const OpenAI = require('../src/models/openai.js');

jest.mock('axios');

describe('OpenAI', () => {
  let openai;

  beforeEach(() => {
    openai = new OpenAI('fake-api-key', 'text-davinci-003');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  
  describe('constructor', () => {
    it('should create a new OpenAI instance', () => {
      expect(openai).toBeInstanceOf(OpenAI);
      expect(openai.name).toEqual('OpenAI');
      expect(openai.description).toEqual('OpenAI API for text completion using various models');
      expect(openai.apiKey).toEqual('fake-api-key');
      expect(openai.model).toEqual('text-davinci-003');
      expect(openai.supportedModels).toEqual([
        'gpt-3.5-turbo',
        'text-davinci-003',
        'text-curie-001',
        'text-babbage-001',
        'text-ada-001',
      ]);
      expect(openai.encoder).toBeDefined();
    });
  });


  describe('listModels', () => {
    it('should return an array of model objects', async () => {
      const models = [
        { regEx: /\bdavinci\b/, maxTokens: 4000},
        { regEx: /\bcurie\b/, maxTokens:  2048},
      ];
      const mockedResponse = models;
      jest.spyOn(openai, 'listModels').mockResolvedValue(mockedResponse);

      const result = await openai.listModels();

      expect(result).toEqual(models);
    });

  });

  
  describe('run', () => {
    it('should return a completion', async () => {
      const prompt = 'The quick brown fox';
      const options = { maxTokens: 20 };
      const completions = { choices: [{ text: ' jumps over the lazy dog.' }] };
      const mockedResponse =  completions;
      jest.spyOn(openai, 'getCompletions').mockResolvedValue(mockedResponse);

      const result = await openai.run(prompt, options);

      expect(result).toEqual([{"text": " jumps over the lazy dog."}]);
    });
  });

  
});
