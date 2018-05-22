//Discord.Js Library
const Discord = require('discord.js');

//Discord Bot Client
const client = new Discord.Client();

//Packages for GET and POST Requests
const request = require('request');
const axios = require('axios');

//File Write Package
const fs = require('fs');

//Config File Containing:
  // -Discord Bot Unique token
  // -Discord Bot Command Prefix
const config = require("./config.json");

var JSONMemes;
var InputOptions = config.Inputs;

// Async/Await Function Gets The List of imgflip Memes
async function getMeme() {
  try {
    const response = await axios.get(config.imgFlipGet);
    JSONMemes = response.data.data.memes;
    var list = "";

    JSONMemes.forEach(function(item) {
      list = list + item.name + " ID: " + item.id + "\n";
    });
    fs.writeFile('MemeList.txt', list ,(error) => {
      if(error) return console.log(error);
    });
  }
  catch (error) {
    console.log(error);
  }
}

//Callback Function That Generates Memes on imgflip
  // POST Request
var generateMeme = function(InputOptions, callback) {
  request.post({url: config.imgFlipCaption, form: InputOptions}, (error, response, body) => {
    if (!error && response.statusCode == 200) {
      var JSONParse = JSON.parse(body);
      callback(null, JSONParse);
    }
    else
      callback(error);
  });
};

// This Event Plays When:
  // -Bot is turned on
  // -Bot reconnected  after disconnecting
client.on('ready', () => {
  getMeme();
  console.log(`Logged in as ${client.user.tag}!`);
});

// This Event Plays When:
  // - A User Enters A Message To Any Channel The Bot Can See
client.on('message', async msg => {

  //Ignore messages from other bots
  if (msg.author.bot) return;

  //Ignore messages without the prefix
  if (msg.content.startsWith(config.prefix) != 1) return;

  //Clean the Case Sensitivity
  var currMsg = msg.content.substring(1).toLowerCase();

  //Ignore If No Command After Prefix
  if (currMsg.length == 0) return;

  //Returns A List of Commands
  if (currMsg === "help") {
    msg.reply(config.help);
    return;
  }

  //Ping the Bot for Testing Purposes
  if (currMsg === 'ping') {
    msg.reply('pong');
    return;
  }

  //Send the User of Current Supported Meme Images
  if (currMsg === "listmemes") {
    msg.author.send("Here Are The List Of Supported Memes and Their IDs", {
      file: './MemeList.txt'
    });
    return;
  }

//*******************************************************************
  // Commands With Arguments To Parse
  if (currMsg.indexOf(" ") == -1) {
    return;
  }
  var args = currMsg.substr(currMsg.indexOf(" ") + 1);
  currMsg = currMsg.slice(0, currMsg.indexOf(" "));
  args = args.split(";");
  for(var i = 0; i < args.length; i++)
    args[i] = args[i].trim();

  // POST Request Reset Text Variables
  InputOptions.text0 = InputOptions.text1 = "";

  //Favorite Meme Gets Its Own Command
  if (currMsg === "mock") {
    if (args.length > 2) {
      msg.reply("Invalid Paramters Given");
      return;
    }
    else if (args.length == 1)
      InputOptions.text1 = args[0];
    else {
      InputOptions.text0 = args[0];
      InputOptions.text1 = args[1];
    }

    InputOptions.template_id = config.mockID;
    generateMeme(InputOptions, function(error, data) {
      if (error || data.success === false) return;
      else msg.reply(data.data.page_url);
  });
  return;
}

  //Generates Memes Off The Paramters Given
  if (currMsg === "make") {

    return;
  }
});

// Log On To Discord Bot using this App Token
client.login(config.token);
