# Prompt

### IN DEVELOPMENT - INTERFACE IS NOT YET FIXED
At the moment this code is more of a sketched idea than a library, but it is usable if you are interested in tring it out.

TODO
* ~~Get list of models from rest API~~
* ~~Selection of fine tuned models works~~
* ~~Request retry after fixed period~~
* ~~Add Prompt hash~~
* ~~Add Cache interface~~
* ~~Add simple json file cache~~
* Add que system
* Add examples for all templates
* Add JSDocs to support typescript


Based on the ideas/code of Promptify - https://github.com/promptslab/promptify

### Install library

```
npm i https://github.com/glennjones/prompt
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