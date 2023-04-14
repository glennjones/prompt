const lineByLine = require('n-readlines');
const fs = require('fs');
const path = require('path');
const Cache = require('./cache');

// Description: stores cache data in a JSONl file
/**
 * Stores completion objects from prompts into JSONL file
 * @extends Cache - The base cache class
 */
class FileCache extends Cache {
    filePath;
    data;

    /**
     *
     * @param {string} filePath - The filepath to store the cache data as JSONL
     */
    constructor(filePath) {
        super();
        this.filePath = path.resolve(__dirname, filePath);
        this.data = this.loadData();
    }

    // The key is not used in the traditional sense with JSONL it is inside the value
    /**
     * * Stores the completion object for the hash of a prompt
        * @param {string} hash  - the hash of the prompt
        * @param {promptCacheData} value - the value to store
    */    
    async add(hash, value) {
        if(!this.data) {
            throw new Error("No where to add data");
        }
        if(this.get(hash) !== null) {
            this.data.push(value);
            this.appendData(value);
        }
    }


    /**
     * Gets the completion object for the hash of a prompt
     * @param {string} hash - the hash of the prompt
     * @returns {Object} - the value stored
     */
    async get(hash) {
        if(!this.data) {
            throw new Error("No where to add data");
        }
        const out = this.data.find( item => {
            return item.hash === hash
        });
        if(!out || !out.result) {
            return null;
        }
        out.result.cached = true;
        return out;
    }


    /**
     * Loads the data from the file
     * @returns {Array} - the data
     * @private
     * @ignore
     */
    loadData() {
        if(!this.fileExists()) {
            this.saveData([]);
            return [];
        }
        let rawData = [];
        const liner = new lineByLine(this.filePath);
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

    /**
     * Appends a line to the file
     * @param {Object} dataLine - the data to append
     * @returns {void}
     * @private
     * @ignore
     */
    appendData(dataLine) {
        fs.appendFileSync(this.filePath, JSON.stringify(dataLine) + '\r\n');    
    }

    /**
     * Saves the data to the file
     * @param {Array} data - the data to save
     * @returns {void}
     * @private
     * @ignore
        */
    saveData(data) {
        let dataAllLines = data.map((line) => {
            return JSON.stringify(line);
        }).join('\r\n');
        fs.writeFileSync(this.filePath, dataAllLines);
    }

    /**
     * Checks if the file exists
     * @returns {boolean} - true if the file exists
     * @private
     * @ignore
     * */
    fileExists() {
        return fs.existsSync(this.filePath);
    }


}


module.exports = FileCache;