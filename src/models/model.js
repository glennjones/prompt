
/**
 * @class Model
 */ 
class Model {

  /**
   * @constructor
   * @param {string} name - The name of the model
   * @param {string} description - The description of the model
   */
  constructor(name, description) {
    this.name = name;
    this.description = description;
  }

  /**
   * Lists all the models available in the model.
   * @returns {Array} - An array of model objects
  */
  listModels() {
    throw new Error('Not implemented');
  }

  /**
   * Verifies if a model exists in the model.
   * @param {string} model - The model name to verify
   * @returns {boolean} - True if the model exists, false otherwise
   * */
  verifyModel(model) {
    return this.listModels().includes(model);
  }

  /**
   * Runs the model.
   */
  run() {
    throw new Error('Not implemented');
  }
}

module.exports = Model;
