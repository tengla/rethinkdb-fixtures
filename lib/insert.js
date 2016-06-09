'use strict';

Promise = require('bluebird');

const Base = require('./base');

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

            this.close();
            resolve(pack);
        },reject);
    });
};

module.exports = function(options,fixture) {
    
    return insert.call(new Base(options),fixture);
};
