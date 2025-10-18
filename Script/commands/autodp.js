const axios = require("axios");

// এই ভেরিয়েবলে আপনার ডিফল্ট ছবির ফাইল ID বা ছবির URL সেভ হবে
// এটি অবশ্যই একটি স্থায়ী (permanent) ছবি হতে হবে যা বট ইতিমধ্যেই একবার আপলোড করেছে বা অ্যাক্সেস করতে পারে।
global.config.GROUP_DEFAULT_DP = global.config.GROUP_DEFAULT_DP || {};

module.exports = {
    config: {
        name: "autodp", // কমান্ডের নাম
        version: "1.0.0",
        credits: "Gemini", // ফাইলটি আমার তৈরি করা
        hasPermssion: 0,
        commandCategory: "Group",
        usages: "autodp set <ছবি রিপ্লাই/লিংক> | autodp off",
        cooldowns: 5
    },

    // ------------------------------------------------
    // Command Function (To set the default DP ID)
    // ------------------------------------------------
    run: async function ({ api, event, args, global }) {
        let threadID = event.threadID;

        if (args[0]?.toLowerCase() === "set") {
            let defaultPicID = null;

            // 1. যদি কোনো মেসেজের রিপ্লাই দেওয়া হয় এবং তাতে ছবি থাকে (File ID পাওয়ার জন্য)
            if (event.messageReply && event.messageReply.attachments && event.messageReply.attachments.length > 0 && event.messageReply.attachments[0].type === "photo") {
                defaultPicID = event.messageReply.attachments[0].ID;
            } 
            // 2. যদি সরাসরি ছবির URL দেওয়া হয়
            else if (args[1]?.startsWith("http")) {
                 // এক্ষেত্রে আপনাকে URL থেকে ছবি ডাউনলোড করে File Stream তৈরি করতে হবে, 
                 // যা তুলনামূলকভাবে জটিল। তাই এই উদাহরণে আমরা শুধু ID বা রিপ্লাই ব্যবহার করবো।
                 return api.sendMessage("⚠️ URL ব্যবহার না করে ডিফল্ট ছবিটিতে রিপ্লাই করুন অথবা ছবির File ID দিন।", threadID, event.messageID);

            } else if (args[1]) {
                 // 3. যদি সরাসরি File ID দেওয়া হয়
                 defaultPicID = args[1];
            }

            if (!defaultPicID) {
                return api.sendMessage("⚠️ ডিফল্ট গ্রুপ পিকচার সেট করতে, আপনি যেই ছবিটি ডিফল্ট রাখতে চান সেটি রিপ্লাই করে `/autodp set` কমান্ড দিন।", threadID, event.messageID);
            }
            
            global.config.GROUP_DEFAULT_DP[threadID] = defaultPicID;
            api.sendMessage(`✅ ডিফল্ট গ্রুপ পিকচার সফলভাবে সেট করা হয়েছে। এখন কেউ পিকচার পাল্টালে এটি স্বয়ংক্রিয়ভাবে এই ছবিতে ফিরে যাবে।`, threadID, event.messageID);
        
        } else if (args[0]?.toLowerCase() === "off") {
            if (global.config.GROUP_DEFAULT_DP[threadID]) {
                delete global.config.GROUP_DEFAULT_DP[threadID];
                api.sendMessage("❌ এই গ্রুপে অটো-ডিপি রিস্টোর বন্ধ করা হয়েছে।", threadID, event.messageID);
            } else {
                 api.sendMessage("⚠️ এই গ্রুপে অটো-ডিপি রিস্টোর আগেই বন্ধ ছিল।", threadID, event.messageID);
            }
        
        } else {
            return api.sendMessage(
                "এই কমান্ডের ব্যবহার:\n" +
                "1. `autodp set` (ডিফল্ট ছবি রিপ্লাই করে): গ্রুপের ডিফল্ট ছবি সেট করুন।\n" +
                "2. `autodp off`: অটো-ডিপি রিস্টোর বন্ধ করুন।", 
                threadID, event.messageID
            );
        }
    },

    // ------------------------------------------------
    // Event Handler (The core logic)
    // ------------------------------------------------
    Event: async function ({ api, event, global }) {
        // শুধুমাত্র যখন গ্রুপের পিকচার পরিবর্তিত হয় তখন কাজ করবে
        if (event.logMessageType === "log:threadImage") {
            let threadID = event.threadID;
            let defaultPicID = global.config.GROUP_DEFAULT_DP[threadID];
            
            // যদি ডিফল্ট ছবি সেট করা না থাকে, তাহলে কিছু হবে না।
            if (!defaultPicID) {
                return; 
            }

            // যদি পিকচার পরিবর্তন হয়
            if (event.logMessageData.newImageID !== defaultPicID) {
                try {
                    // 1 সেকেন্ড অপেক্ষা করে বট গ্রুপের ছবি পরিবর্তন করে দেবে
                    await new Promise(resolve => setTimeout(resolve, 1000)); 
                    
                    // মেসেঞ্জারে ছবির ID ব্যবহার করে ছবি আপলোড করা
                    await api.changeGroupImage(defaultPicID, threadID);
                    
                    api.sendMessage(
                        `⚠️ ${event.logMessageData.author} গ্রুপের ছবি পরিবর্তন করেছিলো। স্বয়ংক্রিয়ভাবে ডিফল্ট ছবিতে ফিরিয়ে আনা হলো।`, 
                        threadID
                    );
                } catch (e) {
                    console.error("AutoDP Revert Failed:", e);
                    api.sendMessage(`❌ অটো-ডিপি রিস্টোর ব্যর্থ হয়েছে। ত্রুটি: ${e.message}`, threadID);
                }
            }
        }
    }
};
