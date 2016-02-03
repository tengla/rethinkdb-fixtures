'use strict';

const R = require('rethinkdb');
const Includes = require('lodash/includes');
const Promise = require('bluebird');

const Prepare = function (options) {

    this.options = options;
    this.connection = options.connection;
};

/**
 * @return {Promise}
 */
Prepare.prototype.close = function () {

    return new Promise( (resolve,reject) => {

        this.connection.close()
        .then( () => {

            resolve(true);
        }, reject);
    });
};

/**
 * @return {Promise}
 */
Prepare.prototype.connect = function () {

    if (this.connection && this.connection.open) {

        const message = [
            'Already connected to '
            ,this.connection.host
            ,':'
            ,this.connection.port
            ,'/'
            ,this.connection.db,'\n'
        ].join('');

        return Promise.resolve(message);
    }

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

            if (Includes(list,name)) {
                resolve(name);
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

    const promises = tables.map( (table) => {

        return this.createTableUnlessExist(table);
    });
    return Promise.all(promises);
};

Prepare.prototype.dropTables = function (tables) {

    const promises = tables.map( (table) => {

        return R.tableDrop(table).run(this.connection);
    });
    return Promise.all(promises);
};

Prepare.prototype.deleteTableWithFilter = function (table,filter) {

    return R.table(table)
        .filter(filter)
        .delete()
        .run(this.connection, {
            returnChanges: true
        });
};

Prepare.prototype.deleteTable = function (table) {

    return R.table(table).delete().run(this.connection, { returnChanges: true });
};

/**
 * @param  {Object}
 * @returns {Array}
 */
Prepare.prototype.fill = function (data) {

    const tables = Object.keys(data);

    // returns array of promises
    const promises = tables.map( (table) => {

        return this.fillTable(table, data[table]);
    });
    return Promise.all(promises);
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
