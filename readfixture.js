'use strict';

const Fs = require('fs');

module.exports = function (filename) {

    return new Promise( (resolve,reject) => {

        Fs.readFile(filename, 'utf8', (err,data) => {

            if (err) {
                return reject(err);
            }
            resolve(JSON.parse(data));
        });
    });
};
