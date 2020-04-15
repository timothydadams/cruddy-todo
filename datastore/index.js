const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

const Promise = require('bluebird');
const readFilePromise = Promise.promisify(fs.readFile);

//var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  //save new todos in individual files named in sequential order from getNextUniqueId
  //save new files in the exports.dataDir path (file name is the ID#)
  //file contents are JUST THE TEXT of the todo object (ie 'get more milk', no JSON formatting)
  //counter.txt should be increasing as new todos are added
  //number of files should increase as new todos are addded
  counter.getNextUniqueId((err, id) => {
    if (err) {
      return callback(err);
    } else {
      //figure out the text
      //create a new file named 'data'
      //fs.writeFile(file, data[, options], callback)
      var dir = path.join(exports.dataDir, `${id}.txt`);
      fs.writeFile(dir, text, (err, data) => {
        if (err) {
          throw err;
        }
        callback(null, { id, text });
      });
    }
  });
};

exports.readAll = (callback) => {
  //build a list of files in the exports.dataDir directory
  //each todo id is encoded in the filename
  //DO NOT read the contents of each file
  //include a text field in your response to the client & you should use the messages ID from filename

  // OLD READALL - SYNCHRONOUS VERSION
  // var data = _.map(items, (text, id) => {
  //   return { id, text };
  // });
  // callback(null, data);

  // dir.read??
  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      return callback(err);
    }
    //console.log("FILES:", files);
    var data = _.map(files, (file) => {
      //extract ID
      var id = path.basename(file, '.txt');
      //generate filepath for each file
      var filePath = path.join(exports.dataDir, file);
      return readFilePromise(filePath).then((fileData) => {
        //return obj with id of filename and text property of fileData
        return {
          id: id,
          text: fileData.toString()
        };
      });
    });
    Promise.all(data).then((items) => callback(null, items), err => callback(err));
  });
};

exports.readOne = (id, callback) => {
  //build the txt file with the given id
  var dirPath = path.join(exports.dataDir, `${counter.idConverter(id)}.txt`);
  //read the text file for fileData (and conver it to a string)
  fs.readFile(dirPath, (err, fileData) => {
    if (err) {
      return callback(err);
    }
    callback(null, {id, text: fileData.toString()});
  });
};

exports.update = (id, text, callback) => {
  //convert id into full path
  var filePath = path.join(exports.dataDir, `${counter.idConverter(id)}.txt`);
  // flag
  const flag = fs.constants.O_WRONLY | fs.constants.O_TRUNC;
  fs.writeFile(filePath, text, {flag}, (err) => {
    if (err) {
      callback(err);
    } else {
      callback(null, {id, text});
    }
  });





  //   callback(null, { id, text });
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