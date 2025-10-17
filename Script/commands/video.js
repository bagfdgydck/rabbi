const axios = require("axios");
const fs = require('fs');
// fs.promises ব্যবহার করে Asynchronous file operations সক্ষম করা হয়েছে
const fsPromises = fs.promises;

// 1. API URL Caching (Kept as it is vital for speed)
let cachedBaseApiUrl = null;

const getBaseApiUrl = async () => {
  if (cachedBaseApiUrl) {
    return cachedBaseApiUrl;
  }
  try {
    // Fetch once and cache
    const base = await axios.get("https://raw.githubusercontent.com/cyber-ullash/cyber-ullash/refs/heads/main/UllashApi.json");
    cachedBaseApiUrl = base.data.api;
    return cachedBaseApiUrl;
  } catch (error) {
    console.error("Failed to fetch base API URL:", error);
    throw new Error("Could not retrieve base API URL.");
  }
};

// Helper function to download and save a file (Video/Audio)
async function downloadFile(url, pathName) {
  try {
    const res = await axios.get(url, { responseType: "arraybuffer" });
    // fs.writeFileSync is synchronous, but necessary here to ensure file exists before creating stream
    fs.writeFileSync(pathName, Buffer.from(res.data));
    return fs.createReadStream(pathName);
  } catch (err) {
    console.error("DownloadFile error:", err);
    throw new Error("File download failed.");
  }
}

// Helper function to stream an image (Thumbnails)
async function streamImage(url, pathName) {
  try {
    const response = await axios.get(url, { responseType: "stream" });
    response.data.path = pathName;
    return response.data;
  } catch (err) {
    console.error("StreamImage error:", err);
    throw new Error("Image streaming failed.");
  }
}

