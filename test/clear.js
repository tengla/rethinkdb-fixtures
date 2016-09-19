'use strict';

const R = require('rethinkdb');
const Insert = require('../index').Insert;
const Lab = require('lab');
const Code = require('code');
const expect = Code.expect;
const lab = exports.lab = Lab.script();

const options = {
    host: process.env.RETHINKDB_INSTANCE_PORT_8080_TCP_ADDR,
    db: process.env.RETHINKDB || 'test',
    user: 'test',
    verbose: true,
    clear: true
};

const fixture = {
    items: [
        {
            name: 'Item 1'
        },
        {
            name: 'Item 2'
        }
    ],
    weirdos: [
        {
            name: 'Weirdo 1'
        },
        {
            name: 'Weirdo 2'
        }
    ]
};

lab.experiment('Clear', () => {

    lab.test('it clears table before inserting', (done) => {

        Insert(options, fixture)
        .then( (created) => {

            return created;
        })
        .then( () => {

            return Insert(options, fixture);
        })
        .then( () => {

            return R.connect(options);
        })
        .then( (conn) => {

            return Promise.all([R.table('items').run(conn), conn]);
        })
        .then( (promises) => {

            const [cursor, conn] = promises;
            return Promise.all([cursor.toArray(), conn]);
        })
        .then( (promises) => {

            const [items,conn] = promises;
            expect(items.length).to.equal(2);
            conn.close();
            done();
        })
        .catch(done);
    });
});
