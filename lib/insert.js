'use strict';

const Promise = require('bluebird');
const Prepare = require('./prepare');

const insert = function (options) {

    const fixture = options.fixture;
    const prep = Prepare(options.db);
    let messageCallback = function () {};

    if (options.verbose === 1) {
        messageCallback = console.log;
    }

    return new Promise( (resolve,reject) => {

        prep.connect()
        .then(messageCallback, reject)
        .then(prep.createTablesUnlessExist.bind(prep,Object.keys(fixture)),reject)
        .then(prep.fill.bind(prep, fixture),reject)
        .then( (result) => {

            resolve(result[0]);
            prep.close();
        },reject);
    });
};

module.exports = insert;
