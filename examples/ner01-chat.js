//import * as DotEnv from 'dotenv';
const DotEnv = require('dotenv');
DotEnv.config();
const apiKey = process.env.OPENAI_API_KEY;

//import { OpenAI, Prompter } from './index.js';
const {OpenAI, Prompter} = require('../index.js');

async function test() {
  let model = new OpenAI(apiKey, 'ft:gpt-3.5-turbo-1106:personal::8YeKzTz6');
  let prompt = new Prompter(model);

  const messages = [{"role": "system", "content": "You are a named entity recognition system focused on job title parsing."},
  {"role": "user", "content": " Lead UX/UI Designer, Edinburgh or fully Remote ->"}];

  let result = await prompt.fitDirect(messages);
 
  console.log(JSON.stringify(result));
}

test()


