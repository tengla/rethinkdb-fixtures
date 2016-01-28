'use strict';

const _ = require('lodash');
Promise = require('bluebird');
const DB = process.env.RETHINKDB;

if (!process.env.TABLES) {

    const message = 'environment variable $TABLES must be set.\n'
        + 'export TABLES=\'table1,table2,table3\'\n';

    throw new Error(message);
}

const tables = process.env.TABLES.split(',');

const prep = require('../index')
    .Prepare({ db: DB });

prep.connect()
    .then(console.log,console.error)
    .then(prep.tableList.bind(prep))
    .then( (list) => {

        const diff = _.filter(tables, (table) => {

            return _.includes(list,table);
        });
        return prep.dropTables(diff);
    })
    .then( (promises) => {

        return Promise.all(promises);
    }, console.error)
    .then( (result) => {

        const rows = result.map( (row) => {

            return row.config_changes.map( (changes) => {

                return changes.old_val.name;
            });
        });
        const deleted = _.flatten(rows);
        if (deleted.length > 0) {
            console.log('deleted', deleted.join(', '));
        }
        else {
            console.log('no such tables in db');
        }
        prep.close();
    })
    .catch( (err) => {

        console.error(err.msg);
    });
