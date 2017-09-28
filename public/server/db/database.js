'use strict';

const Mongoose = require('mongoose');
const dbConnection = process.env.DB_CONNECTION;

Mongoose.connect(`${dbConnection}/friends-management`);

let db = Mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));

db.once('open', function callback () {
    console.log('Connection with database succeeded.');
});

exports.db = db;
