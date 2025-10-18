const fs = require("fs-extra");
const axios = require("axios");

module.exports.config = {
  name: "antiProtect",
  version: "1.2.3",
  hasPermssion: 0,
  credits: "SAIFUL ISLAM + Kawsar-Chowdhury-Official", 
  description: "Protects nicknames and group name by reverting unauthorized changes.",
  eventType: ["log:user-nickname", "log:thread-name"], 
  cooldowns: 3
};

module.exports.run = async function({ api, event, Threads, Users }) {
  try {
    const threadID = event.threadID;
    const senderID = event.senderID; 
    const cacheDir = `${__dirname}/../../cache/antiProtect/`;
    if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });
    
    // --- Load Module Settings ---
    const settingsFile = `${cacheDir}settings.json`;
    let settings = {};
    if (fs.existsSync(settingsFile)) {
      try { settings = JSON.parse(fs.readFileSync(settingsFile, 'utf-8')); } catch {}
    }
    // Return if protection is explicitly disabled
    if (settings[threadID] === false) return; 

    // --- Load Thread Info ---
    const threadInfo = await api.getThreadInfo(threadID);
    const adminIDs = (threadInfo.adminIDs || []).map(u => u.id);
    const botOwners = ["100001039692046"]; // Your Bot Owner ID(s)
    const isAdmin = adminIDs.includes(senderID) || botOwners.includes(senderID);
    
    const cacheFile = `${cacheDir}${threadID}.json`;
    let oldData = null;

    // Check and Load Cache File
    if (fs.existsSync(cacheFile)) {
        try {
            oldData = JSON.parse(fs.readFileSync(cacheFile, 'utf-8'));
        } catch (e) {
            console.error("Failed to parse cache file:", e);
        }
    }
    
    // Create current data snapshot
    const currentSnapshot = {
        name: threadInfo.threadName || "Unnamed Group",
        imageSrc: threadInfo.imageSrc || null,
        nicknames: threadInfo.nicknames || {}
    };

    if (!oldData) {
        // Create and save new snapshot if cache file doesn't exist
        fs.writeFileSync(cacheFile, JSON.stringify(currentSnapshot, null, 2));
        return;
    }

    if (isAdmin) {
      // If the changer is an admin, update the cache and exit.
      fs.writeFileSync(cacheFile, JSON.stringify(currentSnapshot, null, 2));
      return;
    }

    // --- Protection Logic for Non-Admins ---
    const userName = await Users.getNameUser(senderID).catch(() => "Someone");
    const botID = api.getCurrentUserID();
    const botIsAdmin = adminIDs.includes(botID);

    if (!botIsAdmin) {
      // Return early if the bot is not an admin, as no protection can be enforced.
      return;
    }

    switch (event.logMessageType) {
      
      case "log:thread-name": {
          const newName = event.logMessageData.name || null;
          const oldName = oldData.name;

          if (newName && newName !== oldName) {
              setTimeout(async () => {
                  try {
                      await api.setThreadName(oldName, threadID);
                      // Update cache to reflect the reverted name
                      fs.writeFileSync(cacheFile, JSON.stringify({...currentSnapshot, name: oldName}, null, 2));
                      api.sendMessage(`🚫 ${userName} tried to change the group name!\nName reverted to: ${oldName} ✅`, threadID);
                  } catch (e) {
                      console.error("Error reverting thread name:", e);
                      api.sendMessage(`⚠️ Failed to revert group name to "${oldName}"! Check bot's admin permission.`, threadID);
                  }
              }, 1000);
          }
          return;
      }
      
      case "log:user-nickname": {
        const data = event.logMessageData || {};
        const userID = data.participant_id || data.user_id || data.target_id || (data?.changed && data.changed[0]?.participant_id) || null;
        
        if (!userID) return;
        
        const oldNick = (oldData.nicknames && oldData.nicknames[userID] !== undefined ? oldData.nicknames[userID] : "") || "";
        
        // Change nickname after a short delay
        setTimeout(async () => { 
            try { 
                await api.changeNickname(oldNick, threadID, userID); 
                // Update cache to reflect the reverted nickname
                const newNicknames = {...currentSnapshot.nicknames, [userID]: oldNick};
                fs.writeFileSync(cacheFile, JSON.stringify({...currentSnapshot, nicknames: newNicknames}, null, 2));
                
                api.sendMessage(`🚫 ${userName} tried to change a nickname!\nNickname for ${await Users.getNameUser(userID).catch(() => "a user")} has been reverted ✅`, threadID);
            } catch (e) {
                console.error("Error reverting nickname:", e);
                api.sendMessage(`⚠️ Failed to revert nickname for user ID ${userID}! Check bot's admin permission.`, threadID);
            } 
        }, 1000); 
        
        return; 
      }
      
      default:
        return;
    }
  } catch (error) {
    console.error("AntiProtect Global Error:", error);
  }
};
