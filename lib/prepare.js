'use strict';

const R = require('rethinkdb');
const _ = require('lodash');
const Promise = require('bluebird');

const Prepare = function (options) {

    this.options = options;
    this.connection = options.connection;
};

/**
 * @return {Promise}
 */
Prepare.prototype.close = function () {

    return this.connection.close();
};


/**
 * @return {Promise}
 */
Prepare.prototype.connect = function () {

    return new Promise( (resolve,reject) => {

        return R.connect(this.options).then( (conn) => {

            this.connection = conn;
            const message = ['Connected to ',conn.host,':',conn.port,'/',conn.db,'\n'].join('');
            resolve(message);
        },reject);
    });
};

/**
 * @param {String} name
 * @return {Promise}
 */
Prepare.prototype.createTableUnlessExist = function (name) {

    return new Promise( (resolve,reject) => {

        this.tableList().then( (list) => {

            if (_.includes(list,name)) {
                return resolve(name);
            }
            else {
                R.tableCreate(name).run(this.connection).then( (result) => {

                    resolve(name);
                },reject);
            }
        });
    });
};

/**
 * @param {Array} tables
 * @return {Array} [promise]
 */
Prepare.prototype.createTablesUnlessExist = function (tables) {

    return _.map(tables, (table) => {

        return this.createTableUnlessExist(table);
    });
};

Prepare.prototype.dropTables = function (tables) {

    return _.map(tables, (table) => {

        return R.tableDrop(table).run(this.connection);
    });
};

/**
 * @param  {Object}
 * @returns {Array}
 */
Prepare.prototype.fill = function (data) {

    const tables = Object.keys(data);

    // returns array of promises
    return _.map(tables, (table) => {

        return this.fillTable(table, data[table]);
    });
};

/**
 * @param {String} table
 * @param {Object} data
 * @return {Promise}
 */
Prepare.prototype.fillTable = function (table, data) {

    return new Promise( (resolve,reject) => {

        R.table(table)
        .insert(data, { returnChanges: true })
        .run(this.connection)
        .then( (result) => {

            const objects = result.changes.map( (obj) => {

                return obj.new_val;
            });

            const pack = {};
            pack[table] = objects;

            return resolve(pack);
        }, reject);
    });
};

/**
 * @return {Promise}
 */
Prepare.prototype.tableList = function () {

    return R.tableList().run(this.connection);
};

/**
 * @param {Object} options
 * @return {Prepare} prepare
 */
const factory = function (options) {

    const prepare = new Prepare(options);
    return prepare;
};

module.exports = factory;
