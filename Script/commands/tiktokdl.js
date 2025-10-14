const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports.config = {
  name: 'tiktokdl',
  version: '1.0.0',
  hasPermission: 0,
  usePrefix: true,
  credits: 'NAZRUL',
  description: 'Download tiktok video without watermark',
  commandCategory: 'Tools',
  usages: '<TikTok Video URL>',
  cooldowns: 10,
};

module.exports.run = async ({ api, event, args }) => {
  try {
    if (args.length !== 1) {
      return api.sendMessage('Please provide a TikTok video URL.', event.threadID);
    }

    const tikTokUrl = args[0];
    const apiUrl = `https://sensui-useless-apis.codersensui.repl.co/api/tools/tiktokdl?url=${encodeURIComponent(tikTokUrl)}`;

    const response = await axios.get(apiUrl);
    const videoUrl = response.data.noWatermarkHd;

    if (!videoUrl) {
      return api.sendMessage('Failed to fetch the TikTok video.', event.threadID);
    }

    const videoResponse = await axios.get(videoUrl, { responseType: 'stream' });

    const tempFolderPath = path.join(__dirname, '..', '..', 'temp');
    if (!fs.existsSync(tempFolderPath)) {
      fs.mkdirSync(tempFolderPath);
    }

    const videoFilePath = path.join(tempFolderPath, 'tiktok_video.mp4');
    const writer = fs.createWriteStream(videoFilePath);

    videoResponse.data.pipe(writer);

    await new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });

    const message = {
      body: 'Here\'s your TikTok video:',
      attachment: fs.createReadStream(videoFilePath),
    };


    await api.sendMessage(message, event.threadID);


    fs.unlinkSync(videoFilePath);
  } catch (error) {
    console.error('Error in tiktokdl command:', error);
    api.sendMessage('An error occurred while processing the command.', event.threadID);
  }
};
