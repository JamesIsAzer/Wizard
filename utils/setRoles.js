const { getVerifications } = require('../dao/mongo/verification/queries');
const Bottleneck = require('bottleneck');
const { findProfile } = require('../dao/clash/verification');

const limiter = new Bottleneck({
    maxConcurrent: 10,
    minTime: 25
});

const getAchievements = (playerData) => {
  const playerAchievement = playerData.achievements;
  const achieved = {
    legends: playerData.bestTrophies >= 5000,
    starLord: 
      playerData.warStars >= 1300 &&
      playerAchievement[33].value >= 500,
    farmersRUs:
      playerAchievement[5].value >= 2000000000 &&
      playerAchievement[6].value >= 2000000000 &&
      playerAchievement[16].value >= 20000000,
    masterBuilder: playerData.bestBuilderBaseTrophies >= 5000,
    philanthropist: playerAchievement[14].value >= 750000,
    greenThumb: playerAchievement[3].value >= 7500,
    masterGamer: playerAchievement[31].value >= 150000,
    conqueror: playerData?.legendStatistics?.bestSeason?.rank <= 1000,
    vanquisher: playerData?.legendStatistics?.bestBuilderBaseSeason?.rank <= 1000,
    capitalist: playerData?.clanCapitalContributions >= 3000000,
    campaigner: playerAchievement[1].value >= 270,
    bsoto: playerData.expLevel >= 300,
    rockSolid: playerAchievement[13].value >= 7500,
    member: playerData?.townHallLevel >= 5
  };

  return achieved
};

const setTownhallRoles = () => addTownhall(playerData, user);

const hasAnyRoles = (thLevel) => thLevel !== 0 || Object.values(achieved).some((val) => val === true);

const addRoles = (anyRoles, achieved, townhallLevel, user, config) => {
  if (!anyRoles) return
  addAchievementRoles(user, achieved, config.verificationRoles)
  addTownhallRole(user, townhallLevel, config.townhallRoles)
}

const addTownhallRole = (user, townhallLevel, townhallRoles) => {
  if (townhallLevel < 8) return
  if (!townhallRoles) return

  for (const [_, roleID] of Object.entries(townhallRoles)) {
    if (user.roles.cache.has(roleID)) 
      user.roles.remove(roleID)
        .catch((_) => console.error(`${new Date().toString()} - Error removing role with role ID: ${roleID}`) )
  }

  const townhallFieldName = `townhall${townhallLevel}`
  const roleID = townhallRoles[townhallFieldName]
  user.roles.add(roleID)
    .catch((_) => console.error(`${new Date().toString()} - Error adding role with role ID: ${roleID}`) )
}

const addAchievementRoles = (user, achieved, verificationRoles) => {
  const addAchievementRole = (achieved, roleID) => {
    if (achieved && roleID) 
      user.roles.add(roleID)
        .catch((_) => console.error(`${new Date().toString()} - Error adding role with role ID: ${roleID}`))
  }

  addAchievementRole(achieved.legends, verificationRoles?.legends)
  addAchievementRole(achieved.starLord, verificationRoles?.starLord)
  addAchievementRole(achieved.farmersRUs, verificationRoles?.farmersRUs)
  addAchievementRole(achieved.masterBuilder, verificationRoles?.masterBuilder)
  addAchievementRole(achieved.philanthropist, verificationRoles?.philanthropist)
  addAchievementRole(achieved.greenThumb, verificationRoles?.greenThumb)
  addAchievementRole(achieved.masterGamer, verificationRoles?.masterGamer)
  addAchievementRole(achieved.conqueror, verificationRoles?.conqueror)
  addAchievementRole(achieved.vanquisher, verificationRoles?.vanquisher)
  addAchievementRole(achieved.capitalist, verificationRoles?.capitalist)
  addAchievementRole(achieved.campaigner, verificationRoles?.campaigner)
  addAchievementRole(achieved.bsoto, verificationRoles?.bsoto)
  addAchievementRole(achieved.rockSolid, verificationRoles?.rockSolid)
  addAchievementRole(achieved.member, verificationRoles?.member)
};

const getMaxTownhallLevel = async (player, user) => {
  const oldThLevel = await getOldThLevel(user);

  const newThLevel = player.townHallLevel;

  return Math.max(oldThLevel, newThLevel)
};

const getOldThLevel = async (user) => {
  const tags = (await getVerifications(user.id)).map((verification) => verification.playerTag)

  const townhallLevels = await Promise.all(
    tags.map((tag) =>
      limiter.schedule(async () => {
        const account = await findProfile(tag)
        if (!account.response?.found) return 0
        return account.response.data.townHallLevel
      })
    )
  )

  return Math.max(...townhallLevels)
};

module.exports = {
  getAchievements,
  setTownhallRoles,
  hasAnyRoles,
  addAchievementRoles,
  getMaxTownhallLevel,
  addRoles
};
