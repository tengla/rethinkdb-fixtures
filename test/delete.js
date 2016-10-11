'use strict';


const Lab = require('lab');
const Code = require('code');
const expect = Code.expect;

const lab = exports.lab = Lab.script();

const options = {
    host: process.env.RETHINKDB_INSTANCE_PORT_8080_TCP_ADDR,
    db: process.env.RETHINKDB || 'test',
    verbose: 1
};

const lib = require('../index')(options);
const Insert = lib.Insert;
const Delete = lib.Delete;

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

        Insert(fixture).then( (result) => {

            done();
        }, done);
    });

    lab.test('it deletes', (done) => {

        Delete(['items', 'weirdos'])
        .then( (result) => {

            expect(result.length).to.be.equal(2);
            done();
        },done);
    });
});
