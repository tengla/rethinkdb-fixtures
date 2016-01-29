'use strict';

const Delete = require('../index').Delete;
const Insert = require('../index').Insert;
const Lab = require('lab');
const Code = require('code');
const expect = Code.expect;

const lab = exports.lab = Lab.script();

const options = {
    db: {
        db: 'test'
    },
    fixture: {
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
    },
    verbose: 1
};

lab.experiment('Delete', () => {

    lab.before( (done) => {

        Insert(options).then( (result) => {

            done();
        }, done);
    });

    lab.test('it deletes', (done) => {

        Delete(options.db, ['items', 'weirdos'])
        .then( (result) => {

            expect(result.length).to.be.equal(2);
            done();
        },done);
    });
});
