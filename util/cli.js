module.exports = function (client) {
  var cliui = require("CLI-UI");

  cliui.addCommand("status", {
    function: () => {
      process.stdout.write(`${Object.keys(client.dtune.players).length} players active\n`);
      cliui.readline.prompt();
    },
    helpText: "Prints the status of the different components of the bot"
  });

  cliui.addCommand("invite", {
    function: () => {
      process.stdout.write(client.config.inviteLink.split("@@@").join(client.user.id) + "\n")
      cliui.readline.prompt();
    },
    helpText: "Prints the invite link for this bot"
  })

  return cliui
}
