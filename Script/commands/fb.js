module.exports.config = {
  name: "fb",
  version: "1.0.",
  hasPermssion: 0,
  credits: "nazrul",
  description: "Fb Vid Downloader",
  commandCategory: "other",
  usages: "fb video link",
  cooldowns: 2,
  dependencies: {
        'nayan-media-downloader': '',
  }
},

  languages: {
    "vi": {},
        "en": {
            "urlinvalid": 'Unsupported video platform. Please provide a valid Facebook, TikTok, Twitter, Instagram, or YouTube video link.',
          "waitfb": '𝐃𝐨𝐰𝐧𝐥𝐨𝐚𝐝𝐢𝐧𝐠 𝐯𝐢𝐝𝐞𝐨 𝐅𝐨𝐫𝐦 𝐅𝐚𝐜𝐞𝐛𝐨𝐨𝐤 𝐏𝐥𝐞𝐚𝐬𝐞 𝐖𝐢𝐚𝐭......\n===== 𝐍𝐀𝐙𝐑𝐔𝐋 𝐁𝐎𝐓 =====',
          "downfb": "𝐒𝐞𝐧𝐝𝐢𝐧𝐠 𝐘𝐨𝐮𝐫 𝐕𝐢𝐝𝐞𝐨\n===== 𝐍𝐀𝐙𝐑𝐔𝐋 𝐁𝐎𝐓 =====",
          "waittik": '𝐃𝐨𝐰𝐧𝐥𝐨𝐚𝐝𝐢𝐧𝐠 𝐯𝐢𝐝𝐞𝐨 𝐅𝐨𝐫𝐦 𝐓𝐢𝐤𝐓𝐨𝐤 𝐏𝐥𝐞𝐚𝐬𝐞 𝐖𝐢𝐚𝐭......\n===== 𝐍𝐀𝐙𝐑𝐔𝐋 𝐁𝐎𝐓 =====',
          "waitinsta": '𝐃𝐨𝐰𝐧𝐥𝐨𝐚𝐝𝐢𝐧𝐠 𝐯𝐢𝐝𝐞𝐨 𝐅𝐨𝐫𝐦 𝐈𝐧𝐬𝐭𝐚𝐠𝐫𝐚𝐦 𝐏𝐥𝐞𝐚𝐬𝐞 𝐖𝐢𝐚𝐭......\n===== 𝐍𝐀𝐙𝐑𝐔𝐋 𝐁𝐎𝐓 =====',
          "downinsta": '𝐒𝐞𝐧𝐝𝐢𝐧𝐠 𝐘𝐨𝐮𝐫 𝐕𝐢𝐝𝐞𝐨\n===== 𝐍𝐀𝐙𝐑𝐔𝐋 𝐁𝐎𝐓 =====',
          "waityt": '𝐃𝐨𝐰𝐧𝐥𝐨𝐚𝐝𝐢𝐧𝐠 𝐯𝐢𝐝𝐞𝐨 𝐅𝐨𝐫𝐦 𝐘𝐨𝐮𝐓𝐮𝐛𝐞 𝐏𝐥𝐞𝐚𝐬𝐞 𝐖𝐢𝐚𝐭......\n===== 𝐍𝐀𝐙𝐑𝐔𝐋 𝐁𝐎𝐓 =====',
          "waittw": 'Downloading Twitter video. Please wait...',
          "downtw": 'Twitter video download success',
          "error": '❌Error'
        }
    },

