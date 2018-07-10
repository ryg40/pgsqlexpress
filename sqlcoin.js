var Coin = require('./models/coin');

const mphfunction = require('./loadpg');

// const doit = async () => {
//   try {
//     let values = await mphfunction();
//     console.log(values);
//   } catch (e) {
//     console.error(e);
//   }
// };

const insertPG = async () => {
  try {
    let values = await mphfunction();

    for (let data of values) {
      let sql = await Coin.create({
        coin: data.coin,
        confirmed: data.confirmed,
        unconfirmed: data.unconfirmed,
        ae_confirmed: data.ae_confirmed,
        ae_unconfirmed: data.ae_unconfirmed,
        exchange: data.exchange,
        cashConfirmed: data.cashConfirmed,
        cashPrice: data.cashPrice
      });
    }

    // let sql = await Coin.create({
    //   coin: data.coin,
    //   confirmed: data.confirmed,
    //   unconfirmed: data.unconfirmed,
    //   ae_confirmed: data.ae_confirmed,
    //   ae_unconfirmed: data.ae_unconfirmed,
    //   exchange: data.exchange,
    //   cashConfirmed: data.cashConfirmed,
    //   cashPrice: data.cashPrice
    // });

    // console.log(sql);
  } catch (e) {
    console.error(e);
  }
};

insertPG()
  .then(() => console.log('All Done :)'))
  .catch(err => console.error(err));

module.exports = insertPG;

// doit().then(data => {
//   console.log(data);
//   Coin.create({
//     coin: data.coin,
//     confirmed: data.confirmed,
//     unconfirmed: data.unconfirmed,
//     ae_confirmed: data.ae_confirmed,
//     ae_unconfirmed: data.ae_unconfirmed,
//     exchange: data.exchange,
//     cashConfirmed: data.cashConfirmed,
//     cashPrice: data.cashPrice
//   })
//     .then(sql => {
//       console.log(success);
//     })
//     .catch(error => {
//       res.redirect('/signup');
//     });
// });
