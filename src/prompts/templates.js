
/**
 * The Templates class is a collection of prompt templates for LLMs.
 */
class Templates {

}


/**
 * The Template class prompt template for LLMs.
 */
class Template {
    templateString = null;
    name = null;
    type = null;
    path = null;
    cache = false;

    
    constructor() {    
    }

    parse() {
        // parse the template
    }

    render() {
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

}