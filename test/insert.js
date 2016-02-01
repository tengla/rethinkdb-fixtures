'use strict';

const Insert = require('../index').Insert;
const _ = require('lodash');
const Lab = require('lab');
const Code = require('code');
const expect = Code.expect;

const lab = exports.lab = Lab.script();

const options = {
    db: 'test'
};

const fixture = {
    items: [
        {
            name: 'Item 1'
        },
        {
            name: 'Item 2'
        }
    ]
};

lab.experiment('Insert', () => {

    lab.test('it inserts', (done) => {

        Insert(options, fixture).then( (result) => {

            const names = result.items.map( (item) => {

                return item.name;
            });
            expect(_.includes(names, 'Item 1')).to.be.equal(true);
            done();
        }, console.error);
    });
});
