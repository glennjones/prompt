const { MongoClient, Db } = require('mongodb');
const Cache = require('./cache');

// Description: stores cache data in a JSONl file
/**
 * Stores completion objects from prompts into JSONL file
 * @extends Cache - The base cache class
 */
class MongodbCache extends Cache {
  /**
   * Creates an instance of Cache.
   * @param {string} uri - The URI to connect to the database
   * @param {string} dbName - The name of the database to store the cache in
   * @param {string} collectionName - The name of the collection to store the cache in
   * @param {Db=} db - The database object to use, instead of creating a new one with the uri and dbName
   * @constructor
   * */
  constructor(uri, dbName, collectionName = 'cache', db) {
    super();
    this.uri = uri;
    this.dbName = dbName;
    this.collectionName = collectionName;
    this.db = db;

    // Connect to the database
    this.createConnection();
  }

  async createConnection() {
    // Connect to the database
    if(this.db === undefined) {
      await MongoClient.connect(this.uri)
        .then((client) => {
          this.db = client.db(this.dbName);
          return;
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }

  /**
   * Adds a key value pair to the cache
   * @param {string} key - The key to store the value under
   * @param {promptCacheData} value - The value to store
   * @returns {Promise} - A promise that resolves when the object is stored
   * */
  async add(key, value) {
    if (!this.db) {
      await this.createConnection();
    }
    try {
      const result = await this.db
        .collection(this.collectionName)
        .insertOne(value);
      if (result.acknowledged == true) {
        return value;
      }
      return null;
    } catch (err) {
      console.log('error adding item: ', this.collectionName);
      return null;
    }
  }

  /**
   * Gets the value stored under the key
   * @param {string} key - The key to get the value for
   * @returns {Promise} - A promise that resolves to the object stored under the key
   * */
  async get(key) {
    // find the document with the key
    if (!this.db) {
      await this.createConnection();
    }
    try {
      const doc = await this.db
        .collection(this.collectionName)
        .findOne({ hash: key });
      if (!doc) {
        return null;
      }
      return doc;
    } catch (err) {
      console.log('error getting item: ', this.collectionName);
      return null;
    }
  }
}

module.exports = MongodbCache;
