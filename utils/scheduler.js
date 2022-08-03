const { CronJob } = require('cron');

const scheduleLeaderboards = async() => {
    const RESET_TIME = '45 11,23 * * *'
    
    new CronJob({
        cronTime: RESET_TIME,
        onTick: function () {
            leaderboard.createLeaderboard(
                legendaryChannel,
                builderChannel,
                client
            );
        },
        start: true,
        utcOffset: -5
      });
}