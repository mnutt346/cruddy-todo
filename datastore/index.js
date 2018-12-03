const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id) => {
    let fileName = __dirname + '/dataDir/' + id + '.txt';
    //console.log('exports.create fileName: ', fileName);
    fs.writeFile(fileName, text, (err) => {
      if (err) {
        throw ('error writing file: ', fileName);
      } else {
        callback(null, { id, text });
      }
    });
  });
  // items[id] = text;
};

exports.readAll = (callback) => {
  var data = [];
  // console.log('Inside readAll');
  fs.readdir(__dirname + '/dataDir', (err, files) => {
    _.each(files, (file, index) => {
      fs.readFile(__dirname + '/dataDir/' + file, (err, fileData) => {
        data.push({ id: file.slice(0, -4), text: fileData.toString() });
        // console.log('---IN EACH--- Data: ', data);
        if (index === files.length - 1) {
          console.log('Inside if - data: ', data);
          callback(null, data);
        }
      });
    });
    if (files.length === 0) {
      callback(null, data);
    }
  });
  // _.each(items, (text, id) => {
  //   data.push({ id, text });
  // });

};

exports.readOne = (id, callback) => {
  var text = items[id];
  if (!text) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback(null, { id, text });
  }
};

exports.update = (id, text, callback) => {
  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    items[id] = text;
    callback(null, { id, text });
  }
};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
