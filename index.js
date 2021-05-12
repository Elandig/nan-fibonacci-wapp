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

const isValidArgument = (n) => { return /^[0-9]+$/.test(n) }

app.get('/', (req, res) => {
  if (!req.session.instance || !session_instances[req.session.instance][0])
    req.session.instance = req.sessionID
  // Creates & resets the instance on page reload
  session_instances[req.session.instance] = [new NanFibonacci()]

  res.sendFile(path.join(__dirname, '/public/index.html'))
})

// Validates the request and sends the results of get() method according to the given id
app.get('/get/:id', (req, res) => {
  if (req.session.instance && session_instances[req.session.instance] && isValidArgument(req.params.id)) {
    let id = parseInt(req.params.id)
    if (!session_instances[req.session.instance][id])
      session_instances[req.session.instance][id] = new NanFibonacci()
    res.send(session_instances[req.session.instance][id].get())
  } else {
    res.sendStatus(400)
  }
})

// Validates the request and sends the results of reset() method according to the given id
app.get('/reset/:id', (req, res) => {
  if (req.session.instance && session_instances[req.session.instance] && isValidArgument(req.params.id) && session_instances[req.session.instance][parseInt(req.params.id)]) {
    res.send(session_instances[req.session.instance][parseInt(req.params.id)].reset() ? 200 : 500)
  } else {
    res.sendStatus(400)
  }
})

// Validates the request and removes the instance by its id
app.get('/delete/:id', (req, res) => {
  if (req.session.instance &&
    session_instances[req.session.instance] &&
    isValidArgument(req.params.id) &&
    parseInt(req.params.id) !== 0) {
    if (session_instances[req.session.instance][parseInt(req.params.id)])
      session_instances[req.session.instance][parseInt(req.params.id)] = null
    res.sendStatus(200)
  } else {
    res.sendStatus(400)
  }
})

// Validates the request and sends the results of genFibo(amount) method
app.get('/generate/:amount', (req, res) => {
  if (req.session.instance && session_instances[req.session.instance] && isValidArgument(req.params.amount) && parseInt(req.params.amount) <= 50000 && parseInt(req.params.amount) > 0) {
    res.send(session_instances[req.session.instance][0].genFibo(parseInt(req.params.amount)))
  } else {
    res.sendStatus(400)
  }
})

// Validates the request and sends the results of isFibo(sequence) method
app.get('/isfibo/:sequence', (req, res) => {
  if (req.session.instance && session_instances[req.session.instance] && isValidArgument(req.params.sequence)) {
    res.send(session_instances[req.session.instance][0].isFibo(req.params.sequence))
  } else {
    res.sendStatus(400)
  }
})

app.listen(PORT, () => {
  console.log(`App is listening at http://localhost:${PORT}`)
})