// Can import CJS module directly in ESM.
import prompt from "./index.js";

export const OpenAI = prompt.OpenAI;
export const Prompter = prompt.Prompter;

export default {OpenAI, Prompter}