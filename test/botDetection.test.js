/* eslint-disable no-undef */
const expect = require('chai').expect;
const isValidApiSecret = require('../lib/botDetection').isValidApiSecret;
const env = Object.assign({}, process.env);

after(() => {
    process.env = env;
});

describe('#isValidApiSecret()', function() {
    context('with undefined environment variable', function() {
        it('should return false', function() {
            delete process.env.RA_API_SECRETS;
            expect(isValidApiSecret('Testing1')).be.false;
        })
    })
    
    context('with valid environment variable', function() {

        it('should return false with invalid token', () => {
            process.env.RA_API_SECRETS = 'Testing1:Testing2';
            expect(isValidApiSecret('abcdef')).be.false;
        })

        it('should return true with valid token', function() {
            process.env.RA_API_SECRETS = 'Testing1:Testing2';
            expect(isValidApiSecret('Testing1')).be.true;
        })

        it('should be case sensitive', function() {
            process.env.RA_API_SECRETS = 'Testing1:Testing2';
            expect(isValidApiSecret('testing1')).be.false;
        })

        delete process.env.RA_API_SECRETS;
    })    
})
