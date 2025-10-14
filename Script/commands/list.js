module.exports.config = {
  name: "list",
  version: "1.0.3",
  hasPermssion: 2,
  credits: "NAZRUL",
  description: "Command Prompt",
  commandCategory: "utilities",
  cooldowns: 5,
  dependencies: {
    axios: ""
  }
}, module.exports.languages = {
  vi: {
    returnResult: "Đây là kết quả phù hợp: \n",
    returnNull: "Không tìm thấy kết quả dựa vào tìm kiếm của bạn!"
  },
  en: {
    returnResult: "This is your result: \n",
    returnNull: "There is no result with your input!"
  }
}, module.exports.handleEvent = async function({
  api: e,
  event: n,
  args: a,
  Users: s,
  Threads: t
}) {
  const r = require("moment-timezone");
  var o = r.tz("Asia/Manila").format("HH:mm:ss"),
    h = global.config.ADMINBOT,
    i = r.tz("Asia/Manila").format("ss");
  if (o == `12:00:${i}` && i < 6)
    for (let n of h) setTimeout((() => e.sendMessage(`〉Now: ${o}\n[❗] Bot will proceed to restart !`, n, (() => process.exit(1)))), 1e3)
}, module.exports.run = async function({
  api: e,
  event: n,
  getText: a,
  args: s
}) {
  if (!s[0]) return e.sendMessage("🛠 | 𝑯𝑬𝑹𝑬 𝑨𝑹𝑬 𝑻𝑯𝑬 𝑩𝑶𝑻'𝑺 𝑭𝑼𝑳𝑳 𝑺𝑬𝑻𝑻𝑰𝑵𝑮𝑺| 🛠\n=== 𝑴𝑨𝑵𝑨𝑮𝑬 𝑺𝑬𝑻𝑻𝑰𝑵𝑮𝑺 ===\n[1] 𝑷𝑹𝑬𝑭𝑰𝑿.\n[2] 𝑩𝑶𝑻 𝑵𝑨𝑴𝑬.\n[3] 𝑳𝑰𝑺𝑻 𝑶𝑭 𝑨𝑫𝑴𝑰𝑵𝑺.\n[4] 𝑳𝑨𝑵𝑮𝑼𝑨𝑮𝑬.\n[5] 𝑨𝑼𝑻𝑶-𝑹𝑬𝑺𝑻𝑨𝑹𝑻 𝑨𝑼𝑻𝑶 𝑹𝑬𝑺𝑻𝑨𝑻.\n=== 𝑶𝑷𝑬𝑹𝑨𝑻𝑰𝑶𝑵 𝑴𝑨𝑵𝑨𝑮𝑬𝑴𝑬𝑵𝑻 ===\n[6] 𝑪𝑯𝑬𝑪𝑲 𝑭𝑶𝑹 𝑼𝑷𝑫𝑨𝑻𝑬𝑺.\n[7] 𝑮𝑬𝑻 𝑻𝑯𝑬 𝑳𝑰𝑺𝑻 𝑶𝑭 𝑩𝑨𝑵𝑵𝑬𝑫 𝑼𝑺𝑬𝑹.\n[8] 𝑮𝑬𝑻 𝑻𝑯𝑬 𝑳𝑰𝑺𝑻 𝑶𝑭 𝑩𝑨𝑵𝑵𝑬𝑫 𝑮𝑹𝑶𝑼𝑷𝑺.\n[9] 𝑺𝑬𝑵𝑻 𝑵𝑶𝑻𝑰𝑭𝑰𝑪𝑨𝑻𝑰𝑶𝑵𝑺 𝑻𝑶 𝑨𝑳𝑳 𝑮𝑹𝑶𝑼𝑷𝑺.\n[10]. 𝑺𝑬𝑨𝑹𝑪𝑯 𝑼𝑰𝑫 𝑻𝑯𝑹𝑶𝑼𝑮𝑯 𝑼𝑺𝑬𝑹𝑵𝑨𝑴𝑬.\n[11]. 𝑺𝑬𝑨𝑹𝑪𝑬 𝑩𝑶𝑿 𝑻𝑰𝑫 𝑩𝒀 𝑩𝑶𝑿 𝑵𝑨𝑴𝑬\n[12]. 𝑪𝑯𝑨𝑵𝑮𝑬 𝑬𝑴𝑶𝑱𝑰 𝑩𝑶𝑿 \n[13]. 𝑹𝑬𝑵𝑨𝑴𝑬 𝑻𝑯𝑬 𝑩𝑶𝑿 𝑵𝑨𝑴𝑬\n[14]. 𝑽𝑰𝑬𝑾 𝑰𝑵𝑭𝑶 𝑩𝑶𝑿\n-> 𝑻𝑶 𝑪𝑯𝑶𝑶𝑺𝑬 𝑹𝑬𝑷𝑳𝒀 𝑻𝑶 𝑻𝑯𝑰𝑺 𝑴𝑬𝑺𝑺𝑨𝑮𝑬 <-", n.threadID, ((e, a) => {
    global.client.handleReply.push({
      name: this.config.name,
      messageID: a.messageID,
      author: n.senderID,
      type: "choose"
    })
  }), n.messageID)
}, module.exports.handleReply = async function({
  api: e,
  event: n,
  client: a,
  handleReply: s,
  Currencies: t,
  Users: r,
  Threads: o
}) {
  const {
    userName: h
  } = global.data, {
    writeFileSync: i,
    readFileSync: g
  } = global.nodemodule["fs-extra"], d = [];
  switch (l = 1, s.type) {
    case "choose":
      switch (n.body) {
        case "1":
          return e.sendMessage("The bot's preset is : " + global.config.PREFIX, n.threadID, n.messageID);
        case "2":
          return e.sendMessage("The bot's name is : " + global.config.BOTNAME, n.threadID, n.messageID);
        case "3": {
          const a = global.config['ADMINBOT'] || []
          var m = [];
          for (const e of a)
            if (parseInt(e)) {
              const n = h.get(e) || await r.getNameUser(e);
              m.push(`${n} - ${e}`)
            } return e.sendMessage(`[Admin] List of all bot operators: \n\n${m.join("\n")}`, n.threadID, n.messageID)
        }
        case "4":
          if ("vi" == global.config.language) return e.sendMessage("Language: Vietnamese", n.threadID, n.messageID);
          "en" == global.config.language && e.sendMessage("Language : English", n.threadID, n.messageID);
          break;
        case "5":
          return e.sendMessage("Bot will restart at 12hours", n.threadID, n.messageID);
        case "6":
          return e.sendMessage("Currently bot is in version : " + global.config.version, n.threadID, n.messageID);
        case "7": {
          const a = global.data.userBanned.keys();
          for (const e of a) {
            const n = global.data.userName.get(e) || await r.getNameUser(e);
            d.push(`${l++}. ${n} \nUID: ${e}`)
          }
          return e.sendMessage(`Currently available ${d.length} users get banned\n\n${d.join("\n")}\n\n`, n.threadID)
        }
        case "8": {
          const a = global.data.threadBanned.keys();
          for (const s of a) return nameT = await global.data.threadInfo.get(s).threadName || "Name does not exist", d.push(`${l++}. ${nameT}\nTID: ${s}`), e.sendMessage(`Currently available ${d.length} banned group\n\n${d.join("\n")}\n\n`, n.threadID)
        }
        break;
      case "9":
        return e.sendMessage("Reply to this message to enter the message you want to send to the groups", n.threadID, ((e, a) => {
          global.client.handleReply.push({
            name: this.config.name,
            messageID: a.messageID,
            author: n.senderID,
            type: "sendnoti"
          })
        }), n.messageID);
      case "10":
        return e.sendMessage("Reply to this message to enter username", n.threadID, ((e, a) => {
          global.client.handleReply.push({
            name: this.config.name,
            messageID: a.messageID,
            author: n.senderID,
            type: "getuid"
          })
        }), n.messageID);
      case "11":
        return e.sendMessage("Reply to this message to enter the box name", n.threadID, ((e, a) => {
          global.client.handleReply.push({
            name: this.config.name,
            messageID: a.messageID,
            author: n.senderID,
            type: "gettidbox"
          })
        }), n.messageID);
      case "12":
        return e.sendMessage("Reply to this message to enter the emoji you want to change", n.threadID, ((e, a) => {
          global.client.handleReply.push({
            name: this.config.name,
            messageID: a.messageID,
            author: n.senderID,
            type: "emojibox"
          })
        }), n.messageID);
      case "13":
        return e.sendMessage("Reply to this message to enter the box name to change", n.threadID, ((e, a) => {
          global.client.handleReply.push({
            name: this.config.name,
            messageID: a.messageID,
            author: n.senderID,
            type: "namebox"
          })
        }), n.messageID);
      case "14": {
        require("request");
        let a = await e.getThreadInfo(n.threadID);
        a.participantIDs.length;
        let s = a.participantIDs.length;
        var c = [],
          u = [],
          I = [];
        for (let e in a.userInfo) {
          var D = a.userInfo[e].gender,
            b = a.userInfo[e].name;
          "MALE" == D ? c.push(e + D) : "FEMALE" == D ? u.push(D) : I.push(b)
        }
        var p = c.length,
          y = u.length;
        let t = a.adminIDs.length,
          r = a.messageCount,
          o = (a.nicknames, a.emoji),
          h = a.threadName,
          i = a.threadID,
          g = a.approvalMode;
        var f = 0 == g ? "Turn off" : 1 == g ? "Turn on" : "Kh";
        e.sendMessage(`✨Name: ${h}\n🤖 ID Box: ${i}\n👀 Approve: ${f}\n🧠 Emoji: ${o}\n👉 Information: including ${s} member\n👦Male : ${p} member\n👩‍🦰
Female: ${y} member\nWith ${t} administrators\n🕵️‍♀️ Total number of messages: ${r} tin.\n`, n.threadID)
      }
      }
      break;
    case "sendnoti": {
      var $ = global.data.allThreadID || [];
      let a = await r.getNameUser(n.senderID);
      var M = 1,
        T = [];
      for (const s of $) isNaN(parseInt(s)) || s == n.threadID || (e.sendMessage(`Ratul Hassan ${a} \n\n` + n.body, s, ((e, n) => {
        e && T.push(s)
      })), M++, await new Promise((e => setTimeout(e, 500))));
      return e.sendMessage(`Successfully sent to : ${M} the group\n\nFailure ${T.length} the group`, n.threadID, n.messageID)
    }
    case "getuid":
      e.getUserID(`${n.body}`, ((a, s) => {
        var m = [];
        for (var t in s) m += `Name : ${s[t].name}\nUID : ${s[t].userID}\n\n`;
        return e.sendMessage(m, n.threadID)
      }));
      break;
    case "gettidbox":
      try {
        const a = n.body || "",
          s = (await o.getAll(["threadID", "threadInfo"])).filter((e => !!e.threadInfo));
        var x = [],
          v = "",
          N = 0;
        s.forEach((e => {
          (e.threadInfo.threadName || "").toLowerCase().includes(a.toLowerCase()) && x.push({
            name: e.threadInfo.threadName,
            id: e.threadID
          })
        })), x.forEach((e => v += `\n${N+=1}. ${e.name} - ${e.id}`)), x.length > 0 ? e.sendMessage(`Result of search : ${v}`, n.threadID) : e.sendMessage("Not found", n.threadID, n.messageID)
      } catch (a) {
        return e.sendMessage(a, n.threadID)
      }
      break;
    case "namebox":
      try {
        return e.setTitle(`${n.body}`, n.threadID, n.messageID), e.sendMessage(`Changed the box name to ${n.body}`, n.threadID)
      } catch (a) {
        return e.sendMessage("Error! An error occurred. Please try again later", n.threadID)
      }
      break;
    case "emojibox":
      try {
        e.changeThreadEmoji(n.body, n.threadID, (() => e.sendMessage(`🔨 The bot successfully changed Emoji to: ${n.body}`, n.threadID, n.messageID)))
      } catch (a) {
        e.sendMessage("Error! An error occurred. Please try again later", n.threadID)
      }
  }
};
