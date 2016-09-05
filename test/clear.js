'use strict';

const R = require('rethinkdb');

const Delete = require('../index').Delete;
const Insert = require('../index').Insert;
const Lab = require('lab');
const Code = require('code');
const expect = Code.expect;
let conn;
const lab = exports.lab = Lab.script();

const options = {
    host: process.env.RETHINKDB_INSTANCE_PORT_8080_TCP_ADDR,
    db: process.env.RETHINKDB || 'test',
    verbose: 1,
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

    lab.before( (done) => {

        // We need to peek into db to make this test
        R.connect({ db: options.db, host: options.host }).then( (_conn) => {

            conn = _conn;
            done();
        }, done);
    });

    lab.before( (done) => {

        Insert(options,fixture).then( (result) => {

            done();
        }, done);
    });

    lab.after( (done) => {

        Delete(options, ['items', 'weirdos']).then( (result) => {

            done();
        }, done);
    });

    lab.after( (done) => {

        conn.close();
        done();
    });

    lab.test('it clears table before inserting', (done) => {

        fixture.items.push({
            name: 'Third item'
        });

        Insert(options, fixture)
        .then( (created) => {

            return R.table('items').count().run(conn);
        }).then( (count) => {

            // The two items from 'before' was called should have been deleted,
            // and three items from this run should have been inserted.
            expect(count).to.be.equal(3);
            done();
        })
        .catch( (err) => {

            done(err);
        });
    });
});
