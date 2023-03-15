
import { OpenAI } from "../models/openai.js";
//import { Prompter } from "../prompts/prompter.js";

function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

export default {
    clone
}