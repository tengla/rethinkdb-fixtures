'use strict';

Promise = require('bluebird');

const DB = process.env.RETHINKDB;
const FIXTURE = process.env.FIXTURE;
const RDBUSER = process.env.RDBUSER;
const RDBPASSWORD = process.env.RDBPASSWORD;

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

const Readfixture = require('../readfixture');


const options = {
    db: DB,
    user: RDBUSER,
    password: RDBPASSWORD
};

const Insert = require('../index')(options).Insert;

Readfixture(FIXTURE).then( (fixture) => {

    Insert(fixture).then( (createdObjects) => {

        console.log(createdObjects);
    });
});
