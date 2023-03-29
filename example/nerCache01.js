//import * as DotEnv from 'dotenv';
const DotEnv = require('dotenv');
DotEnv.config();
const apiKey = process.env.OPENAI_API_KEY;

//import { OpenAI, Prompter } from './index.js';
const { OpenAI, Prompter, FileCache } = require('../index.js');

async function test() {
  let model = new OpenAI(apiKey);
  let fileCache = new FileCache('./cache.jsonl');
  let prompt = new Prompter(model, {cache: fileCache});

  let labels = [
    'JOBTITLE',
    'EMPLOYMENT_TYPE',
    'DURATION',
    'LOCATION',
    'REMOTE_OPTION',
  ]

  let result1 = await prompt.fit('ner.njk', {
    domain: 'ux design',
    labels: labels,
    textInput: 'UX/UI Copy Writer, Edinburgh or Hybrid',
  });

  let result2 = await prompt.fit('ner.njk', {
    domain: 'ux design',
    labels: labels,
    textInput: 'UX/UI Research, Part-time',
  });

  console.log(result1);
  console.log(result2);
}

test();
