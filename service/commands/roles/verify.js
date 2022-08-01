const { SlashCommandBuilder } = require('@discordjs/builders');
const {
  verifyProfile,
  findProfile,
} = require('../../../api/clash/verification');
const {
  tagVerified,
  alreadyTaken,
  insertVerification,
} = require('../../../api/mongo/verify/connections');
const {
  getInvalidApiTokenEmbed,
  getInvalidTagEmbed,
  getValidVerificationEmbed,
} = require('../../../utils/embeds/verify');
const { IDs } = require('../../../config.json');
const roles = IDs.verificationRoles;

module.exports = {
  data: new SlashCommandBuilder()
    .setName('verify')
    .setDescription('Verifies a user and sets their roles.')
    .addStringOption((option) =>
      option
        .setName('tag')
        .setDescription('Your in-game player tag.')
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName('token')
        .setDescription('The API token of the account')
        .setRequired(true)
    ),
  async execute(interaction) {
    const tag = interaction.options.getString('tag');
    const token = interaction.options.getString('token');

    const findProfileResponse = await findProfile(tag);

    if (findProfileResponse.error) {
      await interaction.editReply(
        `An error has occured: ${findProfileResponse.error}`
      );
      return;
    }

    if (!findProfileResponse.response.found) {
      await interaction.editReply({
        embeds: [getInvalidTagEmbed()],
        ephemeral: true,
      });
      return;
    }
    const profileData = findProfileResponse.response.data;

    const verifyResponse = await verifyProfile(tag, token);
    if (verifyResponse.error) {
      await interaction.editReply(
        `An error has occured: ${verifyResponse.error}`
      );
      return;
    }

    const isValid = verifyResponse.response.status === 'ok';
    if (!isValid) {
      await interaction.editReply({
        embeds: [getInvalidApiTokenEmbed()],
        ephemeral: true,
      });
      return;
    }

    if (await tagVerified(tag)) {
      if (await alreadyTaken(tag, interaction.member.id)) {
        await interaction.editReply('This account is already taken!');
        return;
      } else {
        await interaction.editReply({
          embeds: [setRoles(profileData, interaction.member)],
          ephemeral: true,
        });
        return;
      }
    } else {
      insertVerification(tag, interaction.member.id);
      await interaction.editReply({
        embeds: [setRoles(profileData, interaction.member)],
        ephemeral: true,
      });
      return;
    }
  },
};

const setRoles = (playerData, user) => {
  const playerAchievement = playerData.achievements;
  const achieved = {
    legends: playerData.bestTrophies >= 5000,
    starLord: playerData.warStars >= 1300,
    farmersRUs:
      playerAchievement[5].value >= 2000000000 &&
      playerAchievement[6].value >= 2000000000,
    blackGold: playerAchievement[16].value >= 20000000,
    masterBuilder: playerData.bestVersusTrophies >= 5000,
    philanthropist: playerAchievement[14].value >= 750000,
    alchemist: playerAchievement[23].value >= 20000,
    rockSolid: playerAchievement[13].value >= 10000,
    greenThumb: playerAchievement[3].value >= 7500,
    leagueLord: playerAchievement[33].value >= 500,
    masterGamer: playerAchievement[31].value >= 150000,
  };

  addAchievementRoles(user, achieved);
  const thLevel = addTownhall(playerData, user);

  const noRoles =
    thLevel === 0 && Object.values(achieved).every((val) => val === false);

  return getValidVerificationEmbed(
    createValidVerificationEmbedDescription(achieved, thLevel, noRoles)
  );
};

