const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "leave_add", // মডিউলের নাম পরিবর্তন করা হলো
  eventType: ["log:unsubscribe", "log:subscribe"], // এখন অ্যাড ও লিভ দুটো ইভেন্টই ধরবে
  version: "4.0.0", // ভার্সন আপডেট করা হলো
  credits: "𝐑𝐀𝐁𝐁i⍟𝐕𝐀i | Modified by Akash",
  description: "Add/Leave/Kick message system with gif/video/image"
};

module.exports.onLoad = function () {
  const folders = [
    path.join(__dirname, "cache", "leaveGif"),
    path.join(__dirname, "cache", "kickGif"),
    path.join(__dirname, "cache", "addGif") // ✅ নতুন GIF ফোল্ডার যোগ করা হলো
  ];
  for (const folder of folders) {
    if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });
  }
};

module.exports.run = async function ({ api, event, Users, Threads }) {
  try {
    const { threadID } = event;

    // --- মেম্বার অ্যাড হলে (Welcome) ---
    if (event.logMessageType == "log:subscribe") {
      const addedIDs = event.logMessageData.addedParticipants;
      const threadData = global.data.threadData.get(parseInt(threadID)) || (await Threads.getData(threadID)).data;

      // বটের নিজের জয়েন করা ইভেন্ট ইগনোর করবে
      if (addedIDs.some(i => i.userFbId == api.getCurrentUserID())) return;

      const addedNames = [];
      for (const participant of addedIDs) {
        const userName = global.data.userName.get(participant.userFbId) || await Users.getNameUser(participant.userFbId);
        addedNames.push(userName);
      }
      
      const namesString = addedNames.join(", ");
      
      // ডিফল্ট Welcome মেসেজ
      let msg = (typeof threadData.customWelcome == "undefined")
        ? `━━━━━━━━━━━━━━━━━━━━━
🎉 স্বাগতম, {name}!
━━━━━━━━━━━━━━━━━━━━━
গ্রুপে জয়েন করার জন্য ধন্যবাদ। নিয়ম মেনে চলো, মজা করো!
✦─────꯭─⃝‌‌☞︎︎︎𝐑𝐀𝐁𝐁i⍟𝐕𝐀i☜︎︎𝐂𝐡𝐚𝐭 𝐁𝐨𝐭────✦`
        : threadData.customWelcome;

      msg = msg.replace(/\{name}/g, namesString);

      const addPath = path.join(__dirname, "cache", "addGif");
      const fileList = fs.readdirSync(addPath).filter(file =>
        [".mp4", ".gif", ".jpg", ".png", ".jpeg", ".mp3"].some(ext => file.endsWith(ext))
      );
      
      // র‍্যান্ডম ফাইল বেছে নেওয়া হলো
      const selectedFile = fileList.length > 0
        ? path.join(addPath, fileList[Math.floor(Math.random() * fileList.length)])
        : null;

      let attachment = null;
      if (selectedFile && fs.existsSync(selectedFile)) {
        attachment = fs.createReadStream(selectedFile);
      }

      return api.sendMessage(
        attachment ? { body: msg, attachment } : { body: msg },
        threadID
      );
    }

    // --- মেম্বার চলে গেলে বা কিক হলে (Leave/Kick) ---
    else if (event.logMessageType == "log:unsubscribe") {
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
✦─────꯭─⃝‌‌☞︎︎︎𝐑𝐀𝐁𝐁i⍟𝐕𝐀i☜︎︎𝐂𝐡𝐚𝐭 𝐁𝐨𝐭────✦`
        : threadData.customLeave;

      msg = msg.replace(/\{name}/g, userName).replace(/\{type}/g, typeText);

      // ফাইল পাথ চেক (ভিডিও/জিআইএফ/ইমেজ সব সাপোর্ট)
      const leavePath = path.join(__dirname, "cache", "leaveGif");
      const kickPath = path.join(__dirname, "cache", "kickGif");

      // লিভ নাকি কিক অনুযায়ী ফাইল বেছে নাও
      const folderPath = isLeave ? leavePath : kickPath;
      const fileList = fs.readdirSync(folderPath).filter(file =>
        [".mp4", ".gif", ".jpg", ".png", ".jpeg", ".mp3"].some(ext => file.endsWith(ext))
      );

      // র‍্যান্ডম ফাইল বেছে নেওয়া হলো (আপনার আগের রিকোয়েস্ট অনুযায়ী)
      const selectedFile = fileList.length > 0
        ? path.join(folderPath, fileList[Math.floor(Math.random() * fileList.length)])
        : null;

      let attachment = null;
      if (selectedFile && fs.existsSync(selectedFile)) {
        attachment = fs.createReadStream(selectedFile);
      }

      return api.sendMessage(
        attachment ? { body: msg, attachment } : { body: msg },
        threadID
      );
    }

  } catch (err) {
    console.error("❌ Event Error:", err);
  }
};
