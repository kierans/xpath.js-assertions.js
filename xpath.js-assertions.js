"use strict";

var chai = require("chai"),
    expect = chai.expect;

/**
 * @param {Function} select Function that matches signature for xpath.js
 * @return {{has: Function, get: Function}}
 */
module.exports = function(select) {
  /**
   * @param doc
   * @param {string} path
   * @param {number} [numberNodes]
   * @return {Array}
   */
  function selectCheckingCount(doc, path, numberNodes) {
    var results = select(doc, path);

    expect(results.length).to.equal(numberNodes);

    return results;
  }

  function checkResult(expected, actual) {
    if (expected instanceof RegExp) {
      expect(actual).to.match(expected);
    }
    else {
      expect(actual).to.equal(expected);
    }
  }

  return {
    has: function(doc, path, value) {
      var results = selectCheckingCount(doc, path, (typeof value === "number" ? value : 1));

      return {
        withAttValue: function(expected) {
          checkResult(expected, results[0].value);
        },

        withTextValue: function(expected) {
          checkResult(expected, results[0].data);
        },

        results: results
      };
    },
    get: function(doc, path) {
      var results = selectCheckingCount(doc, path);

      if (results) {
        return results[0].value || results[0].data || results;
      }

      return results;
    },
    init: function(doc) {
      var self = this;

      doc.has = function(path, value) {
        return self.has(this, path, value);
      };

      doc.get = function(path) {
        return self.get(this, path);
      };
    }
  };
};