module.exports = {
  config: {
    name: "video",
    version: "1.1.7", // Updated version
    credits: "dipto", //fixed by Ullash 
    countDown: 3, // ⚡️ FASTER: Reduced countdown to 3 seconds
    hasPermssion: 0,
    description: "Download video, audio, and info from YouTube",
    category: "media",
    commandCategory: "media",
    usePrefix: true,
    prefix: true,
    usages:
      " {pn} [video|-v] [<video name>|<video link>]\n" +
      " {pn} [audio|-a] [<video name>|<video link>]\n" +
      " {pn} [info|-i] [<video name>|<video link>]\n" +
      "Example:\n" +
      "{pn} -v chipi chipi chapa chapa\n" +
      "{pn} -a chipi chipi chapa chapa\n" +
      "{pn} -i chipi chipi chapa chapa"
  },

  run: async ({ api, args, event }) => {
    const { threadID, messageID, senderID } = event;

    const baseApiUrl = await getBaseApiUrl(); 

    let action = (args[0] || '-v').toLowerCase();

    if (!['-v', 'video', 'mp4', '-a', 'audio', 'mp3', '-i', 'info'].includes(action)) {
      args.unshift('-v');
      action = '-v';
    }

    const checkurl = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))((\w|-){11})(?:\S+)?$/;
    const urlYtb = args[1] ? checkurl.test(args[1]) : false;

    if (urlYtb) {
      const format = ['-v', 'video', 'mp4'].includes(action) ? 'mp4'
        : ['-a', 'audio', 'mp3'].includes(action) ? 'mp3' : null;

      if (!format) return api.sendMessage('❌ Invalid format. Use -v for video or -a for audio.', threadID, messageID);

      try {
        const match = args[1].match(checkurl);
        const videoID = match ? match[1] : null;
        if (!videoID) return api.sendMessage('❌ Invalid YouTube link.', threadID, messageID);

        const path = `ytb_${format}_${videoID}.${format}`;
        
        // ⚡️ FASTER: Send "Downloading..." message early for immediate feedback
        const downloadingMsg = await api.sendMessage(`⏳ Downloading ${format.toUpperCase()} for video ID: ${videoID}...`, threadID);

        // Fetch data
        const apiUrl = `${baseApiUrl}/ytDl3?link=${videoID}&format=${format}&quality=3`;
        const { data: { title, downloadLink, quality } } = await axios.get(apiUrl);

        // Send file
        await api.sendMessage({
          body: `• Title: ${title}\n• Quality: ${quality}`,
          attachment: await downloadFile(downloadLink, path)
        }, threadID, async (err) => {
             // ⚡️ FASTER: Use asynchronous unlink (non-blocking file deletion)
             try {
                if (err) throw err;
                await fsPromises.unlink(path);
             } catch (e) {
                 console.error("Failed to process/unlink file:", e);
             }
             // Clean up the initial message
             if (downloadingMsg && downloadingMsg.messageID) {
                api.unsendMessage(downloadingMsg.messageID).catch(err => console.error("Failed to unsend message:", err));
             }
        }, messageID);

        return;
      } catch (e) {
        // Remove 'Downloading...' message if error occurred after sending it
        if (downloadingMsg && downloadingMsg.messageID) {
            api.unsendMessage(downloadingMsg.messageID).catch(err => console.error("Cleanup unsend failed:", err));
        }
        console.error(e);
        return api.sendMessage('❌ Failed to download. Please try again later.', threadID, messageID);
      }
    }

    // --- Search Logic ---
    args.shift(); 
    const keyWord = args.join(" ");
    if (!keyWord) return api.sendMessage('❌ Please provide a search keyword.', threadID, messageID);

    try {
      // Fetch search results
      const searchUrl = `${baseApiUrl}/ytFullSearch?songName=${encodeURIComponent(keyWord)}`;
      const searchResult = (await axios.get(searchUrl)).data.slice(0, 6);
      
      if (!searchResult.length) return api.sendMessage(`⭕ No results for keyword: ${keyWord}`, threadID, messageID);

      // ⚡️ FASTER: Use Promise.all to fetch all thumbnails concurrently
      const thumbnails = await Promise.all(searchResult.map((info, index) => 
          streamImage(info.thumbnail, `thumbnail_${index + 1}.jpg`)
      ));

      let msg = "";
      let i = 1;
      for (const info of searchResult) {
        msg += `${i++}. ${info.title}\nTime: ${info.time}\nChannel: ${info.channel.name}\n\n`;
      }

      api.sendMessage({
        body: msg + "👉 Reply to this message with a number to select.",
        attachment: thumbnails
      }, threadID, (err, info) => {
        if (err) return console.error(err);
        global.client.handleReply.push({
          name: module.exports.config.name,
          messageID: info.messageID,
          author: senderID,
          result: searchResult,
          action,
          baseApiUrl: baseApiUrl 
        });
      }, messageID);
    } catch (err) {
      console.error(err);
      return api.sendMessage("❌ An error occurred while searching: " + err.message, threadID, messageID);
    }
  },

  handleReply: async ({ event, api, handleReply }) => {
    const { threadID, messageID, senderID, body } = event;

    if (senderID !== handleReply.author) return;
    const { result, action, baseApiUrl } = handleReply;
    const choice = parseInt(body);

    if (isNaN(choice) || choice <= 0 || choice > result.length)
      return api.sendMessage("❌ Invalid number. Please reply with a valid number.", threadID, messageID);

    const selectedVideo = result[choice - 1];
    const videoID = selectedVideo.id;

    // Unsend the selection message (non-blocking unsend)
    api.unsendMessage(handleReply.messageID).catch(e => console.error("Unsend failed:", e));
    
    // Send "Downloading..." message early
    let downloadingMsg;
    try {
        downloadingMsg = await api.sendMessage(`⏳ Downloading selected ${action.includes('a') || action.includes('m') ? 'AUDIO' : 'VIDEO'}...`, threadID);
    } catch (e) {
        console.error("Failed to send downloading message:", e);
    }

    if (['-v', 'video', 'mp4', '-a', 'audio', 'mp3', 'music'].includes(action)) {
      const format = ['-v', 'video', 'mp4'].includes(action) ? 'mp4' : 'mp3';
      try {
        const path = `ytb_${format}_${videoID}.${format}`;
        
        // Fetch data
        const apiUrl = `${baseApiUrl}/ytDl3?link=${videoID}&format=${format}&quality=3`;
        const { data: { title, downloadLink, quality } } = await axios.get(apiUrl);

        // Send file
        await api.sendMessage({
          body: `• Title: ${title}\n• Quality: ${quality}`,
          attachment: await downloadFile(downloadLink, path)
        }, threadID, async (err) => {
            // ⚡️ FASTER: Asynchronous Unlink
             try {
                if (err) throw err;
                await fsPromises.unlink(path);
             } catch (e) {
                 console.error("Failed to process/unlink file:", e);
             }
             // Clean up the initial message
             if (downloadingMsg && downloadingMsg.messageID) {
                api.unsendMessage(downloadingMsg.messageID).catch(err => console.error("Failed to unsend message:", err));
             }
        }, messageID);

      } catch (e) {
        // Clean up the initial message if error occurred
        if (downloadingMsg && downloadingMsg.messageID) {
            api.unsendMessage(downloadingMsg.messageID).catch(err => console.error("Cleanup unsend failed:", err));
        }
        console.error(e);
        return api.sendMessage('❌ Failed to download. Please try again later.', threadID, messageID);
      }
    }

    if (action === '-i' || action === 'info') {
      // Clean up 'Downloading...' message immediately as info is faster
      if (downloadingMsg && downloadingMsg.messageID) {
          api.unsendMessage(downloadingMsg.messageID).catch(err => console.error("Cleanup unsend failed:", err));
      }
      try {
        // Fetch info
        const { data } = await axios.get(`${baseApiUrl}/ytfullinfo?videoID=${videoID}`);
        
        // Convert duration
        const durationMinutes = (data.duration / 60).toFixed(2);
        
        // Send info
        await api.sendMessage({
          body: `✨ Title: ${data.title}\n⏳ Duration: ${durationMinutes} mins\n📺 Resolution: ${data.resolution}\n👀 Views: ${data.view_count}\n👍 Likes: ${data.like_count}\n💬 Comments: ${data.comment_count}\n📂 Category: ${data.categories[0]}\n📢 Channel: ${data.channel}\n🧍 Uploader ID: ${data.uploader_id}\n👥 Subscribers: ${data.channel_follower_count}\n🔗 Channel URL: ${data.channel_url}\n🔗 Video URL: ${data.webpage_url}`,
          attachment: await streamImage(data.thumbnail, 'info_thumb.jpg')
        }, threadID, messageID);
        
      } catch (e) {
        console.error(e);
        return api.sendMessage('❌ Failed to retrieve video info.', threadID, messageID);
      }
    }
  }
};
