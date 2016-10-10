'use strict';


const Lab = require('lab');
const Code = require('code');
const expect = Code.expect;

const lab = exports.lab = Lab.script();

const options = {
    host: process.env.RETHINKDB_INSTANCE_PORT_8080_TCP_ADDR,
    db: process.env.RETHINKDB || 'test',
    user: 'test'
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
    artists: [
        {
            name: 'Crazy Ass Wicked Wild'
        }
    ]
};

lab.experiment('Insert', () => {

    lab.after( (done) => {

        Delete(['items','artists']);
        done();
    });

    lab.test('it inserts', (done) => {

        Insert(fixture).then( (objects) => {

            const idx = objects.items.findIndex( (item) => {

                return item.name === 'Item 1';
            });
            expect(objects.items[idx].name).to.be.equal(fixture.items[0].name);
            expect(objects.artists[0].name).to.be.equal(fixture.artists[0].name);
            done();
        }).catch(done);
    });
});
