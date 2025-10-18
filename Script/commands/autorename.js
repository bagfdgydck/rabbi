module.exports = {
    config: {
        name: "autorename", // কমান্ডের নাম
        version: "1.0.0",
        credits: "Gemini", // ফাইলটি আমার তৈরি করা
        hasPermssion: 0,
        commandCategory: "Group",
        usages: "On/Off",
        cooldowns: 5
    },

    // ------------------------------------------------
    // Configuration Setup
    // ------------------------------------------------
    // এই মডিউলটি শুধুমাত্র ইভেন্টের উপর কাজ করবে, কোনো কমান্ডের প্রয়োজন নেই
    onLoad: function() {
        // প্রতিটি গ্রুপের জন্য ডিফল্ট নাম এখানে সেট করুন 
        // আপনি চাইলে এটি খালি রাখতে পারেন বা একটি নাম দিতে পারেন। 
        // যদি এটি খালি থাকে, তবে bot এটি প্রথমবার পরিবর্তন হওয়ার পর নিজেই একটি নাম সেট করে নেবে।
        global.config.GROUP_DEFAULT_NAME = global.config.GROUP_DEFAULT_NAME || {};
    },

    // ------------------------------------------------
    // Command Function (To set the default name and turn on/off)
    // ------------------------------------------------
    run: function ({ api, event, args, global }) {
        if (args.length === 0 || args[0].toLowerCase() === "help") {
            return api.sendMessage(
                "এই কমান্ডের ব্যবহার:\n" +
                "1. `autorename set <Default Name>`: এই গ্রুপে স্বয়ংক্রিয়ভাবে ফিরিয়ে আনার জন্য একটি ডিফল্ট নাম সেট করুন।\n" +
                "2. `autorename off`: এই গ্রুপে অটো-রিনেম বন্ধ করুন।\n" +
                "3. `autorename show`: বর্তমান ডিফল্ট নাম দেখুন।", 
                event.threadID, event.messageID
            );
        }

        let threadID = event.threadID;

        if (args[0].toLowerCase() === "set") {
            let newName = args.slice(1).join(" ").trim();
            if (!newName) {
                return api.sendMessage("⚠️ দয়া করে একটি ডিফল্ট নাম দিন।", threadID, event.messageID);
            }
            
            global.config.GROUP_DEFAULT_NAME[threadID] = newName;
            api.sendMessage(`✅ এই গ্রুপের ডিফল্ট নাম সেট করা হয়েছে: "${newName}"। এখন কেউ নাম পাল্টালে এটি স্বয়ংক্রিয়ভাবে এই নামে ফিরে যাবে।`, threadID, event.messageID);
        
        } else if (args[0].toLowerCase() === "off") {
            if (global.config.GROUP_DEFAULT_NAME[threadID]) {
                delete global.config.GROUP_DEFAULT_NAME[threadID];
                api.sendMessage("❌ এই গ্রুপে অটো-রিনেম বন্ধ করা হয়েছে।", threadID, event.messageID);
            } else {
                 api.sendMessage("⚠️ এই গ্রুপে অটো-রিনেম আগেই বন্ধ ছিল।", threadID, event.messageID);
            }
        
        } else if (args[0].toLowerCase() === "show") {
            let currentName = global.config.GROUP_DEFAULT_NAME[threadID] || "সেট করা হয়নি।";
            api.sendMessage(`এই গ্রুপের বর্তমান ডিফল্ট নাম: "${currentName}"।`, threadID, event.messageID);
        }
    },

    // ------------------------------------------------
    // Event Handler (The core logic)
    // ------------------------------------------------
    Event: async function ({ api, event, global }) {
        // শুধুমাত্র যখন গ্রুপের নাম পরিবর্তিত হয় তখন কাজ করবে
        if (event.logMessageType === "log:threadName") {
            let threadID = event.threadID;
            let currentName = event.logMessageData.name;
            let defaultName = global.config.GROUP_DEFAULT_NAME[threadID];
            
            // যদি ডিফল্ট নাম সেট করা না থাকে
            if (!defaultName) {
                // যদি এটি প্রথমবার পরিবর্তন হয়, তাহলে এটিকে ডিফল্ট নাম হিসেবে সেট করুন
                global.config.GROUP_DEFAULT_NAME[threadID] = currentName;
                api.sendMessage(`🤖 গ্রুপের নাম প্রথমবার পরিবর্তন হয়েছে। এখন থেকে ডিফল্ট নাম হিসেবে "${currentName}" সেট করা হলো।`, threadID);
                return; 
            }

            // যদি বর্তমান নাম ডিফল্ট নামের সাথে না মেলে, তাহলে স্বয়ংক্রিয়ভাবে পরিবর্তন করে দেবে
            if (currentName !== defaultName) {
                try {
                    // 1 সেকেন্ড অপেক্ষা করে বট গ্রুপের নাম পরিবর্তন করে দেবে
                    await new Promise(resolve => setTimeout(resolve, 1000)); 
                    await api.changeThreadName(defaultName, threadID);
                    
                    api.sendMessage(
                        `⚠️ ${event.logMessageData.newName} গ্রুপটির নাম পরিবর্তন করেছিলো। স্বয়ংক্রিয়ভাবে নাম "${defaultName}"-এ ফিরিয়ে আনা হলো।`, 
                        threadID
                    );
                } catch (e) {
                    console.error("Autorename Failed:", e);
                    api.sendMessage(`❌ অটো-রিনেম ব্যর্থ হয়েছে। ত্রুটি: ${e.message}`, threadID);
                }
            }
        }
    }
};
