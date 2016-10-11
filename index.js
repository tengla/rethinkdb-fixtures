'use strict';

const Insert = require('./insert');
const Delete = require('./delete');
const Base = require('./base');

module.exports = function (config) {

    const base = new Base(config);
    return {
        Insert: Insert(undefined,base),
        Delete: Delete(undefined,base),
        base: base
    }
};
