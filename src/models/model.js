class Model {
  constructor(name, description) {
    this.name = name;
    this.description = description;
  }

  listModels() {
    throw new Error('Not implemented');
  }

  verifyModel(model) {
    return this.listModels().includes(model);
  }

  run() {
    throw new Error('Not implemented');
  }
}

module.exports = Model;
