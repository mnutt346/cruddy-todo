const path = require('path');
const _ = require('underscore');
const counter = require('./counter');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id) => {
    let fileName = __dirname + '/data/' + id + '.txt';
    fs.writeFileAsync(fileName, text)
      .then(() => callback(null, { id, text }))
      .catch(err => callback(err, 'THIS ERROR MAKES YOU SAD'));
  });
};

exports.readAll = (callback) => {
  fs.readdirAsync(__dirname + '/data')
    .then(files => (Promise.all(files.map((file, index) => {
      return fs.readFileAsync(__dirname + '/data/' + file)
        .then(fileData => ({ id: file.slice(0, -4), text: fileData.toString() }))
        .catch(err => callback(err));
    }))
      .then((data) => callback(null, data))))
    .catch(err => callback(err));
};

exports.readOne = (id, callback) => {
  fs.readdirAsync(__dirname + '/data')
    .then(files => {
      if (files.includes(id + '.txt')) {
        fs.readFileAsync(__dirname + '/data/' + id + '.txt')
          .then(fileData => callback(null, { id, text: fileData.toString() }))
          .catch(err => callback(err));
      } else {
        callback(new Error(`No item with id: ${id}`));
      }
    }
    )
    .catch(err => callback(err));
};

exports.update = (id, text, callback) => {
  fs.readdirAsync(__dirname + '/data')
    .then(files => {
      if (files.includes(id + '.txt')) {
        fs.writeFileAsync(__dirname + '/data/' + id + '.txt', text)
          .then(() => callback(null, { id, text }))
          .catch(err => callback(err));
      } else {
        callback(new Error(`No item with id: ${id}`));
      }
    })
    .catch(err => callback(err));
};

exports.delete = (id, callback) => {
  fs.readdirAsync(__dirname + '/data')
    .then(files => {
      if (files.includes(id + '.txt')) {
        fs.unlinkAsync(__dirname + '/data/' + id + '.txt')
          .then(() => callback())
          .catch(err => callback(err));
      } else {
        callback(new Error(`No item with id: ${id}`));
      }
    })
    .catch(err => callback(err));
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
