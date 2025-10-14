const fs = require("fs");
module.exports.config = {
  name: "/",
    version: "1.0.1",
  hasPermssion: 0,
  credits: "NAZRUL", 
  description: "no prefix",
  commandCategory: "No command marks needed",
  usages: "Yo Yo",
    cooldowns: 5, 
};

module.exports.handleEvent = function({ api, event, client, __GLOBAL }) {
  var { threadID, messageID } = event;
  if (event.body.indexOf("/")==0 || (event.body.indexOf("/")==0)) {
    var msg = {
        body: "ikaw ay nakalabaw lamaw lamaw lamaw",
        attachment: fs.createReadStream(__dirname + `/noprefix/.`)
      }
      api.sendMessage(msg, threadID, messageID);
    api.setMessageReaction("🥀", event.messageID, (err) => {}, true)
    }
  }
  module.exports.run = function({ api, event, client, __GLOBAL }) {

}
