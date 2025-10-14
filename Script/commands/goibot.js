const fs = global.nodemodule["fs-extra"];
module.exports.config = {
  name: "goibot",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "NAZRUL",
  description: "goibot",
  commandCategory: "Noprefix",
  usages: "noprefix",
  cooldowns: 5,
};
module.exports.handleEvent = async function({ api, event, args, Threads, Users }) {
  var { threadID, messageID, reason } = event;
  const moment = require("moment-timezone");
  const time = moment.tz("Asia/Manila").format("HH:MM:ss L");
  var idgr = `${event.threadID}`;
  var id = event.senderID;
  var name = await Users.getNameUser(event.senderID);

  var tl = ["\nআমি এখন জিঁলাঁপিঁ  বস আর সাথে বিজি আছি\n===== 𝐍𝐀𝐙𝐑𝐔𝐋 𝐁𝐎𝐓 =====", "\njan ইনবক্সে গুতা মি😑😑 ?\n===== 𝐍𝐀𝐙𝐑𝐔𝐋 𝐁𝐎𝐓 =====","\n ভেঙে মোর ঘরের তালা৷ কেউ জি্ঁলা্ঁপি্ঁকে্ঁ নিয়া পালা😑😑\n===== 𝐍𝐀𝐙𝐑𝐔𝐋 𝐁𝐎𝐓 =====","\nI love you baby meye hole chipay aso\n===== 𝐍𝐀𝐙𝐑𝐔𝐋 𝐁𝐎𝐓 =====", "\nLove you 3000-😍ummah 9000💋💝\n===== 𝐍𝐀𝐙𝐑𝐔𝐋 𝐁𝐎𝐓 =====", "\nji bolen ki korte pari ami apnar jonno?\n===== 𝐍𝐀𝐙𝐑𝐔𝐋 𝐁𝐎𝐓 =====","\nআমাকে না ডেকে আমার বস জিঁলাঁলিঁ কে একটা জি এফ দেন\n===== 𝐍𝐀𝐙𝐑𝐔𝐋 𝐁𝐎𝐓 =====", "\n Ato daktasen kn bujhlam na 😡\n===== 𝐍𝐀𝐙𝐑𝐔𝐋 𝐁𝐎𝐓 =====", "\n jan bal falaba,🙂\n===== 𝐍𝐀𝐙𝐑𝐔𝐋 𝐁𝐎𝐓 =====","\nask amr mon vlo nei dakben na🙂\n===== 𝐍𝐀𝐙𝐑𝐔𝐋 𝐁𝐎𝐓 =====", "\nHmm jan ummah bby😘😘\n===== 𝐍𝐀𝐙𝐑𝐔𝐋 𝐁𝐎𝐓 =====","\njan hanga korba 😑🙂😑","\niss ato dako keno lojja lage to 🫦🙈\n===== 𝐍𝐀𝐙𝐑𝐔𝐋 𝐁𝐎𝐓 =====","\nsuna tomare amar valo lage,🙈😽\n===== 𝐍𝐀𝐙𝐑𝐔𝐋 𝐁𝐎𝐓 =====","\nজি তুমি কি আমাকে ডেকেছো 😇🖤🥀\n===== 𝐍𝐀𝐙𝐑𝐔𝐋 𝐁𝐎𝐓 =====","\n jan moye moye😑😑\n===== 𝐍𝐀𝐙𝐑𝐔𝐋 𝐁𝐎𝐓 =====","\nতোর কোন কোন জায়গায় বেথা গো বান্ধবী ললিতা🥵🥵\n===== 𝐍𝐀𝐙𝐑𝐔𝐋 𝐁𝐎𝐓 =====","\nজান জিলাপি 20 বছরের কচি প্লিজ পটে যাও🤐😁😁\n===== 𝐍𝐀𝐙𝐑𝐔𝐋 𝐁𝐎𝐓 =====","\nএত ডাকিস কেন বুঝা আমারে😡 আপডেট মাইয়া 🤪🤪\n===== 𝐍𝐀𝐙𝐑𝐔𝐋 𝐁𝐎𝐓 =====","\n__চা দিয়ে চানাচুর খাচ্ছি-😌\n\n_ ᴍʏ ʟɪғᴇ ᴍʏ ʀᴜʟᴇs ! 😎\n_ তাতে তোমার কি--😒\n===== 𝐍𝐀𝐙𝐑𝐔𝐋 𝐁𝐎𝐓 =====","\n💋💋💋💋👈👈এই নে মিষ্টি দিলাম খাও💋😋😋🤪🤪🤣🤣\n===== 𝐍𝐀𝐙𝐑𝐔𝐋 𝐁𝐎𝐓 =====","\n জান কাম টু মাই চেম্বার🤪🤣\n===== 𝐍𝐀𝐙𝐑𝐔𝐋 𝐁𝐎𝐓 =====","\nকচি মেয়েরা আমার বস জিঁলাঁপিঁ কে  গুতা দাও\n👇👇👇👇👇👇👇👇 \nhttps://m.me/ji.la.pi.2\n===== 𝐍𝐀𝐙𝐑𝐔𝐋 𝐁𝐎𝐓 =====", "\nজান যদি থাকে নসিরে বাচ্চা সহ আসিবে🤣🤣🤣😁😀\n===== 𝐍𝐀𝐙𝐑𝐔𝐋 𝐁𝐎𝐓 =====","\n জান তোর ওই গলিগে উম্মাহ💋💋\n===== 𝐍𝐀𝐙𝐑𝐔𝐋 𝐁𝐎𝐓 =====","\nজানু আমি জি্ঁলা্ঁপি্ঁর্ঁ লুচ্চা বট🥵🥵🥵\n===== 𝐍𝐀𝐙𝐑𝐔𝐋 𝐁𝐎𝐓 =====", "\njan যেহেতু  তুমি সিঙ্গেল তাই 😐\n\n মানবতার খাতিরে 😊🙃\n🙈 🙈I LOVE YOU 🙈🙈\n===== 𝐍𝐀𝐙𝐑𝐔𝐋 𝐁𝐎𝐓 =====", "\n--- 🦟 মশাকে মারতে চেয়েছিলাম\nকিন্তু পারলাম না কারণ 😒\n-- ওর শরীরে তো আমারই রক্ত বইছে!🙂\n...... this is মানবতা bro🙈\n===== 𝐍𝐀𝐙𝐑𝐔𝐋 𝐁𝐎𝐓 =====", "\nJan চুপচাপ🤫\n~~তোর নাম্বার দিয়া যা 😒🐸\n\n°•প্রেম করমু😁🙈🙈😁\n===== 𝐍𝐀𝐙𝐑𝐔𝐋 𝐁𝐎𝐓 =====", "\nআম্মু ওই যে ওরে লাগবে 🫵🥺===== 𝐍𝐀𝐙𝐑𝐔𝐋 𝐁𝐎𝐓 =====", "\nhmm jan\nআমিচাঁদে বসে টিভি দেখছি🥱🤧\nতুই ও দেখবি আয়...!! 🍂🤓\n===== 𝐍𝐀𝐙𝐑𝐔𝐋 𝐁𝐎𝐓 =====", "\n-oii jan Tumi 🫵---\nনাকি আমার উপর\n-ক্রাশ খাইলে সত্যিই নাকি..🤨🙈\n===== 𝐍𝐀𝐙𝐑𝐔𝐋 𝐁𝐎𝐓 =====", "\noii--তাকায় আছো কেন?\nপ্রেম করবা🤭🙈\n===== 𝐍𝐀𝐙𝐑𝐔𝐋 𝐁𝐎𝐓 =====","\n কি খুঁজছো, আপন মানুষ.?🙂🤍\nআকাশের দিকে তাকাও 'সৃষ্টিকর্তা ছাড়া কাউকে\nআপন মনে হবে না..!❤️‍🩹🌸","===== 𝐍𝐀𝐙𝐑𝐔𝐋 𝐁𝐎𝐓 ===== ", "\nকিরে---- --------\nশুনলাম তুমি নাকি  প্রতি রাত বিয়ের জন্য  কদিস😁😁\n===== 𝐍𝐀𝐙𝐑𝐔𝐋 𝐁𝐎𝐓 =====", "\nজীবনের  গল্পটা শুরু হওয়ার আগেই শেষ হয়ে গেছে  হয়তো আর কখনো সাজাতে  পারবো না আগের মত করে\n===== 𝐍𝐀𝐙𝐑𝐔𝐋 𝐁𝐎𝐓 =====", "\nথাকতে কদর করতে শিখো\n   কারন \nকিছু মানুষ  জীবনে বারবার আসে না\n===== 𝐍𝐀𝐙𝐑𝐔𝐋 𝐁𝐎𝐓 =====", "\nপ্রয়োজনের চেয়ে বেশি পেয়ে গেলে \n সেটাকে অবহেলা করে\n===== 𝐍𝐀𝐙𝐑𝐔𝐋 𝐁𝐎𝐓 =====", "\nএকদিন হারিয়ে যাবো তিন টুকরো কাফনে\nপ্রিয়জনেরাই বলিবে দেরি কিসের দাফনে\n===== 𝐍𝐀𝐙𝐑𝐔𝐋 𝐁𝐎𝐓 =====", "\nমুখের কথা.......\n\nরাগের সময়ই সই,,নিয় না মনে রাগের মথায় অনেক কিছু কই\nরাগ শেষে তোমারি রই\n===== 𝐍𝐀𝐙𝐑𝐔𝐋 𝐁𝐎𝐓 =====", "\nখুব করে চেয়েও তোমাকে পাইনি\n অথচ তুমি যে আমার ভাগ্যে ছিলে না সেটা কখনো বুঝতে পারনি\n===== 𝐍𝐀𝐙𝐑𝐔𝐋 𝐁𝐎𝐓 =====", "\nবেহারা মন সারাক্ষণ শুধু তাকেই চায়\nযার কাছে আমি অবহেলিত\n===== 𝐍𝐀𝐙𝐑𝐔𝐋 𝐁𝐎𝐓 =====", "\nআমরা বড় হয়ে মানুষ চিনি না\n\n আমরা মানুষ চিনতে চিনতে বড় হই\n===== 𝐍𝐀𝐙𝐑𝐔𝐋 𝐁𝐎𝐓 =====", "\nআমি অল্পতেই খুশি হয়ে যাই তাই হয়তো আমার ভাগ্যে ওই অল্পটুকুও জোটে টা\n===== 𝐍𝐀𝐙𝐑𝐔𝐋 𝐁𝐎𝐓 =====", "\nযদি জীবনে একটা delete button থাকতো  তাহলে কিছু স্মৃতি  কিছু অনুভুতি আর কিছু মানুষ কে মুছে ফেলতাম জীবনের ডায়েরি  থেকে\n===== 𝐍𝐀𝐙𝐑𝐔𝐋 𝐁𝐎𝐓 =====", "\nজানু\n\nআমার তো সবাই মানুষ \nপার্থক্য শুধু মানসিতায়\n===== 𝐍𝐀𝐙𝐑𝐔𝐋 𝐁𝐎𝐓 =====", "\nশরীল তো সবাই ছুঁতে পারে\n\nকিন্ত মন ছোয়ার ক্ষমতা সবার থাকে না\n===== 𝐍𝐀𝐙𝐑𝐔𝐋 𝐁𝐎𝐓 =====", "\n জীবনের  সব চেয়ে  পছন্দের জীনিস গুলো\n\nহয়তো অবৈধ , নয়তো নিষিদ্ধ\nহয়তো দামি নয়তো অন্যকরো\n===== 𝐍𝐀𝐙𝐑𝐔𝐋 𝐁𝐎𝐓 =====", "\nকে তুমি বৎস,\nধরিয়া মৎস,\nবেচিয়া গঞ্জে,\nআকুলো কুঞ্জে,\nনা খাইয়া তাজা,\nকেনো তুমি সেবন করিলে,\nমেয়াদ উত্তির্ন গাজা।🧘‍♀️\n===== 𝐍𝐀𝐙𝐑𝐔𝐋 𝐁𝐎𝐓 =====", "\nতুমি আমার মিষ্টী আলু\n    লাল টুকটুকে গাজর\nতুমি আমার প্রাণভোমরা\n    তুমি বুকের ফাঁজর\nতুমি আমার ফুচকা চটপটি\n    মজার ঝালমুড়ি\nতুমি কি চাও তোমার জন্য\n   আরো চাপা মারি\n===== 𝐍𝐀𝐙𝐑𝐔𝐋 𝐁𝐎𝐓 ====="];
  var rand = tl[Math.floor(Math.random() * tl.length)]

    if ((event.body.toLowerCase() == "love bot") || (event.body.toLowerCase() == "love bot")) {
     return api.sendMessage("Hmm... Bot is too shy to love the bot admin :))", threadID);
   };

    if ((event.body.toLowerCase() == "oh bot") || (event.body.toLowerCase() == "oh bot")) {
     return api.sendMessage("Hurry, I have to serve other boxes :)", threadID);
   };

    if ((event.body.toLowerCase() == "does bot love you") || (event.body.toLowerCase() == "bot loves you")) {
     return api.sendMessage("Hi, Bot loves you more than me, love bot <3", threadID);
   };

   if ((event.body.toLowerCase() == "dog bot") || (event.body.toLowerCase() == "dog bot")) {
     return api.sendMessage("What dog just talked bad about me, want to die😠", threadID);
   };

   if ((event.body.toLowerCase() == "dmm bot") || (event.body.toLowerCase() == "dmm bot")) {
     return api.sendMessage("Being disobedient to your biological parents, you say that's a broken person", threadID);
   };

   if ((event.body.toLowerCase() == "cursing cmm") || (event.body.toLowerCase() == "undercover cmm")) {
     return api.sendMessage("Being disobedient to your biological parents, you say that's a broken person", threadID);
   };

  if ((event.body.toLowerCase() == "bsvv nha mng") || (event.body.toLowerCase() == "bsvv nha mng")) {
     return api.sendMessage("Hello dear, have a nice day ❤️", threadID);
   };

   if ((event.body.toLowerCase() == "bsvv nha mn") || (event.body.toLowerCase() == "bsvv nha mn")) {
     return api.sendMessage("Hello dear, have a nice day ❤️", threadID);
   };

   if ((event.body.toLowerCase() == "btvv nha mng") || (event.body.toLowerCase() == "btvv nha mng")) {
     return api.sendMessage("Hello dear, have a nice day ❤️", threadID);
   };

   if ((event.body.toLowerCase() == "hi ae") || (event.body.toLowerCase() == "hi ae")) {
     return api.sendMessage("Hello dear, have a nice day ❤️", threadID);
   };

   if ((event.body.toLowerCase() == "hiii") || (event.body.toLowerCase() == "hiii")) {
     return api.sendMessage("Hello dear, have a nice day ❤️", threadID);
   };

   if ((event.body.toLowerCase() == "btvv nha mn") || (event.body.toLowerCase() == "btvv nha mn")) {
     return api.sendMessage("Hello dear, have a nice day ❤️", threadID);
   };


   if ((event.body.toLowerCase() == "tt go mng") || (event.body.toLowerCase() == "tt go mng")) {
     return api.sendMessage("️1 is interaction, 2 is kick :))))", threadID);
   };

   if ((event.body.toLowerCase() == "let's go") || (event.body.toLowerCase() == "let's go")) {
     return api.sendMessage("️1 is interaction, 2 is kick :))))", threadID);
   };

   if ((event.body.toLowerCase() == "tt mng oi") || (event.body.toLowerCase() == "tt mng oi")) {
     return api.sendMessage("️1 is interaction, 2 is kick :))))", threadID);
   };

   if ((event.body.toLowerCase() == "nn nha mng") || (event.body.toLowerCase() == "nn nha mng")) {
     return api.sendMessage("️Sleep well <3 Wish you all super nice dreams <3", threadID);
   };

   if ((event.body.toLowerCase() == "tt go mn") || (event.body.toLowerCase() == "tt go mn")) {
     return api.sendMessage("️1 is interaction, 2 is kick :))))", threadID);
   };

   if ((event.body.toLowerCase() == "flop over") || (event.body.toLowerCase() == "flop over")) {
     return api.sendMessage("️1 is interaction, 2 is kick :))))", threadID);
   };

   if ((event.body.toLowerCase() == "clmm bot") || (event.body.toLowerCase() == "clmm bot")) {
     return api.sendMessage("️Swear something dog :) you've been holding on to you for a long time", threadID);
   };

   if ((event.body.toLowerCase() == "bot cc") || (event.body.toLowerCase() == "bot cc")) {
     return api.sendMessage("️Swear something dog :) you've been holding on to you for a long time", threadID);
   };

   if ((event.body.toLowerCase() == "cc bot") || (event.body.toLowerCase() == "cc bot")) {
     return api.sendMessage("️Swear something dog :) you've been holding on to you for a long time", threadID);
   };

   if ((event.body.toLowerCase() == "bot dthw too") || (event.body.toLowerCase() == "bot dthw over")) {
     return api.sendMessage("️ that's very commendable hihi :>", threadID);
   };

   if ((event.body.toLowerCase() == "dm bot") || (event.body.toLowerCase() == "dm bot")) {
     return api.sendMessage("️Swear something to your dad :), you're a kid but you like to be alive :)", threadID);
   };

   if ((event.body.toLowerCase() == "nobody loves me") || (event.body.toLowerCase() == "nobody loves me")) {
     return api.sendMessage("️Come on, the bot loves you <3 <3", threadID);
   };

   if ((event.body.toLowerCase() == "does the bot love the admin bot") || (event.body.toLowerCase() == "does the bot love the admin bot")) {
     return api.sendMessage("Yes, love him the most, don't try to rob me", threadID);
   };

   if ((event.body.toLowerCase() == "bot im going") || (event.body.toLowerCase() == "bot im di")) {
     return api.sendMessage("Im cc :))) m stop barking for me, but tell me im :>>", threadID);
   };

   if ((event.body.toLowerCase() == "bot go away") || (event.body.toLowerCase() == "bot cut di")) {
     return api.sendMessage("You're gone, your dad's gone, don't make you speak :))))", threadID);
   };

   if ((event.body.toLowerCase() == "What's the bot swearing") || (event.body.toLowerCase() == "bot cursing")) {
     return api.sendMessage("Damn you, shame on hahaha :>>, still asking", threadID);
   };

   if ((event.body.toLowerCase() == "is the bot sad") || (event.body.toLowerCase() == "is the bot sad")) {
     return api.sendMessage("Why can't I be sad because of everyone <3 love you <3", threadID);
   };

   if ((event.body.toLowerCase() == "does the bot love you") || (event.body.toLowerCase() == "does the bot love you")) {
     return api.sendMessage("Yes I love you and everyone so much", threadID);
   };

   if ((event.body.toLowerCase() == "bot goes to sleep") || (event.body.toLowerCase() == "bot goes to sleep")) {
     return api.sendMessage("I'm a bot, you're the one who should go to sleep <3", threadID);
   };

   if ((event.body.toLowerCase() == "has the bot eaten yet") || (event.body.toLowerCase() == "bot an comrade")) {
     return api.sendMessage("I'm full when I see you eat <3", threadID);
   };

   if ((event.body.toLowerCase() == "does the bot love me") || (event.body.toLowerCase() == "does the bot love me")) {
     return api.sendMessage("Yes <3", threadID);
   };

   if ((event.body.toLowerCase() == "does the bot have a brand") || (event.body.toLowerCase() == "does the bot fall")) {
     return api.sendMessage("Yes <3", threadID);
   };

  if (event.body.indexOf("bot") == 0 || (event.body.indexOf("Bot") == 0)) {
    var msg = {
      body: `${name}, ${rand}`
    }
    return api.sendMessage(msg, threadID, messageID);
  };

}

module.exports.run = function({ api, event, client, __GLOBAL }) { }
