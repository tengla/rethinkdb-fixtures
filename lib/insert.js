'use strict';

Promise = require('bluebird');

const Base = require('./base');
const _ = require('lodash');

const clear = function (tables) {

    if (!this.options.clear) {
        return Promise.resolve(1);
    }

    return new Promise( (resolve,reject) => {

        this.connect()
        .then( (message) => {

            return this.tableList();
        })
        .then( (_tables) => {

            return _.intersection(_tables, tables);
        })
        .then((_tables) => {

            const promises = _tables.map( (table) => {

                return this.deleteTable(table);
            });
            return Promise.all(promises);
        }, reject)
        .then( (result) => {

            resolve(result);
        }, reject);
    });
};

const insert = function (fixture) {

    return new Promise( (resolve,reject) => {

        this.connect()
        .then(this.emptyCallback.bind(this), reject)
        .then(this.createTablesUnlessExist.bind(this,Object.keys(fixture)),reject)
        .then(this.fill.bind(this, fixture),reject)
        .then( (result) => {

            const pack = {};
            result.forEach( (object) => {

                const key = Object.keys(object)[0];
                pack[key] = object[key];
            });

            return this.close().then( () => {

                return resolve(pack);
            });
        },reject);
    });
};

module.exports = function (options,fixture) {

    const base = new Base(options);
    return clear.call(base, Object.keys(fixture)).then( () => {

        return insert.call(base,fixture);
    });
};
