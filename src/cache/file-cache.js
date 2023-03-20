const lineByLine = require('n-readlines');
const fs = require('fs');
const path = require('path');
const Cache = require('./cache');

// Description: stores cache data in a JSONl file
class FileCache extends Cache {
    filePath;
    data;

    constructor(filePath) {
        super();
        this.filePath = path.resolve(__dirname, filePath);
        this.data = this.loadData();
    }

    // the key is not used in the traditional sense with JSONL it is inside the value
    async add(hash, value) {
        if(!this.data) {
            throw new Error("No where to add data");
        }
        if(this.get(hash) !== null) {
            this.data.push(value);
            this.appendData(value);
        }
    }

    // the key is not used in the traditional sense with JSONL it is inside the value
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

    appendData(dataLine) {
        fs.appendFileSync(this.filePath, JSON.stringify(dataLine) + '\r\n');    
    }

    saveData(data) {
        let dataAllLines = data.map((line) => {
            return JSON.stringify(line);
        }).join('\r\n');
        fs.writeFileSync(this.filePath, dataAllLines);
    }

    fileExists() {
        return fs.existsSync(this.filePath);
    }


}


module.exports = FileCache;