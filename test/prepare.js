'use strict';

const Promise = require('bluebird');
const Prepare = require('../index').Prepare;
const Lab = require('lab');
const Code = require('code');
const expect = Code.expect;
const lab = exports.lab = Lab.script();
const dbOptions = {
    db: process.env.RETHINKDB || 'test'
};
let prep;

lab.experiment('Prepare', () => {

    lab.before( (done) => {

        prep = Prepare(dbOptions);
        prep.connect()
        .then( () => {

            done();
        });
    });

    lab.after( (done) => {

        prep.connect()
        .then(prep.deleteTable.bind(prep, 'people'))
        .then( () => {

            prep.close();
            done();
        });
    });

    lab.test('it connects', (done) => {

        prep.connect()
        .then( (message) => {

            expect(message).to.be.string();
            expect(message).to.match(/^Already connected to localhost:28015\//);
        })
        .then(done);
    });

    lab.test('it creates table \'people\'', (done) => {

        prep.connect()
        .then( () => {/*shut up*/},console.error)
        .then(Promise.resolve.bind(null, ['people']))
        .then( (tables) => {

            return prep.createTablesUnlessExist(tables);
        })
        .then(prep.tableList.bind(prep))
        .then( (list) => {

            expect(list).to.be.array();
            expect(list.length).to.be.equal(1);
            expect(list[0]).to.be.equal('people');
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

        prep.connect()
        .then(() => {}, console.error)
        .then(prep.fill.bind(prep, fixture))
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

        prep.connect()
        .then(() => {},console.error)
        .then(prep.fill.bind(prep,fixture))
        .then( () => {})
        .then( () => {

            prep.deleteTableWithFilter('people', { name: 'Bill Delete' }).then( (result) => {

                expect(result.changes[0].old_val.name).to.be.equal('Bill Delete');
                done();
            });
        });
    });

    lab.test('it drops table \'temptable\'', (done) => {

        prep.connect()
        .then( () => {}, console.error)
        .then(prep.createTableUnlessExist.bind(prep, 'temptable'))
        .then(prep.dropTables.bind(prep,['temptable']))
        .then( (result) => {

            expect(result[0].config_changes[0].old_val.name).to.be.equal('temptable');
            done();
        });
    });

    lab.test('it closes connection', (done) => {

        prep.close()
        .then( (a) => {

            expect(a).to.be.equal(true);
            done();
        });
    });
});
