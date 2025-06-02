const { IDs } = require('../config.json');
const { user } = require('../client');
const { getConfig } = require('../config');
const roles = IDs.verificationRoles;

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

const addRoles = (anyRoles, achieved, townhallLevel, user) => {
  if (!anyRoles) return
  addAchievementRoles(user, achieved)
  addTownhallRole(user, townhallLevel)
}

const addTownhallRole = (user, townhallLevel, guildID) => {
  if (townhallLevel < 8) return
  
  const townhallRoles = getConfig(guildID).townhallRoles
  if (!townhallRoles) return

  for (const [_, roleID] of Object.entries(townhallRoles)) {
    if (user.roles.cache.has(roleID)) user.roles.remove(roleID);
  }

  const townhallFieldName = `townhall${townhallLevel}`
  user.roles.add(townhallRoles[townhallFieldName]);
}

const addAchievementRoles = (user, achieved, guildID) => {
  const verificationRoles = getConfig(guildID).verificationRoles
  
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

const getMaxTownhallLevel = (player, user) => {
  const oldThLevel = getOldThLevel(user);

  const newThLevel = player.townHallLevel;

  return Math.max(oldThLevel, newThLevel)
};

const getOldThLevel = (user) => {
  // TODO: The correct way should be to check max from verifications in DB (will require multi requests)
  const user_roles = user.roles.cache;
  for (let i in roles.townhall) {
    if (user_roles.has(roles.townhall[i].roleid)) return roles.townhall[i].lvl;
  }
  return 0;
};

const removeTH = (user, lvl) => {
  const user_roles = user.roles.cache;
  for (let i in roles.townhall) {
    if (
      user_roles.has(roles.townhall[i].roleid) &&
      roles.townhall[i].lvl < lvl
    ) {
      user.roles.remove(roles.townhall[i].roleid);
    }
  }
};

module.exports = {
  getAchievements,
  setTownhallRoles,
  hasAnyRoles,
  addAchievementRoles,
  getMaxTownhallLevel,
  addRoles
};
