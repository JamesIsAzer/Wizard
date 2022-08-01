const {
    getLeaderboardAccounts
  } = require('../../api/mongo/verify/connections');

const createLeaderboard = async() => {
    const t = await getLeaderboardAccounts()
    console.log(t)
}

module.exports = {
    createLeaderboard
}