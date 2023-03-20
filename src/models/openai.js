/*
import { Model } from './model.js';
import { getEncoder } from './utils/bpe-encoder.js';
import { Configuration, OpenAIApi } from 'openai';
import axios from 'axios';
import assert from 'node:assert/strict';
*/
const Model = require('./model.js');
const { getEncoder } = require('./utils/bpe-encoder.js');
const { Configuration, OpenAIApi } = require('openai');
const axios = require('axios');
const axiosRetry = require('axios-retry');


axiosRetry(axios, {
    retries: 3, 
    //retryDelay: axiosRetry.exponentialDelay,
    retryDelay: (retryCount) => {
        return 10000; // 10 seconds
    },
    onRetry: (retryCount) => {
        console.log(`retry attempt: ${retryCount}`);
    },
});


// regexes for model names and their token counts
const GPTModelTOKENS = [
    { regEx: /gpt-3.5-turbo((?=-).*)?/, maxTokens: 4096},
    { regEx: /\bdavinci\b/, maxTokens: 4000},
    { regEx: /\bcurie\b/, maxTokens:  2048},
    { regEx: /\bbabbage\b/, maxTokens:  2048},
    { regEx: /\bada\b/, maxTokens: 2048},
]

function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
}


class OpenAI extends Model {

    constructor(apiKey, model = "text-davinci-003") {
        super();
        this.name = "OpenAI";
        this.description = "OpenAI API for text completion using various models";
        this.apiKey = apiKey;
        this.model = model;
        const configuration = new Configuration({ apiKey: this.apiKey });
        this.openai = new OpenAIApi(configuration);
        this.supportedModels = [
            "gpt-3.5-turbo",
            "text-davinci-003",
            "text-curie-001",
            "text-babbage-001",
            "text-ada-001",
        ];
        this.encoder = getEncoder();
        //assert(this.supportedModels.includes(this.model), "model not supported");
    }


    async listModels() {

        const apiEndpoint = 'https://api.openai.com/v1/models';
        const apiKey = this.apiKey;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + apiKey,
            },
        };
    
        try {
            let response = await axios.get(apiEndpoint, config);
            if(response.data.data){
                return response.data.data
            } 
            console.log('error message: ', 'no data from openai models api endpoint');
            return null;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.log('error message: ', error.message);
            } else {
                console.log('unexpected error: ', error);
            }
            return null;
        }
        
        /*
        // get all models for OpenAI API
        const listOfModels = this.openai.Model.list()["data"].map(model => model.id);
        // compare with supported models and return modellist
        const models = [];
        for (const model of this.supportedModels) {
            if (listOfModels.includes(model)) {
                models.push(model);
            }
        }
      
        return models;
        */
    }


    async run(prompt, options) {

        let defaults = {
            suffix: null,
            maxTokens: null,
            temperature: 0,
            topP: 1,
            stop: null,
            presencePenalty: 0,
            frequencyPenalty: 0,
        }
        let config = { ...defaults, ...options };
        const result = [];

        /*
        {
            "model": "text-davinci-003",
            "prompt": "Say this is a test",
            "max_tokens": 7,
            "temperature": 0,
            "top_p": 1,
            "n": 1,
            "stream": false,
            "logprobs": null,
            "stop": "\n"
        }
        */


     
        // Automatically calculate max output tokens if not specified
        if (!config.maxTokens) {
            const prompTokens = this.encoder.encode(prompt).length;
            let foundModel = GPTModelTOKENS.filter( item => {
                let x = item.regEx.test(this.model.toLowerCase())
                return x
            })
            let modelmaxTokens = foundModel[0].maxTokens;
            config.maxTokens = modelmaxTokens - prompTokens;
        }


        const data = {};
        let response;
        let completionsOpions = clone(config);
        completionsOpions.model = this.model;
        if (this.model.startsWith("gpt-3.5-turbo")) {
            completionsOpions.messages = [{role: "user", content: prompt}];
            response = await this.getCompletions(completionsOpions);
            data["text"] = response["choices"][0]["message"]["content"];
            data["role"] = response["choices"][0]["message"]["role"];

        } else {
            completionsOpions.model = this.model;
            completionsOpions.prompt = prompt;
            response = await this.getCompletions(completionsOpions);
            if(response){
                data["text"] = response["choices"][0]["text"];
            }
        }
        Object.assign(data, response["usage"]);
        result.push(data);
        
        return result
    }

    // list of models
    // GET  https://api.openai.com/v1/models

    async getCompletions(options) {
        // look in cache first
     
        const apiEndpoint = 'https://api.openai.com/v1/completions';
        const apiKey = this.apiKey;
    
        // Set up the request body with the given parameters
        const requestData = {
            model: options.model,
            prompt: options.prompt,
            temperature: options.temperature,
            max_tokens: options.maxTokens,
            top_p: options.topP,
            stop: options.stop,
        };
    
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + apiKey,
            },

        };
    
        try {
            console.log('fired api request: ')
            let response = await axios.post(apiEndpoint, requestData, config);
            return response.data
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.log('error message: ', error.message);
                //return error.message;
            } else {
                console.log('unexpected error: ', error);
                //return 'An unexpected API post request error occurred';
            }
            return null;
        }
        
    }
    

}

module.exports = OpenAI;