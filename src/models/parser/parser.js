const { jsonrepair } = require('jsonrepair')

// This file was converted from Python to JavaScript using GTP
// Add the jsonrepair library to fix any issues inside the complete objects 

class Parser {
    constructor() {
    }


    // check if a string is valid JSON
    isValidJSON(inputStr) {
        try {
            JSON.parse(inputStr);
            return true;
        } catch (e) {
            return false;
        }
    }
    
    // check if a string is valid Python
    getCombinations(candidateMarks, n, shouldEndMark = null) {
        let combinations = [];
        for (let i = 1; i <= n; i++) {
            for (let comb of this.product(candidateMarks, i)) {
                if (shouldEndMark !== null && comb[comb.length - 1] !== shouldEndMark) {
                    continue;
                }
                combinations.push(comb.join(""));
            }
        }
        return combinations;
    }
    
    product(candidateMarks, n) {
        let combinations = [];
        let comb = [];
        let i = 0;
        while (i < n) {
            comb.push(candidateMarks[i]);
            i++;
        }
        combinations.push(comb);
        while (i < candidateMarks.length) {
            comb = comb.slice(1);
            comb.push(candidateMarks[i]);
            combinations.push(comb);
            i++;
        }
        return combinations;
    }

    completeJsonObject(jsonStr, completionStr) {
        while (true) {
            if (!jsonStr) {
                throw new Error("Couldn't fix JSON");
            }
            try {
                const completeJsonStr = jsonStr + completionStr;
                const pythonObj = JSON.parse(completeJsonStr);
            } catch (e) {
                jsonStr = jsonStr.slice(0, -1);
                continue;
            }
            return pythonObj;
        }
    }

    getPossibleCompletions(jsonStr, maxCompletionLength = 5) {
        // Determine possible candidate marks
        let candidateMarks = ['}', ']'];
        if (!jsonStr.includes('[')) {
            candidateMarks.splice(candidateMarks.indexOf(']'), 1);
        }
        if (!jsonStr.includes('{')) {
            candidateMarks.splice(candidateMarks.indexOf('}'), 1);
        }
    
        // Determine the mark the completion string should end with
        let shouldEndMark = jsonStr.trim()[0] === '[' ? ']' : '}';
    
        // Generate completion strings and attempt to complete the JSON object
        let completions = [];
        for (let completionStr of getCombinations(candidateMarks, maxCompletionLength, shouldEndMark)) {
            try {
                let completedObj = completeJsonObject(jsonStr, completionStr);
                completions.push(completedObj);
            } catch (e) {
                // pass
            }
        }
    
        // Find the longest completion and return it
        return findMaxLength(completions);
    }

    fit(json_str, max_completion_length = 5) {
        try {
            let output = eval(json_str);
            return {
                "status": "completed",
                "object_type": typeof output,
                "data": {"completion": output, "suggestions": []},
            };
        } catch (e) {
            json_str = json_str.replace(/[\[\]\{\}\s]+$/, '');
            try {
                let completions = this.get_possible_completions(
                    json_str, max_completion_length=max_completion_length
                );
                return {
                    "status": "incomplete",
                    "object_type": null,
                    "data": {"suggestions": completions},
                };
            } catch (e) {
                return {
                    "status": "failed",
                    "object_type": null,
                    "data": {"error_message": e.toString()},
                };
            }
        }
    }

    findMaxLength(dataList) {
        // Find the maximum length in the list
        let maxLength = Math.max(...dataList.map(element => element.toString().length));
    
        // Create a new dictionary with the element with the maximum length as the 'completion' value
        // and a list of all elements sorted by length as the 'suggestions' value.
        let outputDict = {
            completion: dataList.find(element => element.toString().length === maxLength),
            suggestions: dataList.sort((a, b) => b.toString().length - a.toString().length),
        };
        return outputDict;
    }

    extractCompleteObjects(string) {
        const objectRegex = /(?<!\\)(\[[^][]*?(?<!\\)\]|\{[^{}]*\})/g;
        // The regular expression pattern matches any string starting with an opening brace or bracket,
        // followed by any number of non-brace and non-bracket characters, and ending with a closing brace
        // or bracket that is not preceded by an odd number of backslash escape characters.

        let objectStrings = [];
        let opening = { '{': 0, '[': 0 };
        let closing = { '}': '{', ']': '[' };
        let stack = [];
        let start = 0;

        for (const match of string.matchAll(objectRegex)) {
            if (stack.length === 0) {
                start = match.index;
            }
            stack.push(match[0]);

            if (match[0][match[0].length - 1] in closing) {
                let openingBracket = closing[match[0][match[0].length - 1]];
                opening[openingBracket] += 1;
                if (opening[openingBracket] === Object.values(opening).filter(value => value !== 0).length) {
                    objectStrings.push(string.substring(start, match.index + match[0].length));
                    stack = [];
                    opening = { '{': 0, '[': 0 };
                    closing = { '}': '{', ']': '[' };
                }
            }
        }

        if (stack.length > 0) {
            console.log(`Error: Incomplete object at end of string: ${stack[stack.length - 1]}`);
        }

        let objects = [];
        for (const objectString of objectStrings) {
            try {
                const repaired = jsonrepair(objectString);
                const obj = JSON.parse(repaired);
                objects.push(obj);
            } catch (e) {
                // If the string cannot be safely evaluated as a JavaScript object, log an error and move on to the next object.
                console.log(`Error evaluating object string '${objectString}': ${e}`);
            }
        }

        return objects;
    }


}

module.exports = Parser;