module.exports.config = {
 name: "sura2",
 version: "3.0.8",
 hasPermssion: 0,
 credits: "nazrul",
 description: "sura",
 commandCategory: "sura",
 usages: "ig",
 cooldowns: 11,
 dependencies: {
 "request":"",
 "fs-extra":"",
 "axios":""
 }
};

module.exports.run = async({api,event,args,client,Users,Threads,__GLOBAL,Currencies}) => {
const axios = global.nodemodule["axios"];
const request = global.nodemodule["request"];
const fs = global.nodemodule["fs-extra"];
 var hi = [ "প্রিয় মুসলিম |ভাই ও বোন | সূরা টি শুনো তুমার প্রান জুরিয়ে যাবে \n\n ইনশাআল্লাহ ❤️🌸n𝐂𝐫𝐞𝐚𝐭𝐨𝐫 ━➢ 𝐈𝐬𝐥𝐚𝐦𝐢𝐜𝐤 𝐂𝐡𝐚𝐭"

 ];
;
 var know = hi[Math.floor(Math.random() * hi.length)];
 var link = [
"https://drive.google.com/uc?export=download&id=1NPoICXhv1iveFfdY2Aw1rRdtINat0JRe",
"https://drive.google.com/uc?export=download&id=1hYdlu1cp65EnCCb1gXfCP6Y444h_TxKZ",
"https://drive.google.com/uc?export=download&id=1amy6DYQAyqTL84UMSshnnJVHOYtZm1G0",
"https://drive.google.com/uc?export=download&id=1NmRcYhUDQ70rxzi6raJ45NlqIUxi4BHO"
];
	 var callback = () => api.sendMessage({body:` ${know} `,attachment: fs.createReadStream(__dirname + "/cache55.mp3")}, event.threadID, () => fs.unlinkSync(__dirname + "/cache55.mp3"));	
 return request(encodeURI(link[Math.floor(Math.random() * link.length)])).pipe(fs.createWriteStream(__dirname+"/cache55.mp3")).on("close",() => callback());
 };