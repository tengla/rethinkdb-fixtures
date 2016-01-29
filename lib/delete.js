'use strict';

const Promise = require('bluebird');
const Prepare = require('./prepare');

const _delete = function (dbOptions,tables) {

    const prep = Prepare(dbOptions);

    return new Promise( (resolve,reject) => {

        prep.connect()
        .then((message) => {

            const promises = tables.map( (table) => {

                return prep.deleteTable(table);
            });
            return Promise.all(promises);
        }, reject)
        .then( (result) => {

            resolve(result);
        }, reject);
    });
};

module.exports = _delete;
