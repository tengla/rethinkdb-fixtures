'use strict';

const Fs = require('fs');
const Readfixture = require('../readfixture');
const Lab = require('lab');
const Code = require('code');
const expect = Code.expect;
const lab = exports.lab = Lab.script();
const filename = '/tmp/readfixturemock.json';

lab.experiment('Readfixture', () => {

    lab.before( (done) => {

        const json = JSON.stringify({ name: 'fake' });
        Fs.writeFile(filename, json, 'utf8', (err) => done(err));
    });

    lab.test('it reads', (done) => {

        Readfixture(filename)
        .then( (json) => {

            expect(json.name).to.be.equal('fake');
            done();
        });
    });

    lab.test('it fails', (done) => {

        Readfixture('/tmp/totallybogus.json')
        .then( () => {}, (err) => {

            expect(err.code).to.be.equal('ENOENT');
            done();
        });
    });
});
