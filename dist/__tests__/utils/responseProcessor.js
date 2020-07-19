"use strict";

var responseProcessor = require('../../server/utils/responseProcessor');

describe('url Matcher', function () {
  describe('Match Anything', function () {
    it("should return true when anything is trial with anything", function () {
      expect(responseProcessor.urlMatcher("anything/*", "anything/1234")).toBe(true);
    });
  });
});