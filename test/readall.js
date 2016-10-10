'use strict';

const Readall = require('../readall');
const Lab = require('lab');
const Code = require('code');
const expect = Code.expect;
const lab = exports.lab = Lab.script();

lab.experiment('Readall', () => {

    lab.test('it reads all fixtures', (done) => {

        Readall('./fixtures/*json')
        .then( (json) => {

            expect(json.bikes).to.be.array();
            done();
        })
        .catch( (err) => {

            done(err);
        });
    });

    lab.test('it fails to read', (done) => {

        Readall('./boguspath/*json')
        .then( () => {})
        .catch( (err) => {

            expect(err.message).to.be.equal('Cannot convert undefined or null to object');
            done();
        });
    });
});
