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

            //$lab:coverage:off$
            if (err) {
                return reject(err);
            }
            //$lab:coverage:on$
            resolve(files);
        });
    });
};

module.exports = function (pattern) {

    return glob(pattern).then( (files) => {

        return Promise.all(fileMap(files));
    }).then( (fixtures) => {

        return Promise.resolve(Object.assign.apply(undefined, fixtures));
    });
};