const createValidVerificationEmbedDescription = (
  achieved,
  thLevel,
  noRoles
) => {
  if (noRoles) return `• Not eligible for any roles\n`;

  let thEmbedDesc = '';
  for (thRole in roles.townhall) {
    if (roles.townhall[thRole].lvl === thLevel) {
      thEmbedDesc = `${roles.townhall[thRole].icon} <@&${roles.townhall[thRole].roleid}> added!\n`;
      break;
    }
  }

  return (
    (achieved.legends
      ? `${roles.prestige.legends.icon} <@&${roles.prestige.legends.roleid}> added!\n`
      : ``) +
    (achieved.starLord
      ? `${roles.prestige.starlord.icon} <@&${roles.prestige.starlord.roleid}> added!\n`
      : ``) +
    (achieved.farmersRUs
      ? `${roles.prestige.farmersrus.icon} <@&${roles.prestige.farmersrus.roleid}> added!\n`
      : ``) +
    (achieved.blackGold
      ? `${roles.prestige.blackgold.icon} <@&${roles.prestige.blackgold.roleid}> added!\n`
      : ``) +
    (achieved.masterBuilder
      ? `${roles.prestige.masterbuilder.icon} <@&${roles.prestige.masterbuilder.roleid}> added!\n`
      : ``) +
    (achieved.philanthropist
      ? `${roles.prestige.philanthropist.icon} <@&${roles.prestige.philanthropist.roleid}> added!\n`
      : ``) +
    (achieved.alchemist
      ? `${roles.prestige.alchemist.icon} <@&${roles.prestige.alchemist.roleid}> added!\n`
      : ``) +
    (achieved.rockSolid
      ? `${roles.prestige.rocksolid.icon} <@&${roles.prestige.rocksolid.roleid}> added!\n`
      : ``) +
    (achieved.greenThumb
      ? `${roles.prestige.greenthumb.icon} <@&${roles.prestige.greenthumb.roleid}> added!\n`
      : ``) +
    (achieved.leagueLord
      ? `${roles.prestige.leaguelord.icon} <@&${roles.prestige.leaguelord.roleid}> added!\n`
      : ``) +
    (achieved.masterGamer
      ? `${roles.prestige.mastergamer.icon} <@&${roles.prestige.mastergamer.roleid}> added!\n`
      : ``) +
    (thLevel > 0 ? thEmbedDesc : ``)
  );
};

const addAchievementRoles = (user, achieved) => {
  if (achieved.legends) user.roles.add(roles.prestige.legends.roleid);
  if (achieved.starLord) user.roles.add(roles.prestige.starlord.roleid);
  if (achieved.farmersRUs) user.roles.add(roles.prestige.farmersrus.roleid);
  if (achieved.blackGold) user.roles.add(roles.prestige.blackgold.roleid);
  if (achieved.masterBuilder)
    user.roles.add(roles.prestige.masterbuilder.roleid);
  if (achieved.philanthropist)
    user.roles.add(roles.prestige.philanthropist.roleid);
  if (achieved.alchemist) user.roles.add(roles.prestige.alchemist.roleid);
  if (achieved.rockSolid) user.roles.add(roles.prestige.rocksolid.roleid);
  if (achieved.greenThumb) user.roles.add(roles.prestige.greenthumb.roleid);
  if (achieved.leagueLord) user.roles.add(roles.prestige.leaguelord.roleid);
  if (achieved.masterGamer) user.roles.add(roles.prestige.mastergamer.roleid);
};

const addTownhall = (player, user) => {
  const oldThLevel = getOldThLevel(user);

  const newThLevel = player.townHallLevel;

  if (newThLevel > oldThLevel) {
    removeTH(user, player.townHallLevel);

    for (thRole in roles.townhall) {
      if (roles.townhall[thRole].lvl === newThLevel) {
        user.roles.add(roles.townhall[thRole].roleid);
        return newThLevel;
      }
    }
  }

  return 0;
};

const getOldThLevel = (user) => {
  const user_roles = user.roles.cache;
  for (i in roles.townhall) {
    if (user_roles.has(roles.townhall[i])) return roles.townhall[i].lvl;
  }
  return 0;
};

const removeTH = (user, lvl) => {
  const user_roles = user.roles.cache;
  for (i in roles.townhall) {
    if (
      user_roles.has(roles.townhall[i].roleid) &&
      roles.townhall[i].lvl < lvl
    ) {
      user.roles.remove(roles.townhall[i].roleid);
    }
  }
};
