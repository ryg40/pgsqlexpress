var cron = require('node-schedule');
const sqlcoin = require('./sqlcoin');

exports.ns = function() {
  var rule = new cron.RecurrenceRule();
  rule.second = 10;
  cron.scheduleJob(rule, function() {
    console.log(new Date(), 'The 30th second of the minute.');

    sqlcoin();
  });
};

// module.exports = rule;
