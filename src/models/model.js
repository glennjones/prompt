class Model {
    constructor(name, description) {
        this.name = name;
        this.description = description;
    }

    list_models() {
        throw new Error("Not implemented");
    }

    verify_model(model) {
        return this.list_models().includes(model);
    }

    run() {
        throw new Error("Not implemented");
    }
}

module.exports = Model;