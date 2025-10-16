module.exports.config = {
  name: "leave",
  eventType: ["log:unsubscribe"],
  version: "2.0.0",
  credits: "𝐑𝐀𝐁𝐁𝐢⍟𝐕𝐀𝐈 | Modified by Akash",
  description: "Leave message with optional gif/image/video",
  dependencies: {
    "fs-extra": "",
    "path": ""
  }
};

module.exports.onLoad = function () {
  const { existsSync, mkdirSync } = global.nodemodule["fs-extra"];
  const { join } = global.nodemodule["path"];
  const paths = [
    join(__dirname, "cache", "leaveGif")
  ];
  for (const path of paths) {
    if (!existsSync(path)) mkdirSync(path, { recursive: true });
  }
};

module.exports.run = async function({ api, event, Users, Threads }) {
  const fs = require("fs");
  const path = require("path");
  const { threadID } = event;

  // যদি বট নিজে লিভ নেয়, তাহলে কিছু না পাঠিয়ে রিটার্ন করো
  if (event.logMessageData.leftParticipantFbId == api.getCurrentUserID()) return;

  const data = global.data.threadData.get(parseInt(threadID)) || (await Threads.getData(threadID)).data;
  const name = global.data.userName.get(event.logMessageData.leftParticipantFbId) || await Users.getNameUser(event.logMessageData.leftParticipantFbId);

  // চেক করো — সে নিজে লিভ নিল, না অ্যাডমিন রিমুভ করল
  const type = (event.author == event.logMessageData.leftParticipantFbId)
    ? "তুই নিজেই গ্রুপ থেকে লিভ নিলি 😤 আবার আইসিস না! 🚫"
    : "তোমাকে গ্রুপ থেকে লাথি মেরে বের করে দেওয়া হলো 🤣🚪";

  // মূল লিভ মেসেজ টেক্সট
  let msg = (typeof data.customLeave == "undefined")
    ? `━━━━━━━━━━━━━━━━━━━━━
😢 {name} {type}
━━━━━━━━━━━━━━━━━━━━━
ভালো থাকিস... কিন্তু গ্রুপের মজা মিস করবি 😉
✦─────꯭─⃝‌‌☞︎︎︎𝐑𝐀𝐁𝐁𝐢⍟𝐕𝐀𝐈☜︎︎𝐂𝐡𝐚𝐭 𝐁𝐨𝐭────✦`
    : data.customLeave;

  msg = msg
    .replace(/\{name}/g, name)
    .replace(/\{type}/g, type);

  // leaveGif ফোল্ডারে ফাইল চেক করো
  const leaveGifPath = path.join(__dirname, "cache", "leaveGif");
  const allFiles = fs.readdirSync(leaveGifPath).filter(file =>
    [".mp4", ".jpg", ".png", ".jpeg", ".gif", ".mp3"].some(ext => file.endsWith(ext))
  );

  // এলোমেলোভাবে একটা ফাইল সিলেক্ট করো
  const selected = allFiles.length > 0
    ? fs.createReadStream(path.join(leaveGifPath, allFiles[Math.floor(Math.random() * allFiles.length)]))
    : null;

  // ফাইল থাকলে এটাচমেন্টসহ পাঠাও, না থাকলে শুধু টেক্সট
  return api.sendMessage(
    selected ? { body: msg, attachment: selected } : { body: msg },
    threadID
  );
};
