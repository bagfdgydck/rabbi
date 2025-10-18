const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "antiout",
  eventType: ["log:unsubscribe"],
  version: "3.6.0",
  credits: "𝐑𝐀𝐁𝐁𝐢⍟𝐕𝐀𝐈 | Modified by 𝐀𝐤𝐚𝐬𝐡",
  description: "Antiout with username (no weird string) and gif/video support"
};

module.exports.run = async ({ event, api, Threads, Users }) => {
  try {
    const { threadID, logMessageData, author } = event;
    const data = (await Threads.getData(threadID)).data || {};

    if (data.antiout === false) return;

    const leftUser = logMessageData.leftParticipantFbId;
    if (leftUser == api.getCurrentUserID()) return;

    // ইউজারের নাম নেওয়া
    const name =
      global.data.userName.get(leftUser) ||
      (await Users.getNameUser(leftUser));

    const type = author == leftUser ? "self-separation" : "kick";

    if (type === "self-separation") {
      api.addUserToGroup(leftUser, threadID, async (error) => {
        if (error) {
          api.sendMessage(
            `😢 দুঃখিত বস, ${name} কে আবার এড করতে পারলাম না।
সম্ভবত সে বটকে ব্লক করেছে অথবা তার প্রাইভেসি সেটিংসের কারণে এড করা যাচ্ছে না।
\n──────꯭─⃝‌‌☞︎︎︎𝐑𝐀𝐁𝐁𝐢⍟𝐕𝐀𝐈☜︎︎──────`,
            threadID
          );
        } else {
          const gifPathMp4 = path.join(__dirname, "cache", "antioutGif", "antiout.mp4");
          const gifPathGif = path.join(__dirname, "cache", "antioutGif", "antiout.gif");

          // অদ্ভুত স্ট্রিং ছাড়া মেসেজ (নাম সন্নিবেশিত)
          const msg = {
            body: `এই সালা গুরপ থেকে পালিয়ে গিয়ে ছিলো তাই ওরে মারতে মারতে ধরে নিয়া আসলাম 🥱
শোন, ${name}
এই গ্রুপ হইলো গ্যাং!
এখান থেকে যাইতে হলে এডমিনের পারমিশন লাগে!`,
          };

          if (fs.existsSync(gifPathMp4)) {
            msg.attachment = fs.createReadStream(gifPathMp4);
          } else if (fs.existsSync(gifPathGif)) {
            msg.attachment = fs.createReadStream(gifPathGif);
          }

          api.sendMessage(msg, threadID);
        }
      });
    }
  } catch (err) {
    console.error(err);
  }
};
