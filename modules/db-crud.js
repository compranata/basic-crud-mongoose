// ./modules/db-crud.js

var mongoose = require('mongoose');
var paginate = require('express-paginate');
var passport = require('passport');

var model = require('../models/posts');
var Post = model.Post;


var db = db || {};

db.save = (obj) => {
  obj.save(function(err){
    if (err) throw err;
  });
  return this;
};

db.update = (obj) => {
  const id = {_id: obj._id};
  Post.updateOne(id, obj, function(err) {
    if (err) throw err;
  });
  return this;
};

db.destroy = (obj) => {
  const id = {_id: obj._id};
  Post.remove(obj, function(err) {
    if (err) throw err;
  });
  return this;
};

db.search = (qry, parm, next) => {
  var response = {
    query: {},
    resultType: 'Index',
    result: {}
  };
  console.log(qry);
  // qry.q = "url string" with ?q=search_keywords
  if (qry.q) {
    let keyword = (qry.q).split(/\s/).join('|');
    response.query = {$or: [
      {subject: new RegExp(`.*${keyword}.*`, 'i')},
      {body:    new RegExp(`.*${keyword}.*`, 'i')}
    ]};
    response.resultType = 'Search Results';
  };

  // parm.id = http request with /:id
  if (parm.id) {
    response.query = {_id: parm.id};
    response.resultType = 'Details';
  };

  // send model.paginate()
  Post.paginate(response.query, {page: qry.page, limit: qry.limit}, function(err, result) {
    if (err) throw err;
    response.result = result;
    next(response);
  });
};

module.exports = db;
