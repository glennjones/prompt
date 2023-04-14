const FileCache = require('../src/cache/file-cache.js');


/*

jest.mock('fs', () => ({
    appendFileSync: jest.fn(),
    existsSync: jest.fn(),
    readFileSync: jest.fn(),
    writeFileSync: jest.fn(),
    openSync: jest.fn(),
}));




jest.mock('n-readlines', () => {

  const mockData01 = {
    hash: "hash1",
    prompt: "prompt 1",
    result: {"data": "data1"},
    created: new Date()
  };
  
  const mockData02 = {
    hash: "hash2",
    prompt: "prompt 2",
    result: {"data": "data2"},
    created: new Date()
  };
  


  const lines = [JSON.stringify(mockData01), JSON.stringify(mockData02)];
  return jest.fn().mockImplementation(() => ({
      next: () => lines.shift() || null
  }));
});


jest.mock('fs', () => ({

  existsSync: jest.fn(() => true),
    readFileSync: jest.fn(() => {
        return Buffer.from([JSON.stringify(mockData01), JSON.stringify(mockData02)]);
    }),
  }));
  
  describe('FileCache', () => {
  describe('loadData()', () => {
      it('should load data from file', () => {
      const filePath = 'test-cache.jsonl';
      const fileCache = new FileCache(filePath);
  
      const data = fileCache.loadData();
  
      expect(fs.existsSync).toHaveBeenCalledWith(filePath);
      expect(fs.readFileSync).toHaveBeenCalledWith(filePath);
        expect(data).toEqual([
            { hash: 'test-hash-1', result: { cached: true } },
            { hash: 'test-hash-2', result: { cached: true } },
        ]);
      });
  });
});




jest.mock('n-readlines', () => {
    const lines = ['{"hash": "hash1", "result": {"data": "data1"}}', '{"hash": "hash2", "result": {"data": "data2"}}'];
    return jest.fn().mockImplementation(() => ({
        next: () => lines.shift() || null
    }));
});

jest.mock('fs', () => ({

    existsSync: jest.fn(() => true),
    readFileSync: jest.fn(() => {
        return Buffer.from('{"hash": "test-hash-1", "result": {"cached": true}}\n{"hash": "test-hash-2", "result": {"cached": true}}');
    }),
    }));
    
    describe('FileCache', () => {
    describe('loadData()', () => {
        it('should load data from file', () => {
        const filePath = 'test-cache.jsonl';
        const fileCache = new FileCache(filePath);
    
        const data = fileCache.loadData();
    
        expect(fs.existsSync).toHaveBeenCalledWith(filePath);
        expect(fs.readFileSync).toHaveBeenCalledWith(filePath);
        expect(data).toEqual([
            { hash: 'test-hash-1', result: { cached: true } },
            { hash: 'test-hash-2', result: { cached: true } },
        ]);
        });
    });
});
*/



/*
describe('FileCache', () => {
  const filePath = './test-cache.jsonl';
  const data = [
    { hash: 'prompt1', result: { answer: 'answer1' } },
    { hash: 'prompt2', result: { answer: 'answer2' } },
    { hash: 'prompt3', result: { answer: 'answer3' } },  
  ];
  let fileCache;

  beforeEach(() => {
    fileCache = new FileCache(filePath);
    fileCache.saveData(data);
  });

  afterEach(() => {
    if (fileCache.fileExists()) {
      fs.unlinkSync(filePath);
    }
  });

  describe('add', () => {
    it('should throw an error if there is no data', async () => {
      fileCache.data = null;
      await expect(fileCache.add('prompt4', { answer: 'answer4' })).rejects.toThrow('No where to add data');
    });

    it('should add the value to the data array if the hash is not already in the cache', async () => {
      const hash = 'prompt4';
      const value = { answer: 'answer4' };
      await fileCache.add(hash, value);
      const result = fileCache.data.find(item => item.hash === hash);
      expect(result.result).toEqual(value);
    });

    it('should append the value to the file if the hash is not already in the cache', async () => {
      const hash = 'prompt4';
      const value = { answer: 'answer4' };
      await fileCache.add(hash, value);
      const result = fs.readFileSync(filePath, 'utf-8').trim().split('\r\n').map(JSON.parse);
      expect(result[result.length - 1].result).toEqual(value);
    });

    it('should not add the value to the data array if the hash is already in the cache', async () => {
      const hash = 'prompt1';
      const value = { answer: 'answer4' };
      await fileCache.add(hash, value);
      const result = fileCache.data.filter(item => item.hash === hash);
      expect(result.length).toBe(1);
      expect(result[0].result).toEqual({ answer: 'answer1' });
    });
  });

  describe('get', () => {
    it('should throw an error if there is no data', async () => {
      fileCache.data = null;
      await expect(fileCache.get('prompt1')).rejects.toThrow('No where to add data');
    });

    it('should return null if the hash is not in the cache', async () => {
      const result = await fileCache.get('prompt4');
      expect(result).toBeNull();
    });

    it('should return the value if the hash is in the cache', async () => {
      const hash = 'prompt1';
      const result = await fileCache.get(hash);
      expect(result.hash).toBe(hash);
      expect(result.result).toEqual({ answer: 'answer1', cached: true });
    });

    it('should set cached to true on the result object', async () => {
      const hash = 'prompt1';
      const result = await fileCache.get(hash);
      expect(result.result.cached).toBe(true);
    });
  });
 });
    */

  /*
  describe('loadData', () => {
    it('should return an empty array if the file does not exist', () => {
      fs.unlinkSync(filePath);
      const result = fileCache.loadData();
      expect(result).toEqual([]);
    });

    it('should return the data from the file', () => {
      const
      */
   
