const DotEnv = require('dotenv');
DotEnv.config();
const lineByLine = require('n-readlines');
const fs = require('fs');
const path = require('path');


const apiKey = process.env.OPENAI_API_KEY;
const { OpenAI, Prompter, FileCache } = require('../index.js');

let model = new OpenAI(apiKey);
let fileCache = new FileCache('./cache.jsonl');
let nlpPrompter = new Prompter(model, {cache: fileCache});

const labels = [
    'JOBTITLE',
    'EMPLOYMENT_TYPE',
    'DURATION',
    'LOCATION',
    'REMOTE_OPTION',
];
const domain = 'ux design';


// promise that wait for X ms
function sleep(ms) {
    return new Promise(resolve => {
      setTimeout(resolve, ms)
    });
}

// promise that gets data from a prompt
async function getData(jobTitle) {
    return nlpPrompter.fit('ner.njk', {
        domain,
        labels,
        textInput: jobTitle,
    });
}

// 20 requests per minute; 1 request per 3 seconds ignoring api call execution time
async function getAllData(jobTitles){
    let results = [];
    let requestCount = 0;
    for (let index = 0; index < jobTitles.length; index++) {
        const jobTitle = jobTitles[index];
        //console.log(`${index}: '${jobTitle}'`)

        const t0 = performance.now();
        let result = await getData(jobTitle.trim());
        const t1 = performance.now();

        result.orginalText = jobTitle;
        results.push(result);
        console.log(`${index}: '${jobTitle}' - cached:${result.cached || false}`)
        if(!result.cached){
            requestCount++;
            console.log(`API took  ${parseFloat(t1 - t0).toFixed(1)} milliseconds. ${requestCount} requests so far.`);
            await sleep(5000);
        }
    }
    return results;

}

function getTimeStr(){
    let now = new Date();
    return `${now.getUTCHours()}:${now.getUTCMinutes()}:${now.getUTCSeconds()}`;
}

// save to a jsonl file
function saveData(filePath, data) {
    let saveFilePath = path.resolve(__dirname, filePath);
    let dataAllLines = data.map((line) => {
        return JSON.stringify(line);
    }).join('\r\n');
    fs.writeFileSync(saveFilePath, dataAllLines);
}

// load from a jsonl file
function loadData(filePath) {
    let laodFilePath = path.resolve(__dirname, filePath);
    let rawData = [];
    const liner = new lineByLine(laodFilePath);
    let line;
    while (line = liner.next()) {
        let text = line.toString('utf8')
        if(text.trim() !== '') {
            let json = JSON.parse(text)
            rawData.push(json);
        }
    }
    return rawData;
}


const titles = loadData('../data/ux-job-titles-01.jsonl');
const jobTitles = titles.map((item) => {
    return item.text;
});

getAllData(jobTitles).then((results) => {
    console.log(JSON.stringify(results, null, 2));
    saveData('../data/ux-job-titles-01-processed.jsonl', data)
});
  
 