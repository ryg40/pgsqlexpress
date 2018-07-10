var Sequelize = require('sequelize');
var bcrypt = require('bcrypt');
const keys = require('../config/keys');

// create a sequelize instance with our local postgres database information.
var sequelize = new Sequelize(keys.pgString);

// setup User model and its fields.
const Coin = sequelize.define('coin', {
  coin: {
    type: Sequelize.STRING,
    unique: false,
    allowNull: false
  },
  confirmed: {
    type: Sequelize.FLOAT,
    unique: false,
    allowNull: false
  },
  unconfirmed: {
    type: Sequelize.FLOAT,
    unique: false,
    allowNull: false
  },
  ae_confirmed: {
    type: Sequelize.FLOAT,
    unique: false,
    allowNull: false
  },
  ae_unconfirmed: {
    type: Sequelize.FLOAT,
    unique: false,
    allowNull: false
  },
  exchange: {
    type: Sequelize.FLOAT,
    unique: false,
    allowNull: false
  },
  cashConfirmed: {
    type: Sequelize.FLOAT,
    unique: false,
    allowNull: false
  },
  cashPrice: {
    type: Sequelize.FLOAT,
    unique: false,
    allowNull: false
  }
});

// create all the defined tables in the specified database.
sequelize
  .sync()
  .then(() =>
    console.log(
      "coin table has been successfully created, if one doesn't exist"
    )
  )
  .catch(error => console.log('This error occured', error));

// sequelize.close().then(() => console.log('shut down gracefully'));
// export User model for use in other files.
module.exports = Coin;
