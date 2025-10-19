// এই অংশটি শুধু একটি উদাহরণ। এটি আপনার বট ফ্রেমওয়ার্ক অনুযায়ী পরিবর্তন করতে হবে।
const fs = require("fs");
const axios = require("axios");

// স্থায়ীভাবে ধরে রাখা আসল ছবির URL, যা একবার সেট হবে
let original_image_url = "আপনার_আসল_ছবির_URL"; // এটি একবার ম্যানুয়ালি সেট করতে হবে

module.exports.config = {
	name: "revert_pp",
	eventType: ["change_image"], // ছবির পরিবর্তনের ইভেন্টকে ধরে
	version: "1.0.0",
	credits: "Modified by Gemini",
	description: "Automatically reverts the group image to the original one.",
	cooldowns: 5
};

module.exports.run = async ({ api, event }) => {
    // শুধুমাত্র যখন গ্রুপের ইমেজ পরিবর্তন হবে (eventType: "change_image")
    if (event.type === "change_image") {
        
        // এখানে চেক করা যেতে পারে যে পরিবর্তনকারী এডমিন কি না। 
        // যদি পরিবর্তনকারী এডমিন হন, তাহলে নতুন ছবিটিকেই আসল ছবি হিসাবে সেভ করা উচিত।
        // কিন্তু সেই চেক করার ফাংশনালিটি এই উদাহরণের কোডে দেওয়া নেই।
        
        if (!original_image_url) {
            // যদি আসল URL সেভ করা না থাকে, তবে বটের পক্ষে তা ফিরিয়ে আনা অসম্ভব
            return console.log("Original image URL not set. Cannot revert.");
        }

        const threadID = event.threadID;
        const revert_image_url = original_image_url; 
        let pathImg = __dirname + `/cache/revert_pp_${threadID}.png`;

        try {
            // ১. আসল ছবিটি ডাউনলোড করা
            let getdata = (await axios.get(revert_image_url, { responseType: 'arraybuffer' })).data;
            fs.writeFileSync(pathImg, Buffer.from(getdata, 'utf-8'));

            // ২. ছবিটি দিয়ে গ্রুপ পিপি পরিবর্তন করে দেওয়া
            api.sendMessage("❌ গ্রুপ প্রোফাইল পিকচার পরিবর্তন করা হয়েছে! এডমিন ছাড়া পরিবর্তন করার অনুমতি নেই। আসল পিপি ফিরিয়ে আনা হচ্ছে...", threadID);
            
            api.changeGroupImage(fs.createReadStream(pathImg), threadID, (err) => {
                fs.unlinkSync(pathImg); // টেম্পোরারি ফাইল ডিলিট
                if (err) return api.sendMessage(`❌ ত্রুটি: পিপি ফিরিয়ে আনা সম্ভব হয়নি।\n${err}`, threadID);
            });
            
        } catch (e) {
            console.error("Error reverting group image:", e);
            api.sendMessage("❌ পিপি ফিরিয়ে আনার সময় একটি ত্রুটি হয়েছে।", threadID);
        }
    }
};
