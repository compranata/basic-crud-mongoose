// ./modules/db-crud.js

// const mongoose = require('mongoose')
const paginate = require('express-paginate')
// var passport = require('passport');
// const { check } = require('express-validator/check')

const md = require('markdown-it')({ breaks: true })

const model = require('../models/posts')
const Post = model.Post

const Mdb = function (req) {
  this.title = 'Index'
  this.originalQuery = req.query.q || ''
  this.query = {}
  this.parm_id = req.params.id || ''
  this.qry_page = req.query.page || 0
  this.qry_limit = req.query.limit || 0
  this.totalHit = 0
  this.posts = {}
  this.pageCount = 0
  this.pages = 0
  this.user = req.user
  this.urlStr0 = ''
  this.urlStrN = ''
}

// method: 'save'
Mdb.prototype.save = function (req, res, cb) {
  if (!req.user) return false
  const post = new Post(req.body)
  post.html = md.render(req.body.body)
  post.user_id = req.user._id
  post.active = true
  post.save((err, post) => {
    cb(err, post)
  })
}

// method: 'update'
Mdb.prototype.update = function (req, res, cb) {
  if (!req.user) return false
  const post = new Post(req.body)
  post.html = md.render(req.body.body)
  post.user_id = req.user._id
  Post.updateOne({ _id: post._id }, post, (err, result) => {
    cb(err, result)
  })
}

// method: 'destroy'
Mdb.prototype.destroy = function (req, res, cb) {
  if (!req.user) return false
  Post.remove(req.body, (err) => {
    cb(err)
  })
}

// method: 'search'
Mdb.prototype.search = function (req, res, cb) {
  if (this.originalQuery) {
    let keyword = (this.originalQuery).split(/\s/).join('|')
    this.query = { $or: [
      { subject: new RegExp(`.*${keyword}.*`, 'i') },
      { body: new RegExp(`.*${keyword}.*`, 'i') }
    ] }
    this.title = 'Search Results'
  }
  if (this.parm_id) {
    this.query = { _id: this.parm_id }
    this.title = 'Details'
  }

  // send model.paginate()
  Post.paginate(this.query, { page: this.qry_page, limit: this.qry_limit }, (err, result) => {
    if (!err) {
      this.posts = result.docs
      this.totalHit = result.total
      this.currentPage = result.page
      this.pageCount = result.pages
      this.pages = paginate.getArrayPages(req)(5, result.pages, this.qry_page)
      this.urlStr0 = '?page=1&limit=' + result.limit
      this.urlStrN = '?page=' + result.pages + '&limit=' + result.limit
      cb(null, this)
    } else {
      cb(err, this)
    }
  })
}

module.exports = Mdb
