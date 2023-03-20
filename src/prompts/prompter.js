/*
import path from "node:path";
import { fileURLToPath } from 'node:url';
import * as changeCase from "change-case";
import { jsonrepair } from 'jsonrepair'
import Nunjucks from 'nunjucks';
*/
const path = require("node:path");
const crypto = require('node:crypto');
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
    
    // allowedMissingVariables = ["examples", "description", "output_format"]
    defaults = {
        templatesPath: dirPath,
        templateCaching: false,
        promptHash: false,
        cache: null,
    }

    constructor(model, options) {
        this.model = model;
        this.config = Object.assign({}, this.defaults, options);

        if(options && options.cache) {
            this.config.promptHash = true;
            this.cache = options.cache;
        }

        let noCache = !this.config.templateCaching;
        const resolver = new Nunjucks.FileSystemLoader(this.config.templatesPath, { noCache, watch: false });
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
        const fullPath = path.join(this.config.templatesPath, templateName);

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

    hashObject(obj) {
        const hash = crypto.createHash('sha256');
        hash.update(JSON.stringify(obj));
        return hash.digest('hex');
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
        let promptHash = this.hashObject(prompt);
        if(this.cache) {
            let cachedResult = await this.cache.get(promptHash);
            if(cachedResult) {
                return cachedResult.result;
            }
        }
      
        let output = await this.model.run(prompt, options);
        if(output){
            let out = output[0];
            if(out.text) {
                out.text += options.stop || '';
                out.text = this.parseJSON(out.text);
            }
            out = this.formatOutput(out);
            if(this.config.promptHash === true){
                out.hash = promptHash;
            }
            if(this.cache) {
                await this.cache.add(promptHash, {
                    hash: promptHash,
                    templateName,
                    text: options.textInput,
                    prompt,
                    result: out
                });
            }
            return out;
        }else{
            return { err: 'error getting data, please check the console'};
        }
        
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

    formatOutput(obj) {
        let out = {}
        let keys = Object.keys(obj);
        keys.forEach(key => {
            out[changeCase.camelCase(key)] = obj[key];
        });
        out.data = clone(out.text)
        delete out.text;
        return out;
    }


}

module.exports = Prompter;
