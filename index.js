// MIT License. Copyright (c) 2021 Elandig

'use strict'

const express = require('express')
const helmet = require('helmet')
const path = require('path')
const cookieParser = require('cookie-parser');
const session = require('express-session');


const { NanFibonacci } = require('./lib/nan-fibonacci/build/Release/nan_fibonacci.node')
const PORT = process.env.PORT || 3000

const app = express()


app.use(cookieParser());
app.use(session({ secret: process.env.SECRET || "Some secret value", expires: new Date(Date.now() + (process.env.EXPIRES || 300000)) }));
app.use(helmet({ contentSecurityPolicy: false }))

var session_instances = []

app.get('/', (req, res) => {
  if (!req.session.instance || !session_instances[req.session.instance]) {
    req.session.instance = req.sessionID
    session_instances[req.session.instance] = new NanFibonacci()
  }
  res.sendFile(path.join(__dirname, '/public/index.html'))
})

app.get('/get', (req, res) => {
  if (req.session.instance && session_instances[req.session.instance]) {
    res.send(session_instances[req.session.instance].get())
  } else {
    res.send(400)
  }
})

app.get('/reset', (req, res) => {
  if (req.session.instance && session_instances[req.session.instance]) {
    res.send(session_instances[req.session.instance].reset())
  } else {
    res.send(400)
  }
})

app.listen(PORT, () => {
  console.log(`App is listening at http://localhost:${PORT}`)
})