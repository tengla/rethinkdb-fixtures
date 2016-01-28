'use strict';

const _ = require('lodash');
Promise = require('bluebird');

const DB = process.env.RETHINKDB;
const FIXTURE = process.env.FIXTURE;

if (!DB) {
    throw new Error('environment variable $RETHINKDB must be set');
}

if (!FIXTURE) {
    throw new Error('environment variable $FIXTURE must be set. This must point to a json file.');
}

const Readfixture = require('../index').Readfixture;
const prep = require('../index')
    .Prepare({ db: DB });

prep.connect()
    .then( console.log, console.error)
    .then(Readfixture.bind(null, FIXTURE))
    .then( (fixtures) => {

        return prep.createTablesUnlessExist(Object.keys(fixtures));
    })
    .then( (promises) => {

        return Promise.all(promises);
    })
    .then(Readfixture.bind(null, FIXTURE))
    .then( (fixtures) => {

        return prep.fill(fixtures);
    })
    .then( (promises) => {

        return Promise.all(promises);
    })
    .then( (results) => {

        const unpack = {};
        _.each(results, (result) => {

            const key = Object.keys(result)[0];
            unpack[key] = result[key];
        });
        return Promise.resolve(unpack);
    }).then( (res) => {

        console.log(JSON.stringify(res,null,4));
        return prep.close();
    });
