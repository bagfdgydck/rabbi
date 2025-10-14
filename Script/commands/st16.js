module.exports.config = {
  name: "ismamik",
  version: "3.0.8",
  hasPermssion: 0,
  credits: "NAZRUL",  //Please Don't change the credit
  description: "randomimg",
  commandCategory: "img",
  usages: "random",
  cooldowns: 5,
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
   var hi = [ "𝐈𝐒𝐋𝐀𝐌𝐈𝐂𝐊 𝐂𝐎𝐏𝐔𝐋 𝐑𝐀𝐍𝐃𝐎𝐌 𝐈𝐌𝐆",];
  var know = hi[Math.floor(Math.random() * hi.length)];
  var link = [
"https://i.postimg.cc/RhkwhY7Q/received-1011479233526654.jpg",
"https://i.postimg.cc/Xv4c9tTs/received-1082911369818537.jpg",
"https://i.postimg.cc/T38c3KQM/received-1231348904236630.jpg",
"https://i.postimg.cc/QCHqH5Rs/received-145161631950241.jpg",
"https://i.postimg.cc/4dF6kyn0/received-163937416715373.jpg",
"https://i.postimg.cc/MTG7FVZR/received-1739552986554004.jpg",
"https://i.postimg.cc/fLHKz5qB/received-176505422110031.jpg",
"https://i.postimg.cc/5yYwxJC2/received-1774790456285061.jpg",
"https://i.postimg.cc/15VHSGGr/received-2074526336224428.jpg",
"https://i.postimg.cc/wjhQy9bt/received-240881055523592.jpg",
"https://i.postimg.cc/nrgG7rJm/received-3648720575411908.jpg",
"https://i.postimg.cc/QNwQfF29/received-618890923568007.jpg",
"https://i.postimg.cc/9Xnps87f/received-745802927299453.jpg",
"https://i.postimg.cc/q7wcwjr4/received-969437921001153.jpg",

];
   var callback = () => api.sendMessage({body:` ${know} `,attachment: fs.createReadStream(__dirname + "/cache/5.jpg")}, event.threadID, () => fs.unlinkSync(__dirname + "/cache/5.jpg"));	
      return request(encodeURI(link[Math.floor(Math.random() * link.length)])).pipe(fs.createWriteStream(__dirname+"/cache/5.jpg")).on("close",() => callback());
   };
