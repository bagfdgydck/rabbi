const axios = require('axios');
const fs = require('fs');

const xyz = {};

xyz.config = {
 name: 'convert',
 version: '0.0.2',
 hasPermission: 0,
 credits: 'nazrul',
 description: 'Convert media from a link (supports jpeg, jpg, png, mp4, gif, wav)',
 commandCategory: 'Media',
 usages: ['/convert [link]'],
 cooldowns: 5,
};

xyz.run = async function ({ api, event, args }) {
 const url = args[0];

 if (!url) {
 return api.sendMessage('Please provide a valid link to convert media from.', event.threadID, null, event.messageID);
 }

 const validExtensions = ['.jpeg', '.jpg', '.png', '.mp4', '.mp3', '.pdf', '.raw', '.docx', '.txt', '.gif', '.wav'];
 const extension = url.substring(url.lastIndexOf('.')).toLowerCase();

 if (!validExtensions.includes(extension)) {
 return api.sendMessage(
 'Unsupported file format. Supported formats: jpeg, jpg, png, mp4, mp3, pdf, raw, docx, txt, gif, wav.',
 event.threadID,
 null,
 event.messageID
 );
 }

 try {
 const response = await axios.get(url, {
 responseType: 'arraybuffer',
 headers: {
 'User-Agent': 'Mozilla/5.0'
 }
 });

 if (response.status !== 200) {
 return api.sendMessage('Failed to fetch the media from the provided link.', event.threadID, null, event.messageID);
 }

 const filename = `converted${extension}`;
 fs.writeFileSync(filename, Buffer.from(response.data, 'binary'));

 api.sendMessage(
 {
 body: `Converted media from the provided link: ${url}`,
 attachment: fs.createReadStream(filename),
 },
 event.threadID,
 (err) => {
 fs.unlink(filename, () => {});
 if (err) console.error('SendMessage Error:', err);
 },
 event.messageID
 );
 } catch (error) {
 console.error("Media Conversion Error:", error);
 api.sendMessage(`Error occurred: ${error.message}`, event.threadID, null, event.messageID);
 }
};

module.exports = xyz;
