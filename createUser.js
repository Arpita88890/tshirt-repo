// createUser.js
const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect('mongodb://localhost/tshirt_inventory', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const newUser = new User({
  username: 'admin',
  password: '1234'
});

newUser.save()
  .then(() => {
    console.log('Default admin user created!');
    mongoose.disconnect();
  })
  .catch((err) => {
    console.error('Error creating user:', err);
  });