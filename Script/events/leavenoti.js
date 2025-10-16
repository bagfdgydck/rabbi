module.exports.config = {
  name: "leave",
  eventType: ["log:unsubscribe"],
  version: "3.2.0",
  credits: "𝐑𝐀𝐁𝐁𝐢⍟𝐕𝐀𝐈 | Modified by Akash",
  description: "Leave message system with fixed gif/image for leave & kick",
  dependencies: {
    "fs-extra": "",
    "path": ""
  }
};

module.exports.onLoad = function () {
  const { existsSync, mkdirSync } = global.nodemodule["fs-extra"];
  const { join } = global.nodemodule["path"];
  const folders = [
    join(__dirname, "cache", "leaveGif"),
    join(__dirname, "cache", "kickGif")
  ];
  for (const folder of folders) {
    if (!existsSync(folder)) mkdirSync(folder, { recursive: true });
  }
};

module.exports.run = async function({ api, event, Users, Threads }) {
  const fs = require("fs");
  const path = require("path");
  const { threadID } = event;

  // যদি বট নিজে লিভ নেয়
  if (event.logMessageData.leftParticipantFbId == api.getCurrentUserID()) return;

  const data = global.data.threadData.get(parseInt(threadID)) || (await Threads.getData(threadID)).data;
  const name = global.data.userName.get(event.logMessageData.leftParticipantFbId)
    || await Users.getNameUser(event.logMessageData.leftParticipantFbId);

  const isLeave = (event.author == event.logMessageData.leftParticipantFbId);

  const typeText = isLeave
    ? "তুই নিজেই গ্রুপ থেকে লিভ নিলি 😤 আবার আইসিস না! 🚫"
    : "তোমাকে গ্রুপ থেকে লাথি মেরে বের করে দেওয়া হলো 🤣🚪";

  let msg = (typeof data.customLeave == "undefined")
    ? `━━━━━━━━━━━━━━━━━━━━━
😢 {name} {type}
━━━━━━━━━━━━━━━━━━━━━
ভালো থাকিস... কিন্তু গ্রুপের মজা মিস করবি 😉
✦─────꯭─⃝‌‌☞︎︎︎𝐑𝐀𝐁𝐁𝐢⍟𝐕𝐀𝐈☜︎︎𝐂𝐡𝐚𝐭 𝐁𝐨𝐭────✦`
    : data.customLeave;

  msg = msg.replace(/\{name}/g, name).replace(/\{type}/g, typeText);

  // আলাদা ফোল্ডার অনুযায়ী gif ফাইল সিলেক্ট করো
  const gifPath = isLeave
    ? path.join(__dirname, "cache", "leaveGif", "leave.gif")  // নিজে লিভ নিলে
    : path.join(__dirname, "cache", "kickGif", "kick.gif");  // কিক দিলে

  let attachment = null;
  if (fs.existsSync(gifPath)) {
    attachment = fs.createReadStream(gifPath);
  }

  return api.sendMessage(
    attachment ? { body: msg, attachment } : { body: msg },
    threadID
  );
};
