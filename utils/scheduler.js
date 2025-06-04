const { CronJob } = require('cron');

const { createLeaderboard } = require('../service/automatic/leaderboard')

const scheduleLeaderboards = () => {
    const RESET_TIME = '* * * * *'
    
    new CronJob({
        cronTime: RESET_TIME,
        onTick: function () {
            createLeaderboard()
        },
        start: true,
        utcOffset: -5
      });
}

module.exports = {
    scheduleLeaderboards
};
  