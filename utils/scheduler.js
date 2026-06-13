const { CronJob } = require('cron');

const { createLegendaryLeaderboard, createBuilderLeaderboard } = require('../service/automatic/leaderboard')

const scheduleLeaderboards = () => {
    const LEGENDS_RESET_TIME = '10 0,12 * * *' 
    const BUILDER_RESET_TIME = '55 11,23 * * *'
    
    new CronJob({
        cronTime: LEGENDS_RESET_TIME,
        onTick: function () {
            createLegendaryLeaderboard()
        },
        start: true,
        utcOffset: -5
      });

      new CronJob({
        cronTime: BUILDER_RESET_TIME,
        onTick: function () {
            createBuilderLeaderboard()
        },
        start: true,
        utcOffset: -5
      });
}

module.exports = {
    scheduleLeaderboards
};
  