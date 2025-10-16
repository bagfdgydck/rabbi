const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "leave",
  eventType: ["log:unsubscribe"],
  version: "3.3.0",
  credits: "𝐑𝐀𝐁𝐁𝐢⍟𝐕𝐀𝐈 | Modified by Akash",
  description: "Leave message system with fixed gif/image for leave & kick",
};

module.exports.onLoad = function () {
  const folders = [
    path.join(__dirname, "cache", "leaveGif"),
    path.join(__dirname, "cache", "kickGif")
  ];
  for (const folder of folders) {
    if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });
  }
};

module.exports.run = async function ({ api, event, Users, Threads }) {
  try {
    const { threadID } = event;
    const leftID = event.logMessageData?.leftParticipantFbId;

    if (!leftID) return;
    if (leftID == api.getCurrentUserID()) return; // বট নিজে গেলে কিছু না পাঠাবে

    const threadData = global.data.threadData.get(parseInt(threadID)) || (await Threads.getData(threadID)).data;
    const userName = global.data.userName.get(leftID) || await Users.getNameUser(leftID);

    const isLeave = (event.author == leftID);
    const typeText = isLeave
      ? "তুই নিজেই গ্রুপ থেকে লিভ নিলি 😤 আবার আইসিস না! 🚫"
      : "তোমাকে গ্রুপ থেকে লাথি মেরে বের করে দেওয়া হলো 🤣🚪";

    let msg = (typeof threadData.customLeave == "undefined")
      ? `━━━━━━━━━━━━━━━━━━━━━
😢 {name} {type}
━━━━━━━━━━━━━━━━━━━━━
ভালো থাকিস... কিন্তু গ্রুপের মজা মিস করবি 😉
✦─────꯭─⃝‌‌☞︎︎︎𝐑𝐀𝐁𝐁𝐢⍟𝐕𝐀𝐈☜︎︎𝐂𝐡𝐚𝐭 𝐁𝐨𝐭────✦`
      : threadData.customLeave;

    msg = msg.replace(/\{name}/g, userName).replace(/\{type}/g, typeText);

    // ফাইল পাথ সিলেক্ট করো
    const gifPath = isLeave
      ? path.join(__dirname, "cache", "leaveGif", "leave.gif")
      : path.join(__dirname, "cache", "kickGif", "kick.gif");

    let attachment = null;
    if (fs.existsSync(gifPath)) {
      attachment = fs.createReadStream(gifPath);
    }

    return api.sendMessage(
      attachment ? { body: msg, attachment } : { body: msg },
      threadID
    );

  } catch (e) {
    console.error("[ Leave Event Error ]", e);
  }
};
