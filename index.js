// MIT License. Copyright (c) 2021 Elandig

'use strict'

const express = require('express')
const helmet = require('helmet')
const path = require('path')
const cookieParser = require('cookie-parser');
const session = require('express-session');
const app = express()

const { NanFibonacci } = require('./lib/nan-fibonacci/build/Release/nan_fibonacci.node')

const PORT = process.env.PORT || 3000

// Middleware
app.use(cookieParser());
app.use(session({ secret: process.env.SECRET || "Some secret value", expires: new Date(Date.now() + (process.env.EXPIRES || 300000)), resave: true, saveUninitialized: false }));
app.use(helmet({ contentSecurityPolicy: false }))
app.use('/static', express.static('public'))

// Array for NanFibonacci session instances storage
var session_instances = []

app.get('/', (req, res) => {
  // Check if the session already exists, if not then create a new NanFibonacci instance
  if (!req.session.instance || !session_instances[req.session.instance]) {
    req.session.instance = req.sessionID
    session_instances[req.session.instance] = new NanFibonacci()
  }
  res.sendFile(path.join(__dirname, '/public/index.html'))
})

app.get('/get', (req, res) => {
  // Check if the session already exists, if it does then call & send the result of the get() method to the user
  if (req.session.instance && session_instances[req.session.instance]) {
    res.send(session_instances[req.session.instance].get())
  } else {
    res.send(400)
  }
})

app.get('/reset', (req, res) => {
  // Check if the session already exists, if it does then call & send the result of the reset() method to the user
  if (req.session.instance && session_instances[req.session.instance]) {
    res.send(session_instances[req.session.instance].reset())
  } else {
    res.send(400)
  }
})

app.listen(PORT, () => {
  console.log(`App is listening at http://localhost:${PORT}`)
})