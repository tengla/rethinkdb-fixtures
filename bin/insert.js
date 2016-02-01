'use strict';

Promise = require('bluebird');

const DB = process.env.RETHINKDB;
const FIXTURE = process.env.FIXTURE;

if (!DB) {
    const message = 'environment variable $RETHINKDB must be set';
    console.error(message);
    process.exit(1);
}

if (!FIXTURE) {
    const message = 'environment variable $FIXTURE must be set. This must point to a json file.';
    console.error(message);
    process.exit(1);
}

const Readfixture = require('../index').Readfixture;
const Insert = require('../index').Insert;

const options = {
    db: DB
};

Readfixture(FIXTURE).then( (fixture) => {

    Insert(options,fixture).then( (createdObjects) => {

        console.log(createdObjects);
    });
});
