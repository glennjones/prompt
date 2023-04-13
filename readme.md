# Prompt

At the moment this code is more of a sketched idea than a library, but it is usable if you are interested in tring it out. It may be well your time worth looking at the [Langchain JS](https://github.com/hwchase17/langchainjs) which is the most heavily used tool of this type at the moment (Apr 2023). It is more advanced and has a lot of additional/useful features this tool does not have.

### What is prompt

Its a light warpper around LLM inetrfaces such as OpenAI's ChatGPT. It provides:

- Prompt templating
- Simple interface prompt building in JavaScript
- Switching between model providers - OpenAI built-in, expanable to others
- Fine-tuned model selection for OpenAI
- Structured output for coding aginst
- Safe conversion output text to JSON
- Automatic API retries if service is busy
- Caching archecture

I have been using it to benchmark NER and Classification tasks with OpenAI prompts against other approcahes.  


### Install library

```
npm i @glennjones/prompt
```

### Setup the objects

```
const Prompt = require('prompt');
const {Prompter, OpenAI} = Prompt;
```

### Example of Image result for Named entity recognition (NER)

```
import {OpenAI, Prompter} from prompt

let model = new OpenAI(apiKey);
let prompt = new Prompter(model);

let result = await prompt.fit('ner', {
    domain: 'ux design',
    textInput: 'Senior UX Researcher, part-time 6 month contract, Edinburgh - Hybrid',
  });
console.log(result);

### Output

{
  promptTokens: 152,
  completionTokens: 99,
  totalTokens: 251,
  data: [
    { label: 'Position', text: 'Senior UX Researcher' },
    { label: 'Contract Type', text: 'part-time' },
    { label: 'Contract Duration', text: '6 month' },
    { label: 'Location', text: 'Edinburgh' },
    { label: 'Work Type', text: 'Hybrid' },
    { branch: 'UX Design', group: 'Research' }
  ]
}
```

### TODO

- ~~Get list of models from rest API~~
- ~~Selection of fine tuned models works~~
- ~~Request retry after fixed period~~
- ~~Add Prompt hash~~
- ~~Add Cache interface~~
- ~~Add simple json file cache~~
- Add examples for all templates
- Add JSDocs to support typescript
- Add memory cache
- Parse templates to give user list all variables
- Check chat gtp 3.5 works
  - Check user context is working
  - Check prompt-chains are working
  - Consider extending template structure to have prompt-chains
- Look at allowing the upload and storage of templates

Based on the ideas/code of Promptify - https://github.com/promptslab/promptify
