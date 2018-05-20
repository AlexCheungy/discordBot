//Discord.Js Library
const Discord = require('discord.js');

//Discord Bot Client
const client = new Discord.Client();

//Config File Containing:
  // -Discord Bot Unique token
  // -Discord Bot Command Prefix
const config = require("./config.json");

var request = require('request');

// Callback Function Gets The List Of imgflip Memes
  // GET Request
var memeList = function(callback) {
  request(config.imgFlipGet, {json:true}, (error, response, body) => {
    if (!error && response.statusCode == 200) {
      callback(null, body);
    }
    else {
      callback(error);
    }
  });
};

// This Event Plays When:
  // -Bot is turned on
  // -Bot reconnected  after disconnecting
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`)
  console.log(fun);
});

// This Event Plays When:
  // - A User Enters A Message To Any Channel The Bot Can See
client.on('message', async msg => {

  //Ignore messages from other bots
  if (msg.author.bot) return;

  //Ignore messages without the prefix
  if (msg.content.startsWith(config.prefix) != 1) return;

  var currMsg = msg.content.substring(1).toLowerCase();

  //Returns A List of Commands
  if (currMsg === "help") {
    msg.reply(config.help);
  }

  //Ping the Bot for Testing Purposes
  if (currMsg === 'ping') {
    msg.reply('pong');
  }

  //Send the User of Current Supported Meme Images
  if (currMsg === "listmemes") {
    memeList(function(error, data) {
      if (error) {
        msg.reply('Sorry I Had An Error Getting The List ');
        console.log(error);
      }
      else {
        console.log(data.data.memes);
        data.data.memes.forEach(function (item) {
          console.log(item.name);
        });
      }
    });
    msg.author.send("blah blah");
  }

});

// Log On To Discord Bot using this App Token
client.login(config.token);
