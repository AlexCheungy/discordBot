//Discord.Js Library
const Discord = require('discord.js');

//Discord Bot Client
const client = new Discord.Client();

//Package for GET and POST Requests
const request = require('request');

//Config File Containing:
  // -Discord Bot Unique token
  // -Discord Bot Command Prefix
const config = require("./config.json");

// Callback Function Gets The List Of imgflip Memes
  // GET Request
var memeList = function(callback) {
  request(config.imgFlipGet, {json:true}, (error, response, body) => {
    if (!error && response.statusCode == 200) {
      var list2, list3, list;
      body.data.memes.forEach(function (item) {
        list = list + "Meme: " + item.name + " ID: " + item.id + "\n";
      });
      console.log(body.data.memes.length);
      callback(null, list);
    }
    else {
      callback(error);
    }
  });
};

//Callback Function That Generates Memes on imgflip
  // POST Request
var generateMeme = function(InputOptions, callback) {
  request.post({url: config.imgFlipCaption, form: InputOptions}, (error, response, body) => {
    if (!error && response.statusCode == 200) {
      var JSONParse = JSON.parse(body);
      callback(null, JSONParse.data.page_url);
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
    memeList(function(error, data) {
      if (error) {
        msg.reply('Sorry I Had An Error Getting The List ');
        console.log(error);
      }
      else {
        console.log(data.length);
        msg.author.send("These are the List of Memes, You Can Use Either The Name or ID\n");
        msg.author.send("```");
      }
    });
  }

  // Commands With Arguments To Parse

  console.log("Pass This Point");
  if (currMsg === "pass") console.log("Woah");

  //Special Meme That Is Case Sensitive
    //This Requires Regex and Special POST Request Options
  if (currMsg === "mock") {
    var InputOptions = config.Inputs;
    InputOptions.template_id = config.mockID;
    InputOptions.text0 = "";
    InputOptions.text1 = "i mAdE A DiSCorD Bot";
    generateMeme(InputOptions, function(error, data) {
      if (error) return;
      else msg.reply(data);
  });
}

  //Generates Memes Off The Paramters Given
  if (currMsg === "make") return;

});

// Log On To Discord Bot using this App Token
client.login(config.token);
