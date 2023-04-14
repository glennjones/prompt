// Can import CJS module directly in ESM.
import prompt from "./index.js";

export const OpenAI = prompt.OpenAI;
export const Prompter = prompt.Prompter;
export const FileCache = prompt.FileCache;
export const MongodbCache = prompt.MongodbCache;

export default {OpenAI, Prompter, FileCache, MongodbCache}