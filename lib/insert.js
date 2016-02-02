'use strict';

const Promise = require('bluebird');
const Prepare = require('./prepare');

const insert = function (options, fixture) {

    const prep = Prepare(options);
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

            const pack = {};
            result.forEach( (object) => {

                const key = Object.keys(object)[0];
                pack[key] = object[key];
            });

            resolve(pack);
            prep.close();
        },reject);
    });
};

module.exports = insert;
