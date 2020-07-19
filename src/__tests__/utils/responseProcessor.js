"use strict";
const responseProcessor = require('../../server/utils/responseProcessor');

describe('url Matcher', () => {
    describe('Match Anything', () => {
        it("should return true when anything is trial with anything", () => {
            expect(responseProcessor.urlMatcher("anything/*", "anything/1234")).toBe(true);
        });
    });
})