// ./modules/send-mail.js
var express = require('express');
var app = express();
var config = require('../config')[app.get('env')];
var nodemailer = require('nodemailer');


var transporter = nodemailer.createTransport({
  service: 'gmx.net',
  host: config.smtp,
  auth: {
    user: config.address,
    pass: config.gmxp
  }
});

var message = {
  from: 'compranata@gmx.de',
  to: 'compranata@gmail.com',
  subject: 'test mail from Node.js',
  text: 'Hi, this is test'
};

smtp.sendMail(message, (err, info) => {
  if (err) {
    console.log(err);
  } else {
    console.log('Message sent: ' + info.accepted);
    res.render('/login', {});
  }
})
