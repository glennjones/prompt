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
const utilities = require("../models/utils/utilities.js");


const dirPath = path.join(__dirname, 'templates');

/**
 * The Prompter class is used to generate and excute prompts for LLMs.
 */
class Prompter {


    defaults = {
        templatesPath: dirPath,
        templateCaching: false,
        promptHash: false,
        cache: null,
    }

    /**
     * Creates a new instance of the prompter.
     * @constructor
     * @param {Object} model - The model object to use with prompter.
     * @param {Object} options - The options object to configure the template engine.
     * @param {string} options.templatesPath - The path to the directory containing the template files.
     * @param {boolean} [options.templateCaching=true] - Whether to enable template caching.
     * @param {object} [options.cache] - The optional cache object to use with prompter.
     */
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

    /**
     * Lists all the templates available in the prompter.
     */
    listTemplates() {
        return this.environment.listTemplates();
    }
    
    /*
    // TODO: implement this - its not part of nunjucks
    getTemplateVariables(templateName) {
        // gets the variables used in a template

        var template_source = this.environment.loader.getSource(this.environment, templateName);
        var parsed_content = this.environment.parse(template_source);
        var undeclared_variables = meta.findUndeclaredVariables(parsed_content);
        return undeclared_variables;
    }
    */
    

    /**
     * Generates the prompt
     * @param {string} templateName
     * @param {Object} data - Data to pass changes to match the template variables
     * @returns {string} prompt
    */
    generatePrompt(templateName, data) {
        if(templateName.endsWith('.njk') === false) {
            templateName += '.njk';
        }
        const fullPath = path.join(this.config.templatesPath, templateName);

        let templateData = {}
        let keys = Object.keys(data);
        keys.forEach(key => {
            templateData[changeCase.snakeCase(key)] = data[key];
        });

        var template = this.environment.getTemplate(fullPath);
        var prompt = template.render(templateData).trim();
        // decode html entities from nunjucks
        return htmlEntities.decode(prompt);
    }

   
    /**
    *  Creates a hash of the prompt object
    * @param {Object} 
    * @returns {string} hash
    */
    hashPrompt(promptObj) {
        const hash = crypto.createHash('sha256');
        hash.update(JSON.stringify(promptObj));
        return hash.digest('hex');
    }

    /**
     * Run the model with the prompt directly
     * @param {string | object} prompt
     * @param {Object} options - Options to pass to the model and used to generate the prompt
     * @returns {Object} output
    */
    async fitDirect(prompt, options) {

        let promptHash = this.hashPrompt(prompt);
        if(this.cache) {
            let cachedResult = await this.cache.get(promptHash);
            if(cachedResult) {
                return cachedResult.result;
            }
        }

        let output = await this.model.run(prompt, options);
        if(output){
            let out = output[0];
            if(out.text && options && options.stop) {
                out.text += options.stop;
                out.text = this.parseJSON(out.text);
            } else if(out.text) {
                out.text = this.parseJSON(out.text);
            }
            out = this.formatOutput(out);
            if(this.config.promptHash === true){
                out.hash = promptHash;
            }
            if(this.cache) {
                let cacheObject = {
                    hash: promptHash,
                    prompt,
                    result: out,
                    created: new Date(),
                }
                if(options) {
                    cacheObject.templateName = options.templateName !== undefined ? options.templateName : null;
                    cacheObject.text = options.textInput !== undefined ? options.textInput : null;
                }
                await this.cache.add(promptHash, cacheObject);
            }
            return out;
        }else{
            return { err: 'error getting data, please check the console'};
        }
    }

    /**
     * Run the model with the prompt from a template
     * @param {string} templateName
     * @param {Object} options - Options to pass to the model and used to generate the prompt
     * @returns {Object} output
    */
    async fit(templateName, options) {
  
        let prompt = this.generatePrompt(templateName, options); 
        return this.fitDirect(prompt, options);
    }

    /**
    *  Parse text string into JSON
    * @param {string} text
    * @returns {Object}
    */
    parseJSON(text) {
        try {
            const parser = new Parser();
            return parser.extractCompleteObjects(text);
        } catch (err) {
            console.error(err)
            return { err: 'error passing results, please check the console'};
        }
    }


    /**
     *  This turns all the keys in the output object to camelCase
     * @param {Object} obj 
     * @return {Object} 
     */
    formatOutput(obj) {
        let out = utilities.clone(obj);
        let keys = Object.keys(out);
        // camelCase all object property names
        keys.forEach(key => {
            if(changeCase.camelCase(key) !== key){
                out[changeCase.camelCase(key)] = out[key];
                delete out[key];
            }
        });
        // if there is a text property, rename it to data
        if(out.text){
            out.data = utilities.clone(out.text)
            delete out.text;
        }
        return out;
    }
}

module.exports = Prompter;
