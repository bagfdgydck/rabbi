const MAX_CHANGES = 3; // পরিবর্তনের সর্বোচ্চ সীমা

module.exports = {
    config: {
        name: "autokick", 
        version: "1.0.1", // ভার্সন আপডেট করা হলো
        credits: "Gemini", 
        hasPermssion: 1, 
        commandCategory: "Group",
        usages: "autokick status | autokick reset @ইউজার",
        cooldowns: 5
    },

    // ফাইলটি লোড হওয়ার সময় এই ফাংশনটি চলবে।
    onLoad: function() {
        // যদি ট্র্যাকার অবজেক্টটি ইতিমধ্যে না থাকে, তবে সেটি তৈরি করা।
        // আপনার বট যদি 'global' বা 'global.config' সাপোর্ট না করে, তবুও এটি কাজ করবে।
        if (typeof global.autoKickTracker === 'undefined') {
            global.autoKickTracker = {};
        }
    },

    // ------------------------------------------------
    // Command Function (আগের মতো)
    // ------------------------------------------------
    run: function ({ api, event, args }) {
        // 'global' অবজেক্টটি ফাংশন আর্গুমেন্ট থেকে মুছে ফেলা হয়েছে
        let threadID = event.threadID;
        // ট্র্যাকারটি এখন সরাসরি 'global.autoKickTracker' থেকে অ্যাক্সেস করা হবে
        let tracker = global.autoKickTracker[threadID]; 

        if (args[0]?.toLowerCase() === "status") {
            if (!tracker || Object.keys(tracker).length === 0) {
                return api.sendMessage("এই গ্রুপে এখনো কেউ নাম বা ছবি পরিবর্তন করেনি।", threadID, event.messageID);
            }

            let statusMessage = "👤 **গ্রুপ পরিবর্তন ট্র্যাকার স্ট্যাটাস:**\n";
            for (let userID in tracker) {
                let count = tracker[userID];
                statusMessage += `- ইউজার ID: ${userID} | পরিবর্তন: ${count} বার\n`;
            }
            api.sendMessage(statusMessage, threadID, event.messageID);
            
        } else if (args[0]?.toLowerCase() === "reset") {
             let userIDToReset = Object.keys(event.mentions)[0];

            if (!userIDToReset) {
                 return api.sendMessage("⚠️ রিসেট করতে, আপনাকে অবশ্যই ইউজার-কে ট্যাগ (@) করতে হবে।", threadID, event.messageID);
            }

            if (tracker && tracker[userIDToReset]) {
                delete tracker[userIDToReset];
                api.sendMessage(`✅ ইউজার ${userIDToReset}-এর পরিবর্তনের সংখ্যা সফলভাবে রিসেট করা হয়েছে।`, threadID, event.messageID);
            } else {
                 api.sendMessage("⚠️ এই ইউজার-এর কোনো পরিবর্তনের হিসেব পাওয়া যায়নি।", threadID, event.messageID);
            }

        } else {
            api.sendMessage(
                `ব্যবহার:\n` +
                `1. /autokick status: পরিবর্তনের হিসেব দেখুন।\n` +
                `2. /autokick reset @ইউজার: নির্দিষ্ট ইউজার-এর হিসেব রিসেট করুন।\n` +
                `নোট: তিনবার নাম/ছবি পরিবর্তন করলে স্বয়ংক্রিয়ভাবে ইউজার-কে কিক করা হবে।`, 
                threadID, event.messageID
            );
        }
    },

    // ------------------------------------------------
    // Event Handler (আগের মতো)
    // ------------------------------------------------
    Event: async function ({ api, event }) {
        let threadID = event.threadID;
        let authorID = event.author; 

        if (event.logMessageType === "log:threadName" || event.logMessageType === "log:threadImage") {
            if (authorID === api.getCurrentUserID()) return;

            // ট্র্যাকারটি সরাসরি 'global.autoKickTracker' থেকে অ্যাক্সেস করা হচ্ছে
            if (!global.autoKickTracker[threadID]) {
                global.autoKickTracker[threadID] = {};
            }

            let tracker = global.autoKickTracker[threadID];
            
            // ... (বাকি কিক করার লজিক অপরিবর্তিত) ...
            tracker[authorID] = (tracker[authorID] || 0) + 1;
            let currentCount = tracker[authorID];

            if (currentCount >= MAX_CHANGES) {
                try {
                    let userInfo = await api.getUserInfo(authorID);
                    let userName = userInfo[authorID].name || "এই ইউজার";

                    await api.removeUserFromGroup(authorID, threadID);

                    api.sendMessage(
                        `🚫 কিক অ্যাকশন: ${userName} (${authorID}) গ্রুপের সেটিং পরিবর্তনের সীমা (${MAX_CHANGES} বার) অতিক্রম করেছে। তাই তাকে রিমুভ করা হলো।`, 
                        threadID
                    );

                    delete tracker[authorID];

                } catch (e) {
                    api.sendMessage(
                        `❌ কিক ব্যর্থ: ${authorID} সীমা অতিক্রম করেছে, কিন্তু বট তাকে রিমুভ করতে ব্যর্থ হয়েছে। (সম্ভবত বটের অ্যাডমিন পারমিশন নেই)`, 
                        threadID
                    );
                    console.error("AutoKick Failed:", e);
                }
            } else {
                let remaining = MAX_CHANGES - currentCount;
                api.sendMessage(
                    `⚠️ সতর্কতা: আপনি ${currentCount} বার গ্রুপের সেটিং পরিবর্তন করেছেন। আর ${remaining} বার পরিবর্তন করলে আপনাকে গ্রুপ থেকে রিমুভ করা হবে।`, 
                    threadID
                );
            }
        }
    }
};
