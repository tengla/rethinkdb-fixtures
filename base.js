'use strict';

const R = require('rethinkdb');
const Includes = require('lodash/includes');
Promise = require('bluebird');

const Base = function (options) {

    this.options = options;
    this.connection = options.connection;
};

Base.prototype.emptyCallback = function () {

    if (this.options.verbose) {
        return console.log;
    }
    return function () {};
};

/**
 * @return {Promise}
 */
Base.prototype.close = function () {

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
Base.prototype.connect = function () {

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
Base.prototype.createTableUnlessExist = function (name) {

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
Base.prototype.createTablesUnlessExist = function (tables) {

    const promises = tables.map( (table) => {

        return this.createTableUnlessExist(table);
    });
    return Promise.all(promises);
};

Base.prototype.dropTables = function (tables) {

    const promises = tables.map( (table) => {

        return R.tableDrop(table).run(this.connection);
    });
    return Promise.all(promises);
};

Base.prototype.deleteTableWithFilter = function (table,filter) {

    return R.table(table)
        .filter(filter)
        .delete()
        .run(this.connection, {
            returnChanges: true
        });
};

Base.prototype.deleteTable = function (table) {

    return R.table(table).delete().run(this.connection, { returnChanges: true });
};

/**
 * @param  {Object}
 * @returns {Array}
 */
Base.prototype.fill = function (data) {

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
Base.prototype.fillTable = function (table, data) {

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
Base.prototype.tableList = function () {

    return R.tableList().run(this.connection);
};

module.exports = Base;
