const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');
const Promise = require('bluebird');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id) => {
    let fileName = __dirname + '/data/' + id + '.txt';

    Promise.promisify(fs.writeFile)(fileName, text)
      .then(() => callback(null, { id, text }))
      .catch(err => callback(err, 'THIS ERROR MAKES YOU SAD'));

  });
};

exports.readAll = (callback) => {


  fs.readdir(__dirname + '/data', (err, files) => {
    // var data = Array(files.length);
    Promise.all(files.map((file, index) => {
      Promise.promisify(fs.readFile)(__dirname + '/data/' + file)
        .then(fileData => {
          console.log('FILE DATA: ', fileData.toString());
          console.log('FILE: ', file);
          return ({ id: file.slice(0, -4), text: fileData.toString() });
        })
        .catch(err => callback(err));
      //  (err, fileData) => {
      //   data.push({ id: file.slice(0, -4), text: fileData.toString() });

      //   if (index === files.length - 1) {
      //     callback(null, data);
      //   }
      // });
    }))
      .then((data) => {
        console.log('data: ', data);
        callback(null, data);
      });
    // if (files.length === 0) {
    //   callback(null, data);
    // }
  });
};

exports.readOne = (id, callback) => {
  fs.readdir(__dirname + '/data', (err, files) => {
    if (files.includes(id + '.txt')) {
      fs.readFile(__dirname + '/data/' + id + '.txt', (err, fileData) => {
        callback(null, { id, text: fileData.toString() });
      });
    } else {
      callback(new Error(`No item with id: ${id}`));
    }
  });
};

exports.update = (id, text, callback) => {
  fs.readdir(__dirname + '/data', (err, files) => {
    if (files.includes(id + '.txt')) {
      fs.writeFile(__dirname + '/data/' + id + '.txt', text, (err) => {
        callback(null, { id, text });
      });
    } else {
      callback(new Error(`No item with id: ${id}`));
    }
  });
};

exports.delete = (id, callback) => {
  fs.readdir(__dirname + '/data', (err, files) => {
    if (files.includes(id + '.txt')) {
      fs.unlink(__dirname + '/data/' + id + '.txt', (err) => {
        callback();
      });
    } else {
      callback(new Error(`No item with id: ${id}`));
    }
  });

  // var item = items[id];
  // delete items[id];
  // if (!item) {
  //   // report an error if item not found
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   callback();
  // }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
