'use strict';

Promise = require('bluebird');
const Base = require('./base');

const _delete = function (tables) {

    return new Promise( (resolve,reject) => {

        this.connect()
        .then((message) => {

            const promises = tables.map( (table) => {

                return this.deleteTable(table);
            });
            return Promise.all(promises);
        }, reject)
        .then( (result) => {

            resolve(result);
            this.close();
        }, reject);
    });
};

module.exports = function (options,base) {

    base = base || new Base(options);

    return function (tables) {

        return _delete.call(base,tables);
    };
};
