const schedule = require('node-schedule');
const chalk = require('chalk');
const moment = require('moment-timezone');

module.exports.config = {
    name: 'autosent',
    version: '11.1.0',
    hasPermssion: 0,
    credits: 'Mohammad Akash',
    description: 'Automatically sends fun & entertaining styled messages (BD Time)',
    commandCategory: 'group messenger',
    usages: '[]',
    cooldowns: 3
};

// মেসেজ লিস্ট (ঘন্টা অনুযায়ী)
const messages = [
    '🌙 এত রাত কিসের জন্য জাগছিস? 😴✨',
    '⏰ Mobile বন্ধ করে ঘুমো 😏🛌',
    '😵‍💫 এত সাহস দেখানোর সময় নয়, বিশ্রাম নাও 😴',
    '🛌 সবাই ঘুমাচ্ছে, আর তুই জাগছিস? 😼',
    '🌅 উঠে fresh হও, কিছু light exercise করো 🌸💪',
    '🕌 নামাজ বা একটু stretch করে নাও 🙏✨',
    '☀️ Rise and shine! দিনটা সুন্দর শুরু কর 💪😎',
    '🪥 দাঁত ব্রাশ করো আর breakfast খাও 🥞🍳',
    '🍳 Mobile পরে রাখো আর energy নিয়ে দিন শুরু কর 📵',
    '😎 ক্লাস বা কাজ শুরু করো, সময় নষ্ট করা বন্ধ কর 🕒',
    '📚 একটু focus করার সময়, distractions এড়িয়ে যাও 😏',
    '😇 Playtime শেষ, study mode on 🕹️📖',
    '🌞 Good Afternoon! একটু fresh হও 🙌💖',
    '🍛 Lunch খাও, energy refill কর 😋',
    '😎 Chill time, mobile কম ব্যবহার কর 📵',
    '😴 Nap নিতে পারো, refresh হও 😌',
    '🥵 গরম পড়েছে, পানি খাও 💦',
    '😅 একটু হাসি ছড়িয়ে দিন, mood fresh রাখো 😆',
    '🌆 Hands washed? Relax এবং chill করো 👐💦',
    '📚 পড়াশোনা চলছে তো? Concentrate করো 😏',
    '🔥 মজা করো, তবে বেশি disturb কোরো না 😎',
    '😘 Dinner খেয়েছো? খেয়ে নাও 🍽️❤️',
    '😴 Mobile বন্ধ করে বিশ্রাম নাও 📵',
    '🛌 Relax! আগামি দিনের জন্য energy জমাও 😌'
];

// extra motivational / fun lines
const extraLines = [
    "💡 মনে রেখো: ঘুম শরীর আর মনের জন্য ভীষণ জরুরি।",
    "🔥 আজকের কাজ কালকে ফেলে রেখো না!",
    "🌸 হাসি হলো শ্রেষ্ঠ ওষুধ। একটু হাসো তো! 😁",
    "💪 ছোট ছোট কাজ মিলে বড় সাফল্য হয়।",
    "📱 মোবাইল নয়, নিজের স্বপ্নে Focus করো।",
    "🌎 পৃথিবীটা সুন্দর — একটু চোখ তুলে তাকাও!",
    "✨ তোমার হাসি কারো পুরো দিনকে সুন্দর করতে পারে।",
    "😎 কাজের মাঝে মজা খুঁজে নিতে শিখো।",
    "💖 নিজের প্রতি Positive থাকো।",
    "🎯 আজকের লক্ষ্য পূর্ণ করো, কালকে আবার নতুন শুরু।"
];

// Function to determine Bengali time period
function getBengaliPeriod(hour) {
    if (hour >= 4 && hour < 12) return 'সকাল';
    if (hour >= 12 && hour < 15) return 'দুপুর';
    if (hour >= 15 && hour < 18) return 'বিকেল';
    return 'রাত';
}

module.exports.onLoad = ({ api }) => {
    console.log(chalk.bold.hex("#00c300")("============ AUTOSENT COMMAND LOADED (BD TIME) ============"));

    for (let h = 0; h < 24; h++) {
        const rule = new schedule.RecurrenceRule();
        rule.tz = 'Asia/Dhaka';
        rule.hour = h;
        rule.minute = 0;

        schedule.scheduleJob(rule, () => {
            if (!global.data?.allThreadID) return;

            const nowMoment = moment().tz('Asia/Dhaka');
            const hour = nowMoment.hour();
            const minute = nowMoment.format('mm');
            const period = getBengaliPeriod(hour);

            const formattedTime = `${period} ${hour % 12 === 0 ? 12 : hour % 12}:${minute} ${nowMoment.format('A')}`;

            const message = messages[h] || '⏰ সময় চলে যাচ্ছে! কিছু productive করো ✨';
            const extra = extraLines[Math.floor(Math.random() * extraLines.length)];

            const finalMessage =
`👑━━━☞︎︎︎𝐑𝐀𝐁𝐁𝐢⍟𝐕𝐀𝐈☜︎︎━━━👑
🕒 এখন সময়: ${formattedTime}
${message}

${extra}
👑━━━☞︎︎︎𝐑𝐀𝐁𝐁𝐢⍟𝐕𝐀𝐈☜︎︎━━━👑`;

            global.data.allThreadID.forEach(threadID => {
                api.sendMessage(finalMessage, threadID, (error) => {
                    if (error) {
                        console.error(`Failed to send message to ${threadID}:`, error);
                    }
                });
            });

            console.log(chalk.hex("#00FFFF")(`Scheduled (BDT): ${formattedTime} => ${finalMessage}`));
        });
    }
};

module.exports.run = () => {
    // Main logic is in onLoad
};
