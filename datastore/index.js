const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  //save new todos in individual files named in sequential order from getNextUniqueId
  //save new files in the exports.dataDir path (file name is the ID#)
  //file contents are JUST THE TEXT of the todo object (ie 'get more milk', no JSON formatting)
  //counter.txt should be increasing as new todos are added
  //number of files should increase as new todos are addded

  // var id = counter.getNextUniqueId();
  // items[id] = text;
  // callback(null, { id, text });


  counter.getNextUniqueId((err, data) => {
    console.log(data);
    if(err) {
      throw ('error create');
    } else {
      //figure out the text
      //create a new file named 'data'
      //fs.writeFile(file, data[, options], callback)
      fs.writeFile(`${data}.txt`, text, (err, data) => {
        // if (err) throw err;
        callback(err, data);
      });
    }
  });
};

exports.readAll = (callback) => {
  var data = _.map(items, (text, id) => {
    return { id, text };
  });
  callback(null, data);
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
