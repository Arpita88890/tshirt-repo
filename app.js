const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
mongoose.connect('mongodb://localhost/tshirt_inventory', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'secret', resave: false, saveUninitialized: true }));
app.set('view engine', 'ejs');
app.use(express.static('public'));

// Routes
const routes = require('./routes/tshirtRoutes');
app.use('/', routes);

app.listen(3000, () => console.log('Server started at http://localhost:3000'));