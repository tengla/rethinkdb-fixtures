'use strict';

Promise = require('bluebird');
const Base = require('../index').Base;
const Includes = require('lodash/includes');
const Lab = require('lab');
const Code = require('code');
const expect = Code.expect;
const lab = exports.lab = Lab.script();

const dbOptions = {
    host: process.env.RETHINKDB_INSTANCE_PORT_8080_TCP_ADDR,
    db: process.env.RETHINKDB || 'test',
    user: 'test'
};

let base;

lab.experiment('Base', () => {

    lab.before( (done) => {

        base = new Base(dbOptions);
        base.connect()
        .then( () => {

            done();
        });
    });

    lab.after( (done) => {

        base.connect()
        .then(base.deleteTable.bind(base, 'people'))
        .then( () => {

            base.close();
            done();
        });
    });

    lab.test('it connects', (done) => {

        base.connect()
        .then( (message) => {

            expect(message).to.be.string();
            expect(message).to.match(/^Already connected to .*:28015\//);
        })
        .then(done);
    });

    lab.test('it creates table \'people\'', (done) => {

        base.connect()
        .then( () => {/*shut up*/},console.error)
        .then(Promise.resolve.bind(null, ['people']))
        .then( (tables) => {

            return base.createTablesUnlessExist(tables);
        })
        .then(base.tableList.bind(base))
        .then( (list) => {

            expect(Includes(list,'people')).to.be.equal(true);
            expect(list).to.be.array();
            done();
        });
    });

    lab.test('it fills table \'people\'', (done) => {

        const fixture = {
            people: {
                name: 'John Doe',
                age: 23
            }
        };

        base.connect()
        .then(() => {}, console.error)
        .then(base.fill.bind(base, fixture))
        .then( (result) => {

            expect(result[0].people[0].name).to.be.equal('John Doe');
            done();
        });
    });

    lab.test('it deletes table \'people\'', (done) => {

        const fixture = {
            people: {
                name: 'Bill Delete',
                age: 201
            }
        };

        base.connect()
        .then(() => {},console.error)
        .then(base.fill.bind(base,fixture))
        .then( () => {})
        .then( () => {

            base.deleteTableWithFilter('people', { name: 'Bill Delete' }).then( (result) => {

                expect(result.changes[0].old_val.name).to.be.equal('Bill Delete');
                done();
            });
        });
    });

    lab.test('it drops table \'temptable\'', (done) => {

        base.connect()
        .then( () => {}, console.error)
        .then(base.createTableUnlessExist.bind(base, 'temptable'))
        .then(base.dropTables.bind(base,['temptable']))
        .then( (result) => {

            expect(result[0].config_changes[0].old_val.name).to.be.equal('temptable');
            done();
        });
    });

    lab.test('it closes connection', (done) => {

        base.close()
        .then( (a) => {

            expect(a).to.be.equal(true);
            done();
        });
    });
});
