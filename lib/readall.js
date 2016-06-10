'use strict';

const Readfixture = require('./readfixture');
const Glob = require('glob');
Promise = require('bluebird');

const fileMap = function (filenames) {

    return filenames.map((filename) => {

        return Readfixture(filename);
    });
};

const glob = function (pattern) {

    return new Promise( (resolve,reject) => {

        Glob(pattern, {}, (err,files) => {

            if (err) {
                return reject(err);
            }
            resolve(files);
        });
    });
};

module.exports = function (pattern) {

    return glob(pattern).then( (files) => {

        return Promise.all(fileMap(files));
    }).then( (fixtures) => {

        //  .apply() is a node 4 alternative to .assign(...fixtures)
        return Promise.resolve(Object.assign.apply(undefined, fixtures));
    });
};
