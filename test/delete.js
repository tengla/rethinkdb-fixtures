'use strict';

const Delete = require('../index').Delete;
const Insert = require('../index').Insert;
const Lab = require('lab');
const Code = require('code');
const expect = Code.expect;

const lab = exports.lab = Lab.script();

const options = {
    host: process.env.RETHINKDB_INSTANCE_PORT_8080_TCP_ADDR,
    db: process.env.RETHINKDB || 'test',
    verbose: 1
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

lab.experiment('Delete', () => {

    lab.before( (done) => {

        Insert(options,fixture).then( (result) => {

            done();
        }, done);
    });

    lab.test('it deletes', (done) => {

        Delete(options, ['items', 'weirdos'])
        .then( (result) => {

            expect(result.length).to.be.equal(2);
            done();
        },done);
    });
});
