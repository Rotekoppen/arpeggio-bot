const { MongoClient } = require('mongodb');
const config = require('../config.js');

const client = new MongoClient(config.mongodb.url);

let _ = {}

async function init() {
  await client.connect();
  console.log('Connected to the database');
  _.db = client.db(config.mongodb.dbName);
  _.users = _.db.collection('users');
  _.guilds = _.db.collection('guilds');
}

async function getUser(userId) {
  const user = await _.users.find({ _id: userId }).toArray();
  if (user.length > 0) {
    return user[0]
  }else {
    await _.users.insertOne({ _id: userId });
    return await getUser(userId)
  }
}

async function updateUser(userId, update) {
  await getUser(userId);
  return await _.users.updateOne({ _id: userId }, update);
}

async function deleteUser(userId) {
  return await _.users.deleteMany({ _id: userId });
}

async function getGuild(guildId) {
  const guild = await _.guilds.find({ _id: guildId }).toArray();
  if (guild.length > 0) {
    return guild[0]
  }else {
    await _.guilds.insertOne({ _id: guildId });
    return await getGuild(guildId)
  }
}

async function updateGuild(guildId, update) {
  await getGuild(guildId);
  return await _.guilds.updateOne({ _id: guildId }, update);
}

async function deleteGuild(guildId) {
  return await _.guilds.deleteMany({ _id: guildId });
}

module.exports = {getUser, updateUser, deleteUser, getGuild, updateGuild, deleteGuild, init}
