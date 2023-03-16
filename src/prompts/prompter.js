/*
import path from "node:path";
import { fileURLToPath } from 'node:url';
import * as changeCase from "change-case";
import { jsonrepair } from 'jsonrepair'
import Nunjucks from 'nunjucks';
*/
const path = require("node:path");
//const { fileURLToPath } = require('node:url');
const changeCase = require("change-case");
const Nunjucks = require('nunjucks');
const htmlEntities = require('html-entities');
const Parser = require("../models/parser/parser.js");



function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

// const dirPath = fileURLToPath(new URL('./templates/', import.meta.url));
const dirPath = path.join(__dirname, 'templates');

class Prompter {

    // defaults
    allowedMissingVariables = ["examples", "description", "output_format"];


    // options = templatesPath = templatesDir, allowedMissingVariables = ["examples", "description", "output_format"]
    constructor(model, options) {
        this.model = model;
        this.templatesPath = dirPath;

        if(options && options.templatesPath) {
            this.templatesPath = options.templatesPath;
        }
        const resolver = new Nunjucks.FileSystemLoader(this.templatesPath, { noCache: true, watch: false });
        this.environment = new Nunjucks.Environment(resolver)
    }

    listTemplates() {
        return this.environment.listTemplates();
    }
    
    getTemplateVariables(templateName) {
        // gets the variables used in a template

        var template_source = this.environment.loader.getSource(this.environment, templateName);
        var parsed_content = this.environment.parse(template_source);
        var undeclared_variables = meta.findUndeclaredVariables(parsed_content);
        return undeclared_variables;
    }
    
    generatePrompt(templateName, options) {
        // find missing variables
        /*
        var variables = this.getTemplateVariables(templateName);
        var variablesMissing = [];
        for (var _i = 0, variables1 = variables; _i < variables1.length; _i++) {
            var variable = variables1[_i];
            if (variable in kwargs === false && this.allowedMissingVariables.indexOf(variable) === -1) {
                variablesMissing.push(variable);
            }
        }
        assert(variablesMissing.length === 0, "Missing required variables in template " + variablesMissing);
        */

        // load and render template
        //const fullPath = fileURLToPath(new URL('./templates/' + templateName, import.meta.url));
        const fullPath = path.join(this.templatesPath, templateName);

        let data = {}
        let keys = Object.keys(options);
        keys.forEach(key => {
            data[changeCase.snakeCase(key)] = options[key];
        });

        var template = this.environment.getTemplate(fullPath);
        var prompt = template.render(data).trim();
        // decode html entities from nunjucks
        return htmlEntities.decode(prompt);
    }


    async fit(templateName, options) {
        /*
        let promptVariables = this.getTemplateVariables(templateName);
        let promptKwargs = {};
        let modelKwargs = {};
        for (let variable in kwargs) {
            if (promptVariables.includes(variable)) {
                promptKwargs[variable] = kwargs[variable];
            } else if (this.modelVariables.includes(variable)) {
                modelKwargs[variable] = kwargs[variable];
            }
        }
        */
        let prompt = this.generatePrompt(templateName, options);
        let output = await this.model.run(prompt, options);
        let result = output[0];
        if(result.text) {
            result.text = this.parseJSON(result.text)
        }

        return result
    }

    parseJSON(json) {
        try {
            const parser  = new Parser();
            return parser.extractCompleteObjects(json);
        } catch (err) {
            console.error(err)
            return { err: 'error passing results, please check the console'};
        }
    }


}

module.exports = Prompter;
