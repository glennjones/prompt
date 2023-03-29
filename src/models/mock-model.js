const Model = require('./model.js');

class MockModel extends Model {
  constructor() {
    super();
    this.name = 'MockModel';
    this.description = 'MockModel for testing';
  }

  listModels() {
    throw ['mock-model'];
  }

  verifyModel(model) {
    return true;
  }

  run() {
    return { data: { choices: [{ text: 'mock-model' }] } };
  }
}

module.exports = MockModel;
