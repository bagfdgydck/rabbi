const fs = require('fs');
const request = require('request');

module.exports.config = {
    name: "sendnoti",
    version: "1.0.0",
    hasPermssion: 2,
    credits: "nazrul",
    description: "",
    commandCategory: "Tiện ích",
    usages: "[msg]",
    cooldowns: 5,
}

let atmDir = [];

const getAtm = (atm, body) => new Promise(async (resolve) => {
    let msg = {}, attachment = [];
    msg.body = body;
    for(let eachAtm of atm) {
        await new Promise(async (resolve) => {
            try {
                let response =  await request.get(eachAtm.url),
                    pathName = response.uri.pathname,
                    ext = pathName.substring(pathName.lastIndexOf(".") + 1),
                    path = __dirname + `/cache/${eachAtm.filename}.${ext}`
                response
                    .pipe(fs.createWriteStream(path))
                    .on("close", () => {
                        attachment.push(fs.createReadStream(path));
                        atmDir.push(path);
                        resolve();
                    })
            } catch(e) { console.log(e); }
        })
    }
    msg.attachment = attachment;
    resolve(msg);
})

module.exports.handleReply = async function ({ api, event, handleReply, Users, Threads }) {
    const moment = require("moment-timezone");
      var gio = moment.tz("Asia/Manila").format("DD/MM/YYYY - HH:mm:s");
    const { threadID, messageID, senderID, body } = event;
    let name = await Users.getNameUser(senderID);
    switch (handleReply.type) {
        case "sendnoti": {
            let text = `== User Reply ==\n\n『Reply』 : ${body}\n\n\nUser Name ${name}  \nFrom Group ${(await Threads.getInfo(threadID)).threadName || "Unknow"}`;
            if(event.attachments.length > 0) text = await getAtm(event.attachments, `== User Reply ==\n\n『Reply』 : ${body}\n\n\nUser Name: ${name} \nFrom Group ${(await Threads.getInfo(threadID)).threadName || "Unknow"}`);
            api.sendMessage(text, handleReply.threadID, (err, info) => {
                atmDir.forEach(each => fs.unlinkSync(each))
                atmDir = [];
                global.client.handleReply.push({
                    name: this.config.name,
                    type: "reply",
                    messageID: info.messageID,
                    messID: messageID,
                    threadID
                })
            });
            break;
        }
        case "reply": {
            let text = `𝐌𝐀𝐒𝐒𝐀𝐆𝐄 𝐅𝐑𝐎𝐌 𝐀𝐃𝐌𝐈𝐍\n=======================\n=======================\n\n『𝐌𝐀𝐒𝐒𝐀𝐆𝐄』 : ${body}\n\n\n『𝗔𝗗𝗠𝗜𝗡 𝗡𝗔𝗠𝗘』 ${name}\n\============================================== আপনি যদি এডমিন এর সঙ্গে  কথা বলতে চান।  তাইলে অবশ্যই  মেসেজের রিপ্লাই দিয়া মেসেজ করো। আমি তা এডিমন এর কাছে পৌঁছে দিবো`;
            if(event.attachments.length > 0) text = await getAtm(event.attachments, `${body} 𝐌𝐀𝐒𝐒𝐀𝐆𝐄 𝐅𝐑𝐎𝐌 𝐀𝐃𝐌𝐈𝐍 \n=======================\n=======================\n\n  𝐀𝐃𝐌𝐈𝐍 ${name}\n\============================================== আপনি যদি এডমিন এর সঙ্গে  কথা বলতে চান।  তাইলে অবশ্যই  মেসেজের রিপ্লাই দিয়া মেসেজ করো। আমি তা এডিমন এর কাছে পৌঁছে দিবো.`);
            api.sendMessage(text, handleReply.threadID, (err, info) => {
                atmDir.forEach(each => fs.unlinkSync(each))
                atmDir = [];
                global.client.handleReply.push({
                    name: this.config.name,
                    type: "sendnoti",
                    messageID: info.messageID,
                    threadID
                })
            }, handleReply.messID);
            break;
        }
    }
}

module.exports.run = async function ({ api, event, args, Users }) {
    const moment = require("moment-timezone");
      var gio = moment.tz("Asia/Manila").format("DD/MM/YYYY - HH:mm:s");
    const { threadID, messageID, senderID, messageReply } = event;
    if (!args[0]) return api.sendMessage("Please input message", threadID);
    let allThread = global.data.allThreadID || [];
    let can = 0, canNot = 0;
    let text = `𝐌𝐀𝐒𝐒𝐀𝐆𝐄 𝐅𝐑𝐎𝐌 𝐀𝐃𝐌𝐈𝐍\n==============================================\n\𝐌𝐀𝐒𝐒𝐀𝐆𝐄: ${args.join(" ")}\n\n𝗔𝗗𝗠𝗜𝗡 𝗡𝗔𝗠𝗘: ${await Users.getNameUser(senderID)} `;
    if(event.type == "message_reply") text = await getAtm(messageReply.attachments, `𝐌𝐀𝐒𝐒𝐀𝐆𝐄 𝐅𝐑𝐎𝐌 𝐀𝐃𝐌𝐈𝐍\==============================================\n\𝐌𝐀𝐒𝐒𝐀𝐆𝐄: ${args.join(" ")}\n\n𝗔𝗗𝗠𝗜𝗡 𝗡𝗔𝗠𝗘: ${await Users.getNameUser(senderID)}`);
    await new Promise(resolve => {
        allThread.forEach((each) => {
            try {
                api.sendMessage(text, each, (err, info) => {
                    if(err) { canNot++; }
                    else {
                        can++;
                        atmDir.forEach(each => fs.unlinkSync(each))
                        atmDir = [];
                        global.client.handleReply.push({
                            name: this.config.name,
                            type: "sendnoti",
                            messageID: info.messageID,
                            messID: messageID,
                            threadID
                        })
                        resolve();
                    }
                })
            } catch(e) { console.log(e) }
        })
    })
    api.sendMessage(`Send to ${can} thread, not send to ${canNot} thread`, threadID);
}
