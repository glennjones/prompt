import * as DotEnv from 'dotenv';
DotEnv.config();
const apiKey = process.env.OPENAI_API_KEY;


import {OpenAI, Prompter} from './index.js'

let model = new OpenAI(apiKey);
let nlpPrompter = new Prompter(model);

let result = await nlpPrompter.fit('ner.njk', {
    domain: 'medical',
    textInput: 'I have a headache and I feel sick. I think I have the flu. I saw a doctor who sent me to the nurse',
    labels: ["SYMPTOM", "DISEASE", "PROFESSIONAL",]
})
console.log(result)
