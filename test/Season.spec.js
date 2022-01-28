const { expect } = require('chai');
const MockDate = require('mockdate');
const { isDate } = require('../util');
const Season = require('../classes/Season');

const season11Data = require('../data/seasons.json').seasons[0];
const season11 = new Season(season11Data);

describe('@Season', function() {

    describe('.id property', function() {
        it('returns the season id as a Number', function() {
            expect(season11.id).to.eql(11);
        });
    });

    describe('.name property', function() {
        it('returns the name of the season', function() {
            expect(season11.name).to.equal('Escape');
        })
    });

    describe('.startTime', function() {
        it('returns a Date', function() {
            expect(isDate(season11.startTime)).to.be.true;
        });
    });

    describe('.endTime', function() {
        it('returns a Date', function() {
            expect(isDate(season11.endTime)).to.be.true;
        });
    });

    describe('.playlists', function() {
        it('returns an Array', function() {
            expect(season11.playlists).to.be.an('array');
        });
    });

    describe('.playlists.rotations', function() {
        it('returns an array', function() {
            expect(season11.playlists[0].rotations)
                .to.be.an('array');
        });
    });

    describe('.unranked.battleRoyale', function() {
        it('is an alias for unranked Battle Royale mode', function() {
            expect(season11.unranked.battleRoyale).to.eql(season11.playlists[0]);
        });
    });

});
