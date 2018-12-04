
const path = require('path');
const sprintf = require('sprintf-js').sprintf;
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));

var counter = 0;

// Private helper functions ////////////////////////////////////////////////////

// Zero padded numbers can only be represented as strings.
// If you don't know what a zero-padded number is, read the
// Wikipedia entry on Leading Zeros and check out some of code links:
// https://www.google.com/search?q=what+is+a+zero+padded+number%3F

const zeroPaddedNumber = (num) => {
  return sprintf('%05d', num);
};

// const readCounter = (callback) => {
//   Promise.promisify(fs.readFile)(exports.counterFile)
//     .then(fileData => callback(null, Number(fileData)))
//     .catch(err => callback(null, 0));
// };

const readCounter = (callback) => {
  fs.readFileAsync(exports.counterFile)
    .then(fileData => callback(null, Number(fileData)))
    .catch(err => callback(null, 0));
};

const writeCounter = (count, callback) => {
  var counterString = zeroPaddedNumber(count);
  fs.writeFileAsync(exports.counterFile, counterString)
    .then(() => callback(null, counterString))
    .catch(err => callback(err, 'GRAAAH'));
};

// Public API - Fix this function //////////////////////////////////////////////

exports.getNextUniqueId = (callback) => {
  readCounter((err, number) => {
    number = number + 1 || 1;
    writeCounter(number, (err, counterString) => {
      callback(null, counterString);
    });
  });
};



// Configuration -- DO NOT MODIFY //////////////////////////////////////////////

exports.counterFile = path.join(__dirname, 'counter.txt');
