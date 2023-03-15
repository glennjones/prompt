import path from "node:path";
import { fileURLToPath } from 'node:url';
import * as changeCase from "change-case";
import { jsonrepair } from 'jsonrepair'
import Nunjucks from 'nunjucks';

function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

const dirPath = fileURLToPath(new URL('./templates/', import.meta.url));

export class Prompter {

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
        /*
        this.modelArgsCount = this.model.run.__code__.coArgCount;
        this.modelVariables = this.model.run.__code__.coVarNames.slice(1, this.modelArgsCount);

        if(options && options.allowedMissingVariablesh) {
            this.allowedMissingVariables = allowedMissingVariables;
        }
        
        this.environment = new Environment(loader = FileSystemLoader(templatesPath));
        */
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
        const fullPath = fileURLToPath(new URL('./templates/' + templateName, import.meta.url));

        let data = {}
        let keys = Object.keys(options);
        keys.forEach(key => {
            data[changeCase.snakeCase(key)] = options[key];
        });

        var template = this.environment.getTemplate(fullPath);
        var prompt = template.render(data).trim();

        //let filePath = path.join(this.templatesPath, templateName);
        //let prompt = nunjucks.render('foo.html', filePath);

        return prompt;
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
            const repaired = jsonrepair(json)
            return JSON.parse(repaired);
        } catch (err) {
            console.error(err)
            return { err: 'error passing results, please check the console'};
        }
    }


}

