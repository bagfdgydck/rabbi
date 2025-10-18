const MAX_CHANGES = 3; // পরিবর্তনের সর্বোচ্চ সীমা

// প্রতিটি গ্রুপের জন্য এবং প্রতিটি ইউজার-এর জন্য পরিবর্তনের সংখ্যা সেভ করার জন্য একটি গ্লোবাল অবজেক্ট
global.config.GROUP_CHANGE_TRACKER = global.config.GROUP_CHANGE_TRACKER || {};

module.exports = {
    config: {
        name: "autokick", // কমান্ডের নাম
        version: "1.0.0",
        credits: "Gemini", // ফাইলটি আমার তৈরি করা
        hasPermssion: 1, // শুধুমাত্র গ্রুপ অ্যাডমিন বা বট অ্যাডমিন ব্যবহার করতে পারবে
        commandCategory: "Group",
        usages: "autokick status | autokick reset @ইউজার",
        cooldowns: 5
    },

    // ------------------------------------------------
    // Command Function (স্ট্যাটাস দেখা ও রিসেট করার জন্য)
    // ------------------------------------------------
    run: function ({ api, event, args, global }) {
        let threadID = event.threadID;
        let tracker = global.config.GROUP_CHANGE_TRACKER[threadID];

        if (args[0]?.toLowerCase() === "status") {
            if (!tracker || Object.keys(tracker).length === 0) {
                return api.sendMessage("এই গ্রুপে এখনো কেউ নাম বা ছবি পরিবর্তন করেনি।", threadID, event.messageID);
            }

            let statusMessage = "👤 **গ্রুপ পরিবর্তন ট্র্যাকার স্ট্যাটাস:**\n";
            for (let userID in tracker) {
                let count = tracker[userID];
                // ইউজার-এর নাম পেতে api.getUserInfo ব্যবহার করা যেতে পারে, কিন্তু এখানে সহজ রাখতে ID দেখাচ্ছি
                statusMessage += `- ইউজার ID: ${userID} | পরিবর্তন: ${count} বার\n`;
            }
            api.sendMessage(statusMessage, threadID, event.messageID);
            
        } else if (args[0]?.toLowerCase() === "reset") {
             // ট্যাগ করা ইউজার-এর ID বের করা (যদি বট ফ্রেমওয়ার্ক এটি সাপোর্ট করে)
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
    // Event Handler (মূল লজিক)
    // ------------------------------------------------
    Event: async function ({ api, event, global }) {
        let threadID = event.threadID;
        let authorID = event.author; // পরিবর্তনকারী ইউজার-এর ID

        // শুধুমাত্র নাম বা ছবি পরিবর্তনের ইভেন্টগুলো চেক করা হবে
        if (event.logMessageType === "log:threadName" || event.logMessageType === "log:threadImage") {
            // যদি bot নিজেই পরিবর্তন করে, তবে হিসেব রাখা হবে না
            if (authorID === api.getCurrentUserID()) return;

            // যদি এই গ্রুপের জন্য ট্র্যাকার অবজেক্ট তৈরি না হয়ে থাকে, তবে তৈরি করা
            if (!global.config.GROUP_CHANGE_TRACKER[threadID]) {
                global.config.GROUP_CHANGE_TRACKER[threadID] = {};
            }

            let tracker = global.config.GROUP_CHANGE_TRACKER[threadID];
            
            // ইউজার-এর কাউন্ট বৃদ্ধি করা
            tracker[authorID] = (tracker[authorID] || 0) + 1;
            let currentCount = tracker[authorID];

            // ⚠️ কিক করার শর্ত পরীক্ষা করা
            if (currentCount >= MAX_CHANGES) {
                try {
                    // ইউজার-এর তথ্য (নাম) পাওয়ার চেষ্টা
                    let userInfo = await api.getUserInfo(authorID);
                    let userName = userInfo[authorID].name || "এই ইউজার";

                    // ইউজার-কে গ্রুপ থেকে বের করে দেওয়া
                    await api.removeUserFromGroup(authorID, threadID);

                    // গ্রুপে বার্তা পাঠানো
                    api.sendMessage(
                        `🚫 কিক অ্যাকশন: ${userName} (${authorID}) গ্রুপে নাম/ছবি পরিবর্তনের সীমা (${MAX_CHANGES} বার) অতিক্রম করেছে। তাই তাকে গ্রুপ থেকে রিমুভ করা হলো।`, 
                        threadID
                    );

                    // সফলভাবে বের করে দেওয়ার পর ইউজার-এর কাউন্ট রিসেট করা
                    delete tracker[authorID];

                } catch (e) {
                    // কিক করতে ব্যর্থ হলে (যেমন বট অ্যাডমিন না হলে)
                    api.sendMessage(
                        `❌ কিক ব্যর্থ: ${authorID} সীমা অতিক্রম করেছে, কিন্তু বট তাকে রিমুভ করতে ব্যর্থ হয়েছে। (সম্ভবত বটের অ্যাডমিন পারমিশন নেই) - ত্রুটি: ${e.message}`, 
                        threadID
                    );
                    console.error("AutoKick Failed:", e);
                }
            } else {
                // সীমা না ছাড়ালে শুধুমাত্র সতর্ক বার্তা
                let remaining = MAX_CHANGES - currentCount;
                api.sendMessage(
                    `⚠️ সতর্কতা: আপনি ${currentCount} বার গ্রুপের সেটিং পরিবর্তন করেছেন। আর ${remaining} বার পরিবর্তন করলে আপনাকে গ্রুপ থেকে রিমুভ করা হবে।`, 
                    threadID
                );
            }
        }
    }
};
