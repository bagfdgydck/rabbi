Const fs = require("fs-extra");
const axios = require("axios");

module.exports.config = {
  name: "antiProtect",
  version: "1.2.0", // ভার্সন আপডেট করা হয়েছে
  hasPermssion: 0,
  credits: "RABBI ISLAM + Kawsar-Chowdhury-Official", // ক্রেডিট আপডেট করা হয়েছে
  description: "Protects group name, photo and nicknames",
  eventType: ["log:thread-name", "log:thread-icon", "log:user-nickname"],
  cooldowns: 3
};

module.exports.run = async function({ api, event, Threads, Users }) {
  try {
    const threadID = event.threadID;
    const senderID = event.senderID; // event.author এর পরিবর্তে event.senderID ব্যবহার করা হয়েছে
    const cacheDir = `${__dirname}/../../cache/antiProtect/`;
    if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });
    
    // --- মডিউল সেটিং লোড করা ---
    const settingsFile = `${cacheDir}settings.json`;
    let settings = {};
    if (fs.existsSync(settingsFile)) {
      try { 
        settings = JSON.parse(fs.readFileSync(settingsFile, 'utf-8')); 
      } catch (e) {
        console.error("Failed to parse settings.json:", e);
      }
    }
    // যদি সেটিংসে প্রোটেকশন বন্ধ থাকে (false), তাহলে রিটার্ন করো
    if (settings[threadID] === false) return; 

    // --- থ্রেড তথ্য লোড করা ---
    const threadInfo = await api.getThreadInfo(threadID);
    const adminIDs = (threadInfo.adminIDs || []).map(u => u.id);
    const botOwners = ["100001039692046"]; // আপনার বট মালিকের আইডি
    const isAdmin = adminIDs.includes(senderID) || botOwners.includes(senderID);
    
    const cacheFile = `${cacheDir}${threadID}.json`;
    let oldData = null;
    let newSnapshot = null;

    // --- ক্যাশে ফাইল চেক করা এবং স্ন্যাপশট তৈরি করা/আপডেট করা ---
    if (fs.existsSync(cacheFile)) {
        try {
            oldData = JSON.parse(fs.readFileSync(cacheFile, 'utf-8'));
        } catch (e) {
            console.error("Failed to parse cache file:", e);
        }
    }

    const currentSnapshot = {
        name: threadInfo.threadName || "Unnamed Group",
        imageSrc: threadInfo.imageSrc || null,
        nicknames: threadInfo.nicknames || {}
    };

    if (!oldData) {
        // যদি ক্যাশে ফাইল না থাকে, তাহলে বর্তমান তথ্য দিয়ে একটি স্ন্যাপশট তৈরি করো
        fs.writeFileSync(cacheFile, JSON.stringify(currentSnapshot, null, 2));
        return;
    }

    if (isAdmin) {
      // যদি পরিবর্তনকারী একজন অ্যাডমিন হয়, তাহলে ক্যাশে আপডেট করো
      fs.writeFileSync(cacheFile, JSON.stringify(currentSnapshot, null, 2));
      return;
    }

    // --- নন-অ্যাডমিন পরিবর্তন করলে সুরক্ষা লজিক ---
    const userName = await Users.getNameUser(senderID).catch(() => "Someone");
    const botID = api.getCurrentUserID();
    const botIsAdmin = adminIDs.includes(botID);

    switch (event.logMessageType) {
      case "log:thread-name": {
        await api.setTitle(oldData.name, threadID).catch((e) => {
             console.error("Error reverting group name:", e);
        });
        return api.sendMessage(`🚫 ${userName} tried to change the group name!\nName reverted → "${oldData.name}" ✅`, threadID);
      }
      
      case "log:thread-icon": {
        if (!botIsAdmin) {
           return api.sendMessage("⚠️ I need to be a group admin to restore the group photo.", threadID);
        }
        try {
          if (oldData.imageSrc) {
            const res = await axios.get(oldData.imageSrc, { responseType: "arraybuffer" });
            const buffer = Buffer.from(res.data, "binary");
            await api.changeGroupImage(buffer, threadID);
          } else {
            // যদি আগে কোনো ছবি না থাকে, তাহলে ছবি সরিয়ে দাও (যদি API সমর্থন করে)
            await api.changeGroupImage(null, threadID).catch(() => {}); 
          }
        } catch (e) {
             console.error("Error reverting group image:", e);
        }
        return api.sendMessage(`🚫 ${userName} tried to change the group photo!\nPrevious photo restored ✅`, threadID);
      }
      
      case "log:user-nickname": {
        const data = event.logMessageData || {};
        // সঠিকভাবে ব্যবহারকারীর ID বের করা (যাকে পরিবর্তন করা হচ্ছে)
        const userID = data.participant_id || data.user_id || data.target_id || (data?.changed && data.changed[0].participant_id) || null;
        
        if (!userID) return;
        
        if (!botIsAdmin) {
          try { await api.sendMessage("⚠️ I need to be a group admin to restore nicknames.", threadID); } catch {}
          return;
        }
        
        // oldData.nicknames[userID] থেকে নিকনেম বের করা
        const oldNick = (oldData.nicknames && oldData.nicknames[userID] !== undefined ? oldData.nicknames[userID] : "") || "";
        
        // কিছুটা বিলম্ব করে নিকনেম পরিবর্তন করা, যাতে API কল সফল হয়
        setTimeout(async () => { 
            try { 
                await api.changeNickname(oldNick, threadID, userID); 
                api.sendMessage(`🚫 ${userName} tried to change a nickname!\nNickname for ${await Users.getNameUser(userID).catch(() => "a user")} has been reverted ✅`, threadID);
            } catch (e) {
                console.error("Error reverting nickname:", e);
            } 
        }, 1000); // বিলম্বের সময় ১০০০ ms করা হয়েছে
        
        return; // মেসেজটি setTimeout এর মধ্যে পাঠানো হচ্ছে, তাই এখানে রিটার্ন করা হলো
      }
      
      default:
        return;
    }
  } catch (error) {
    console.error("AntiProtect Global Error:", error);
    // যদি আপনি চান যে এররটি ব্যবহারকারীকে জানানো হোক, তাহলে নিচের লাইনটি আনকমেন্ট করতে পারেন।
    // try { api.sendMessage(`An internal error occurred in AntiProtect: ${error.message}`, event.threadID); } catch {}
  }
};
