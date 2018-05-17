//Discord.Js Library
const Discord = require('discord.js');

//Discord Bot Client
const client = new Discord.Client();

//Config File Containing:
  // -Discord Bot Unique token
  // -Discord Bot Command Prefix
const config = require("./config.json");

// This Event Plays When:
  // -Bot is turned on
  // -Bot reconnected  after disconnecting
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`)
});

client.on('message', async msg => {

  //Ignore messages from other bots
  if (msg.author.bot) return;

  //Ignore messages without the prefix
  if (msg.content.startsWith(config.prefix) != 1) return;

  var currMsg = msg.content.substring(1).toLowerCase();

  //Returns A List of Commands
  if (currMsg === "help") {
    msg.reply(config.help);
    console.log(config.help)
  }

  if (currMsg === 'ping') {
    msg.reply('pong');
  }
});

// Log On To Discord Bot using this App Token
client.login(config.token);
