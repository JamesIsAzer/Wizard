const { CronJob } = require('cron');

const { createLegendaryLeaderboard, createBuilderLeaderboard } = require('../service/automatic/leaderboard')

const scheduleLeaderboards = () => {
    const LEGENDS_RESET_TIME = '* * * * *' 
    const BUILDER_RESET_TIME = '* * * * *'
    
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
  