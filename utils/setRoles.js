const { IDs } = require('../config.json');
const { getConfig } = require('../config');
const { getVerifications } = require('../dao/mongo/verification/queries');
const roles = IDs.verificationRoles;
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
    if (user.roles.cache.has(roleID)) user.roles.remove(roleID);
  }

  const townhallFieldName = `townhall${townhallLevel}`
  user.roles.add(townhallRoles[townhallFieldName]);
}

const addAchievementRoles = (user, achieved, verificationRoles) => {
  if (achieved.legends && verificationRoles?.legends) user.roles.add(verificationRoles.legends);
  if (achieved.starLord && verificationRoles?.starLord) user.roles.add(verificationRoles.starLord);
  if (achieved.farmersRUs && verificationRoles?.farmersRUs) user.roles.add(verificationRoles.farmersRUs);
  if (achieved.masterBuilder && verificationRoles?.masterBuilder) user.roles.add(verificationRoles.masterBuilder);
  if (achieved.philanthropist && verificationRoles?.philanthropist) user.roles.add(verificationRoles.philanthropist);
  if (achieved.greenThumb && verificationRoles?.greenThumb) user.roles.add(verificationRoles.greenThumb);
  if (achieved.masterGamer && verificationRoles?.masterGamer) user.roles.add(verificationRoles.masterGamer);
  if (achieved.conqueror && verificationRoles.conqueror) user.roles.add(verificationRoles.conqueror);
  if (achieved.vanquisher && verificationRoles?.vanquisher) user.roles.add(verificationRoles.vanquisher);
  if (achieved.capitalist && verificationRoles?.capitalist) user.roles.add(verificationRoles.capitalist);
  if (achieved.campaigner && verificationRoles?.campaigner) user.roles.add(verificationRoles.campaigner);
  if (achieved.rockSolid && verificationRoles?.rockSolid) user.roles.add(verificationRoles.rockSolid);
  if (achieved.member && verificationRoles?.member) user.roles.add(verificationRoles.member);
};

const getMaxTownhallLevel = async (player, user) => {
  const oldThLevel = await getOldThLevel(user);

  const newThLevel = player.townHallLevel;

  console.log(oldThLevel)
  console.log(newThLevel)

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

  console.log(tags)
  console.log(townhallLevels)
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
