//import * as DotEnv from 'dotenv';
const DotEnv = require('dotenv');
DotEnv.config();
const apiKey = process.env.OPENAI_API_KEY;

//import { OpenAI, Prompter } from './index.js';
const {OpenAI, Prompter} = require('../index.js');

async function test() {
  let model = new OpenAI(apiKey);
  let prompt = new Prompter(model);

  let text = "UX/UI Designer, Edinburgh or fully Remote"
  let labels = [
    { label: 'JOBTITLE', text: 'UX/UI Designer' },
    { label: 'LOCATION', text: 'Edinburgh'  },
    { label: 'REMOTE_OPTION', text: 'fully Remote' },
    { branch: 'UX', group: 'Design' }
  ]
  let fineTune = [
    [text, labels]
  ]
  
  let result = await prompt.fit('ner', {
      domain: 'ux design job titles',
      labels: ["JOBTITLE", "EMPLOYMENT_TYPE", "DURATION", "LOCATION", "REMOTE_OPTION"],
      textInput: 'UX/UI Copy Writer, Edinburgh or Hybrid',
      examples: fineTune
      });
 
  console.log(result);
}

test()


