//import * as DotEnv from 'dotenv';
const DotEnv = require('dotenv');
DotEnv.config();
const apiKey = process.env.OPENAI_API_KEY;
const mongodbUri = process.env.MONGODB_URI;
const mongodbDatabase = process.env.MONGODB_DATEBASE;

//import { OpenAI, Prompter } from './index.js';
const { OpenAI, Prompter, MongodbCache } = require('../../index.js');

async function test() {
  let model = new OpenAI(apiKey);
  let mongodbCache = new MongodbCache(mongodbUri, mongodbDatabase);
  let prompt = new Prompter(model, {cache: mongodbCache});

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
