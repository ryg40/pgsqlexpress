const axios = require('axios');
const keys = require('./config/keys');

//* Example data from miningpoolhub
// let data = {
//   coin: 'bitcoin-private',
//   confirmed: 0.01632659,
//   unconfirmed: 0,
//   ae_confirmed: 0,
//   ae_unconfirmed: 0,
//   exchange: 0
// };

let data;

module.exports = doitall = async () => {
  // const doitall = async () => {
  try {
    //* API only returns 100 at a time. MAXCOIN was in the 600s
    const allRanks = [1, 101, 201, 301, 401, 501, 601, 701, 801, 900];

    //* mktArray holds the API data from Coinmarketcap
    let mktArray = [];

    for (let values of allRanks) {
      let mktresp = await axios.get(
        'https://api.coinmarketcap.com/v2/ticker/?start=' +
          values +
          '&limit=100&structure=array'
      );

      //* Conact instead of push. Appends next round of coin data.

      mktArray = mktArray.concat(
        mktresp.data.data.map(x => ({
          coinName: x.name.toUpperCase(),
          coinPrice: x.quotes.USD.price,
          coinSymbol: x.symbol
        }))
      );
    }

    //* Call the MPH End point using API key

    const mph = await axios.get(
      'https://miningpoolhub.com/index.php?page=api&action=getuserallbalances&api_key=' +
        keys.mphKey
    );

    //* Set variable for proper response location
    let mphReturn = mph.data.getuserallbalances.data;

    //* Map response to correct names, strip dashes, set to 5 decimal spaces.

    // const mphClean = mphReturn.map(coinage => ({

    //   coin: coinage.coin.toUpperCase().replace(/-/g, ' '),
    //   confirmed: parseFloat(coinage.confirmed).toFixed(5),
    //   unconfirmed: coinage.unconfirmed,
    //   ae_confirmed: parseFloat(coinage.ae_confirmed + coinage.exchange).toFixed(
    //     5
    //   ),
    //   ae_unconfirmed: coinage.ae_unconfirmed,
    //   exchange: coinage.exchange
    // }));

    const mphClean = mphReturn
      .filter(not => {
        if (not.coin.toUpperCase().replace(/-/g, ' ') === 'DIGIBYTE SKEIN') {
          return false;
        }
        return true;
      })

      .map(coinage => ({
        coin: coinage.coin.toUpperCase().replace(/-/g, ' '),
        confirmed: parseFloat(coinage.confirmed).toFixed(5),
        unconfirmed: coinage.unconfirmed,
        ae_confirmed: parseFloat(
          coinage.ae_confirmed + coinage.exchange
        ).toFixed(5),
        ae_unconfirmed: coinage.ae_unconfirmed,
        exchange: coinage.exchange
      }));

    // console.log(mphClean);

    //! Loop over each MPH entry and compare against the coinmarketcap array

    for (let [key, val] of Object.entries(mphClean)) {
      //!  find to compare data coin names. If no hit, just return new.

      let checkVal =
        mktArray.find(n => n.coinName === val.coin.toUpperCase()).coinPrice ||
        'new';

      //! Calculate confirmed total in $$$$$

      mphClean[key]['cashConfirmed'] = parseFloat(
        checkVal * mphClean[key].confirmed
      ).toFixed(4);

      //! Calculate confirmed total in $$$$$

      mphClean[key]['cashPrice'] = checkVal;

      // console.log(checkVal);
    }
    // console.log(mphClean);

    data = mphClean;

    return data;
  } catch (e) {
    console.error(e);
  }
};

// doitall();
// export default async function() {
//   if (!data) {
//     await doitall();
//   }
//   if (!data) {
//     throw new Error('Could not call Coinmarketcap API');
//   }
//   let data = mphClean;
//   return data;
// }
