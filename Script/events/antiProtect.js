const fs = require("fs-extra");
const axios = require("axios");

module.exports.config = {
  name: "antiProtect",
  version: "1.2.0",
  hasPermssion: 0,
  credits: "Saiful Islam (Fixed by GPT)",
  description: "Protects group name, photo and nicknames",
  eventType: ["log:thread-name", "log:thread-icon", "log:user-nickname"],
  cooldowns: 3
};

module.exports.run = async function({ api, event, Threads, Users }) {
  try {
    const threadID = event.threadID;
    const senderID = event.author || event.senderID;
    const cacheDir = `${__dirname}/../../cache/antiProtect/`;
    if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });

    const settingsFile = `${cacheDir}settings.json`;
    let settings = {};
    if (fs.existsSync(settingsFile)) {
      try { settings = JSON.parse(fs.readFileSync(settingsFile)); } catch {}
    }
    if (settings[threadID] === false) return;

    const threadInfo = await api.getThreadInfo(threadID);
    const adminIDs = (threadInfo.adminIDs || []).map(u => u.id);
    const botOwners = ["61564002689411"]; // নিজের আইডি
    const isAdmin = adminIDs.includes(senderID) || botOwners.includes(senderID);

    const cacheFile = `${cacheDir}${threadID}.json`;
    if (!fs.existsSync(cacheFile)) {
      const snapshot = {
        name: threadInfo.threadName || "Unnamed Group",
        imageSrc: threadInfo.imageSrc || null,
        nicknames: threadInfo.nicknames || {}
      };
      fs.writeFileSync(cacheFile, JSON.stringify(snapshot, null, 2));
      return;
    }

    // যদি অ্যাডমিন কেউ পরিবর্তন করে তাহলে snapshot আপডেট হবে
    if (isAdmin) {
      const newSnapshot = {
        name: threadInfo.threadName,
        imageSrc: threadInfo.imageSrc,
        nicknames: threadInfo.nicknames || {}
      };
      fs.writeFileSync(cacheFile, JSON.stringify(newSnapshot, null, 2));
      return;
    }

    const oldData = JSON.parse(fs.readFileSync(cacheFile));
    const userName = await Users.getNameUser(senderID).catch(() => "Someone");
    const botID = api.getCurrentUserID();
    const botIsAdmin = adminIDs.includes(botID);

    switch (event.logMessageType) {
      case "log:thread-name": {
        // নাম revert
        await api.setTitle(oldData.name, threadID).catch(() => {});
        return api.sendMessage(
          `🚫 ${userName} গ্রুপের নাম পরিবর্তন করতে চেয়েছিল!\n🔁 আগের নাম ফিরিয়ে আনা হলো: "${oldData.name}" ✅`,
          threadID
        );
      }

      case "log:thread-icon": {
        // ছবি revert
        if (!botIsAdmin) return;
        try {
          if (oldData.imageSrc) {
            const res = await axios.get(oldData.imageSrc, { responseType: "arraybuffer" });
            const buffer = Buffer.from(res.data, "binary");
            await api.changeGroupImage(buffer, threadID);
          } else {
            // যদি আগের ছবি না থাকে তাহলে কিছু না করলেই ভালো
          }
        } catch (err) {
          console.log("Image revert error:", err);
        }
        return api.sendMessage(
          `🚫 ${userName} গ্রুপের ছবি পরিবর্তন করতে চেয়েছিল!\n🖼️ আগের ছবি ফিরিয়ে আনা হলো ✅`,
          threadID
        );
      }

      case "log:user-nickname": {
        const data = event.logMessageData || {};
        const userID = data.participant_id || data.user_id || data.target_id;
        if (!userID) return;
        if (!botIsAdmin) {
          return api.sendMessage("⚠️ আমি অ্যাডমিন না হওয়ায় nickname ফেরত দিতে পারছি না।", threadID);
        }
        const oldNick = (oldData.nicknames && oldData.nicknames[userID] !== undefined) ? oldData.nicknames[userID] : "";
        setTimeout(async () => {
          try {
            await api.changeNickname(oldNick, threadID, userID);
          } catch (e) {
            console.log("Nickname revert error:", e);
          }
        }, 800);
        return api.sendMessage(
          `🚫 ${userName} একটি nickname পরিবর্তন করেছিল!\n🔁 আগের nickname ফিরিয়ে আনা হলো ✅`,
          threadID
        );
      }

      default:
        return;
    }

  } catch (error) {
    console.log("AntiProtect Error:", error);
  }
};
