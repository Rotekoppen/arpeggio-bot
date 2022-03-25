const config = require('../config.js');

module.exports = function(emoji) {
  if (config.emojis[emoji].length == 0) {
    return ""
  }
  return config.emojis[emoji][Math.floor(Math.random() * config.emojis[emoji].length)];
};
