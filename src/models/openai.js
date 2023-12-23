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
const { performance } = require('perf_hooks');
const utilities = require("./utils/utilities.js");


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


/**
 * @constant {Array} GPTModelTOKENS - The maximum number of tokens for each GPT model
 */
const GPTModelTOKENS = [
    { regEx: /gpt-4((?=-).*)?/, maxTokens: 4096},
    { regEx: /gpt-4-32k((?=-).*)?/, maxTokens: 32768},
    { regEx: /gpt-3.5-turbo((?=-).*)?/, maxTokens: 4096},
    { regEx: /gpt-3.5-turbo-16k((?=-).*)?/, maxTokens: 16385},
    { regEx: /\bdavinci\b/, maxTokens: 4000},
    { regEx: /\bcurie\b/, maxTokens:  2048},
    { regEx: /\bbabbage\b/, maxTokens:  2048},
    { regEx: /\bada\b/, maxTokens: 2048},
]


/**
 * @class OpenAI
 */ 
class OpenAI extends Model {

    /**
   * @constructor
   * @param {string} name - The name of the model
   * @param {string} description - The description of the model
   */
    constructor(apiKey, model = "text-davinci-003") {
        super();
        this.name = "OpenAI";
        this.description = "OpenAI API for text completion using various models";
        this.apiKey = apiKey;
        this.model = model;
        //const configuration = new Configuration({ apiKey: this.apiKey });
        //this.openai = new OpenAIApi(configuration);
        this.supportedModels = [
            "gpt-4",
            "gpt-4-32k",
            "gpt-3.5-turbo",
            "gpt-3.5-turbo-16k",
            "gpt-3.5-turbo-instruct",
            "text-davinci-003",
            "text-curie-001",
            "text-babbage-001",
            "text-ada-001",
        ];
        this.encoder = getEncoder();
        //assert(this.supportedModels.includes(this.model), "model not supported");
    }

    /**
     * Lists all the models available in the model.
     * @returns {Array} - An array of model objects
     * */
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
            let time = performance.now();
            let response = await axios.get(apiEndpoint, config);
            if(response.data.data){
                console.log(`${(performance.now() - time) / 1000} seconds`);
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
    }

    /**
    * @param {string} prompt - The prompt to use for the completion
    * @param {Object} options - The options to use for the completion
    * @param {string} options.suffix - The suffix to use for the completion
    * @param {number} options.maxTokens - The maximum number of tokens to generate
    * @param {number} options.temperature - The temperature to use for the completion
    * @param {number} options.topP - The topP to use for the completion
    * @param {string} options.stop - The stop sequence to use for the completion
    * @param {number} options.presencePenalty - The presence penalty to use for the completion
    * @param {number} options.frequencyPenalty - The frequency penalty to use for the completion
    * @returns {string} - The completion
    * */
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
        let completionsOpions = utilities.clone(config);
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

    /**
     * @param {Object} options - The options to use for the completion
     * @param {string} options.model - The model to use for the completion
     * @param {string} options.prompt - The prompt to use for the completion
     * @param {number} options.maxTokens - The maximum number of tokens to generate
     * @param {number} options.temperature - The temperature to use for the completion
     * @param {number} options.topP - The topP to use for the completion
     * @param {string} options.stop - The stop sequence to use for the completion
     * @returns {string} - The completion
     * */
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
            let time = performance.now();
            let response = await axios.post(apiEndpoint, requestData, config);
            console.log(`${(performance.now() - time) / 1000} seconds`);
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