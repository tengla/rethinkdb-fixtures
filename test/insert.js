'use strict';

const Insert = require('../index').Insert;
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
    ],
    artists: [
        {
            name: 'Crazy Ass Wicked Wild'
        }
    ]
};

lab.experiment('Insert', () => {

    lab.test('it inserts', (done) => {

        Insert(options, fixture).then( (objects) => {

            const idx = objects.items.findIndex( (item) => {

                return item.name === 'Item 1';
            });
            expect(objects.items[idx].name).to.be.equal(fixture.items[0].name);
            expect(objects.artists[0].name).to.be.equal(fixture.artists[0].name);
            done();
        }, console.error);
    });
});
