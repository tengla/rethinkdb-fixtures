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

lab.experiment('Prepare', () => {

    lab.test('should connect', (done) => {

        const prep = Prepare(dbOptions);

        prep.connect()
        .then( (message) => {

            expect(message).to.be.string();
            expect(message).to.match(/^Connected to localhost:28015\//);
        })
        .then(prep.close.bind(prep))
        .then(done);
    });

    lab.test('should create table \'people\'', (done) => {

        const prep = Prepare(dbOptions);

        prep.connect()
        .then( () => {/*shut up*/},console.error)
        .then(Promise.resolve.bind(null, ['people']))
        .then( (tables) => {

            return prep.createTablesUnlessExist(tables);
        })
        .then( (promises) => {

            return Promise.all(promises);
        })
        .then(prep.tableList.bind(prep))
        .then( (list) => {

            expect(list).to.be.array();
            expect(list.length).to.be.equal(1);
            expect(list[0]).to.be.equal('people');
            done();
        });
    });

    lab.test('fillTable', (done) => {

        const prep = Prepare(dbOptions);
        prep.fillTable = function () {

            return 0;
        };
        expect(prep.fillTable()).to.be.equal(0);
        done();
    });
});