start: async function ({ nayan, events, args, lang }) {
  const axios = require("axios");
  const fs = require("fs-extra");
  const content = args.join(" ");
  const { ytdown, ndown, tikdown, twitterdown } = require("nayan-media-downloader")
  let msg = "";

  const sendWaitingMessage = async (message) => {
    const vid = (
      await axios.get(
        'https://i.imgur.com/rvreDPU.gif',
        { responseType: 'stream' }
      )
    ).data;
    return await nayan.sendMessage({ ...message }, events.threadID);
  };

  if (content.includes("https://fb.watch/") || content.includes("https://www.facebook.com")) {
    const fbnayanResponse = await ndown(content);
    console.log(fbnayanResponse)
    const fbVideoUrl = fbnayanResponse.data[0].url;
    const waitingMessage = await sendWaitingMessage({ body: lang("waitfb") });

    const fbVideoData = (await axios.get(fbVideoUrl, {
      responseType: "arraybuffer",
    })).data;
    fs.writeFileSync(__dirname + "/cache/fbVideo.mp4", Buffer.from(fbVideoData, "utf-8"));

    msg = lang("downfb");

    nayan.reply(
      {
        body: msg,
        attachment: fs.createReadStream(__dirname + "/cache/fbVideo.mp4"),
      },
      events.threadID
    );

    setTimeout(() => {
      nayan.unsendMessage(waitingMessage.messageID);
    }, 9000);
  } else if (
    content.includes("https://vt.tiktok.com/") ||
    content.includes("https://tiktok.com/") ||
    content.includes("https://www.tiktok.com")
  ) {
    const tiktoknayanResponse = await tikdown(content);
    const tiktokVideoUrl = tiktoknayanResponse.data.video;
    const tiktokTitle = tiktoknayanResponse.data.title;
    const tiktokavatar = tiktoknayanResponse.data.author.avatar;
    console.log(tiktoknayanResponse)
    const tiktokAvatar = (
      await axios.get(`${tiktokavatar}`,
        { responseType: 'stream' }
      )
    ).data;
    const waitingMessage = await sendWaitingMessage({ body: lang("waittik")});

    const tiktokVideoData = (await axios.get(tiktokVideoUrl, {
      responseType: "arraybuffer",
    })).data;
    fs.writeFileSync(__dirname + "/cache/tiktokVideo.mp4", Buffer.from(tiktokVideoData, "utf-8"));

    msg = `《TITLE》${tiktokTitle}`;

    nayan.reply(
      {
        body: msg,
        attachment: fs.createReadStream(__dirname + "/cache/tiktokVideo.mp4"),
      },
      events.threadID
    );

    setTimeout(() => {
      nayan.unsendMessage(waitingMessage.messageID);
    }, 9000);
  } else if (content.includes("https://instagram.com") || content.includes("https://www.instagram.com")) {
    const instagramnayanResponse = await ndown(content);
    const instagramVideoUrl = instagramnayanResponse.data[0].url;
    const waitingMessage = await sendWaitingMessage({ body: lang("waitinsta") });

    const instagramVideoData = (await axios.get(instagramVideoUrl, {
      responseType: "arraybuffer",
    })).data;
    fs.writeFileSync(__dirname + "/cache/instagramVideo.mp4", Buffer.from(instagramVideoData, "utf-8"));

    msg = lang("downinsta");

    nayan.reply(
      {
        body: msg,
        attachment: fs.createReadStream(__dirname + "/cache/instagramVideo.mp4"),
      },
      events.threadID
    );

    setTimeout(() => {
      nayan.unsendMessage(waitingMessage.messageID);
    }, 9000);
  } else if (content.includes("https://youtube.com/shorts/") || content.includes("https://youtu.be/")) {
    // YouTube video download logic
    const youtubenayanResponse = await ytdown(content);
    const youtubeVideoUrl = youtubenayanResponse.data.video;
    const title = youtubenayanResponse.data.title;
    const waitingMessage = await sendWaitingMessage({ body: lang("waityt") });
    const youtubeVideoData = (await axios.get(youtubeVideoUrl, {
      responseType: "arraybuffer",
    })).data;
    fs.writeFileSync(__dirname + "/cache/youtubeVideo.mp4", Buffer.from(youtubeVideoData, "utf-8"));

    msg = `${title}`;

    nayan.reply(
      {
        body: msg,
        attachment: fs.createReadStream(__dirname + "/cache/youtubeVideo.mp4"),
      },
      events.threadID
    );

    setTimeout(() => {
      nayan.unsendMessage(waitingMessage.messageID);
    }, 9000);
  } else if (content.includes("https://twitter.com/")) {
    const instagramnayanResponse = await twitterdown(content);
    const twitterVideoUrl = instagramnayanResponse.data.HD;
    const waitingMessage = await sendWaitingMessage({ body: lang("waittw") });

    const TWITTEEVideoData = (await axios.get(twitterVideoUrl, {
      responseType: "arraybuffer",
    })).data;
    fs.writeFileSync(__dirname + "/cache/instagramVideo.mp4", Buffer.from(TWITTEEVideoData, "utf-8"));

    msg = lang("downtw");

    nayan.reply(
      {
        body: msg,
        attachment: fs.createReadStream(__dirname + "/cache/instagramVideo.mp4"),
      },
      events.threadID
    );

    setTimeout(() => {
      nayan.unsendMessage(waitingMessage.messageID);
    }, 9000);
  } else {
    msg = lang("urlinvalid");
    nayan.reply({ body: msg }, events.threadID);
  }
}
}
