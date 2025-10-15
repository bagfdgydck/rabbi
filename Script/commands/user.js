module.exports.config = {
	name: "user",
	version: "1.0.5",
	hasPermssion: 2,
	credits: "𝐂𝐘𝐁𝐄𝐑 ☢️_𖣘 -𝐁𝐎𝐓 ⚠️ 𝑻𝑬𝑨𝑴_ ☢️",
	description: "Ban or unblock users",
	commandCategory: "system",
	usages: "[unban/ban/search] [ID or text]",
	cooldowns: 5
};

module.exports.languages = {
	"en": {
		"reason": "Reason",
		"at": "at",
		"allCommand": "all commands",
		"commandList": "commands",
		"banSuccess": "[ Ban User ] Successfully banned user: %1",
		"unbanSuccess": "[ Unban User ] Successfully unbanned user %1",
		"banCommandSuccess": "[ banCommand User ] Successfully banned commands for user: %1",
		"unbanCommandSuccess": "[ UnbanCommand User ] Successfully unbanned %1 for user: %2",
		"errorReponse": "%1 Unable to complete your request",
		"IDNotFound": "%1 The user ID you entered doesn't exist in database",
		"existBan": "[ Ban User ] User %1 was already banned %2 %3",
		"notExistBan": "[ Unban User ] This user was never banned from using the bot",
		"missingCommandInput": "%1 Command field cannot be empty!",
		"notExistBanCommand": "[ UnbanCommand User ] This user ID was never banned from using commands",

		"returnBan": "[ Ban User ] You are requesting to ban user:\n- User ID and name to ban: %1%2\n\n❮ React to this message to confirm ❯",
		"returnUnban": "[ Unban User ] You are requesting to unban user:\n- User ID and name to unban: %1\n\n❮ React to this message to confirm ❯",
		"returnBanCommand": "[ banCommand User ] You are requesting to ban commands for user:\n - User ID and name: %1\n- Commands to ban: %2\n\n❮ React to this message to confirm ❯",
		"returnUnbanCommand": "[ UnbanCommand User ] You are requesting to unban commands for user:\n - User ID and name: %1\n- Commands to unban: %2\n\n❮ React to this message to confirm ❯",
	
		"returnResult": "Here are matching results: \n",
		"returnNull": "No results found for your search!",
		"returnList": "[ User List ]\nThere are currently %1 banned users, showing %2 users\n\n%3",
		"returnInfo": "[ Info User ] Here's some information about the user:\n- User ID and name: %1\n- Banned?: %2 %3 %4\n- Commands banned?: %5"
	}
}

module.exports.handleReaction = async ({ event, api, Users, handleReaction, getText }) => {
	if (parseInt(event.userID) !== parseInt(handleReaction.author)) return;
	const moment = require("moment-timezone");
	const { threadID } = event;
	const { messageID, type, targetID, reason, commandNeedBan, nameTarget } = handleReaction;
	
	const time = moment.tz("Asia/Kolkata").format("HH:MM:ss L");
	global.client.handleReaction.splice(global.client.handleReaction.findIndex(item => item.messageID == messageID), 1);
	
	switch (type) {
		case "ban": {
			try {
				let data = (await Users.getData(targetID)).data || {};
				data.banned = true;
				data.reason = reason || null;
				data.dateAdded = time;
				await Users.setData(targetID, { data });
				global.data.userBanned.set(targetID, { reason: data.reason, dateAdded: data.dateAdded });
				return api.sendMessage(getText("banSuccess", `${targetID} - ${nameTarget}`), threadID, () => {
					return api.unsendMessage(messageID);
				});
			} catch { return api.sendMessage(getText("errorReponse", "[ Ban User ]"), threadID) };
		}

		case "unban": {
			try {
				let data = (await Users.getData(targetID)).data || {};
				data.banned = false;
				data.reason = null;
				data.dateAdded = null;
				await Users.setData(targetID, { data });
				global.data.userBanned.delete(targetID);
				return api.sendMessage(getText("unbanSuccess", `${targetID} - ${nameTarget}`), threadID, () => {
					return api.unsendMessage(messageID);
				});
			} catch { return api.sendMessage(getText("errorReponse", "[ Unban User ]"), threadID) };
		}

		case "banCommand": {
			try {	
				let data = (await Users.getData(targetID)).data || {};
				data.commandBanned = [...data.commandBanned || [], ...commandNeedBan];
				await Users.setData(targetID, { data });
				global.data.commandBanned.set(targetID, data.commandBanned);
				return api.sendMessage(getText("banCommandSuccess", `${targetID} - ${nameTarget}`), threadID, () => {
					return api.unsendMessage(messageID);
				});
			} catch (e) { return api.sendMessage(getText("errorReponse", "[ banCommand User ]"), threadID) };
		}

		case "unbanCommand": {
			try {
				let data = (await Users.getData(targetID)).data || {};
				data.commandBanned = [...data.commandBanned.filter(item => !commandNeedBan.includes(item))];
				await Users.setData(targetID, { data });
				global.data.commandBanned.set(targetID, data.commandBanned);
				if(data.commandBanned.length == 0) global.data.commandBanned.delete(targetID)
				return api.sendMessage(getText("unbanCommandSuccess", ((data.commandBanned.length == 0) ? getText("allCommand") : `${getText("commandList")}: ${commandNeedBan.join(", ")}`), `${targetID} - ${nameTarget}`), threadID, () => {
					return api.unsendMessage(messageID);
				});
			} catch (e) { return api.sendMessage(getText("errorReponse", "[ UnbanCommand User ]"), threadID) };
		}
	}
}

module.exports.run = async ({ event, api, args, Users, getText }) => {
	const { threadID, messageID } = event;
	const type = args[0];
	var targetID = String(args[1]);
	var reason = (args.slice(2, args.length)).join(" ") || null;

	if (isNaN(targetID)) {
		const mention = Object.keys(event.mentions);
		args = args.join(" ");
		targetID = String(mention[0]);
		reason = (args.slice(args.indexOf(event.mentions[mention[0]]) + (event.mentions[mention[0]] || "").length + 1, args.length)) || null;
	}

	switch (type) {
		case "ban":
		case "-b": {
			if (!global.data.allUserID.includes(targetID)) return api.sendMessage(getText("IDNotFound", "[ Ban User ]"), threadID, messageID);
			if (global.data.userBanned.has(targetID)) {
				const { reason, dateAdded } = global.data.userBanned.get(targetID) || {};
				return api.sendMessage(getText("existBan", targetID, ((reason) ? `${getText("reason")}: "${reason}"` : ""), ((dateAdded) ? `${getText("at")} ${dateAdded}` : "")), threadID, messageID);
			}
			const nameTarget = global.data.userName.get(targetID) || await Users.getNameUser(targetID);
			return api.sendMessage(getText("returnBan", `${targetID} - ${nameTarget}`, ((reason) ? `\n- ${getText("reason")}: ${reason}` : "")), threadID, (error, info) => {
				global.client.handleReaction.push({
					type: "ban",
					targetID,
					reason,
					nameTarget,
					name: this.config.name,
					messageID: info.messageID,
					author: event.senderID,
				});
			}, messageID);
		}

		case "unban":
		case "-ub": {
			if (!global.data.allUserID.includes(targetID)) return api.sendMessage(getText("IDNotFound", "[ Unban User ]"), threadID, messageID);
			if (!global.data.userBanned.has(targetID)) return api.sendMessage(getText("notExistBan"), threadID, messageID);
			const nameTarget = global.data.userName.get(targetID) || await Users.getNameUser(targetID);
			return api.sendMessage(getText("returnUnban", `${targetID} - ${nameTarget}`), threadID, (error, info) => {
				global.client.handleReaction.push({
					type: "unban",
					targetID,
					nameTarget,
					name: this.config.name,
					messageID: info.messageID,
					author: event.senderID,
				});
			}, messageID);
		}

		case "search":
		case "-s": {
			const contentJoin = reason || "";
			const getUsers = (await Users.getAll(['userID', 'name'])).filter(item => !!item.name);
			var matchUsers = [], a = '', b = 0;
			getUsers.forEach(i => {
				if (i.name.toLowerCase().includes(contentJoin.toLowerCase())) {
					matchUsers.push({
						name: i.name,
						id: i.userID
					});
				}
			});
			matchUsers.forEach(i => a += `\n${b += 1}. ${i.name} - ${i.id}`);
			(matchUsers.length > 0) ? api.sendMessage(getText("returnResult", a), threadID) : api.sendMessage(getText("returnNull"), threadID);
			return;
		}
		
		case "banCommand":
		case "-bc": {
			if (!global.data.allUserID.includes(targetID)) return api.sendMessage(getText("IDNotFound", "[ BanCommand User ]"), threadID, messageID);
			if (reason == null || reason.length == 0) return api.sendMessage(getText("missingCommandInput", "[ BanCommand User ]"), threadID, messageID);
			if (reason == "all") {
				var allCommandName = [];
				const commandValues = global.client.commands.keys();
				for (const cmd of commandValues) allCommandName.push(cmd);
				reason = allCommandName.join(" ");
			}
			const commandNeedBan = reason.split(" ");
			const nameTarget = global.data.userName.get(targetID) || await Users.getNameUser(targetID);
			return api.sendMessage(getText("returnBanCommand", `${targetID} - ${nameTarget}`, ((commandNeedBan.length == global.client.commands.size) ? getText("allCommand") : commandNeedBan.join(", "))), threadID, (error, info) => {
				global.client.handleReaction.push({
					type: "banCommand",
					targetID,
					commandNeedBan,
					nameTarget,
					name: this.config.name,
					messageID: info.messageID,
					author: event.senderID,
				});
			}, messageID);
		}

		case "unbanCommand":
		case "-ubc": {
			if (!global.data.allUserID.includes(targetID)) return api.sendMessage(getText("IDNotFound", "[ UnbanCommand User ]"), threadID, messageID);
			if (!global.data.commandBanned.has(targetID)) return api.sendMessage(getText("notExistBanCommand"), threadID, messageID);
			if (reason == null || reason.length == 0) return api.sendMessage(getText("missingCommandInput", "[ UnbanCommand User ]"), threadID, messageID);
			if (reason == "all") {
				reason = (global.data.commandBanned.get(targetID)).join(" ");
			}
			const commandNeedBan = reason.split(" ");
			const nameTarget = global.data.userName.get(targetID) || await Users.getNameUser(targetID);
			return api.sendMessage(getText("returnUnbanCommand", `${targetID} - ${nameTarget}`, ((commandNeedBan.length == global.data.commandBanned.get(targetID).length) ? getText("allCommand") : commandNeedBan.join(", "))), threadID, (error, info) => {
				global.client.handleReaction.push({
					type: "unbanCommand",
					targetID,
					commandNeedBan,
					nameTarget,
					name: this.config.name,
					messageID: info.messageID,
					author: event.senderID,
				});
			}, messageID);
		}

		case "list":
		case "-l": {
			var listBan = [], i = 0;
			const threadData = global.data.userBanned.keys();
			for (; ;) {
				let idUser = String(threadData.next().value);
				if (typeof idUser == "undefined") {
					const userName = (await Users.getData(idUser)).name || "unknown";
					listBan.push(`${i+=1}/ ${idUser} - ${userName}`);
				}
				if (i == global.data.userBanned.size || i == (parseInt(reason) || 10)) break;
			}
			return api.sendMessage(getText("returnList",(global.data.userBanned.size || 0), listBan.length, listBan.join("\n")), threadID, messageID);
		}

		case "info":
		case "-i": {
			if (!global.data.allUserID.includes(targetID)) return api.sendMessage(getText("IDNotFound", "[ Info User ]"), threadID, messageID);
			if (global.data.commandBanned.has(targetID)) { var commandBanned = global.data.commandBanned.get(targetID) || [] };
			if (global.data.userBanned.has(targetID)) { var { reason, dateAdded } = global.data.userBanned.get(targetID) || {} };
			const nameTarget = global.data.userName.get(targetID) || await Users.getNameUser(targetID);
			return api.sendMessage(getText("returnInfo", `${targetID} - ${nameTarget}`, ((!dateAdded) ? "YES" : "NO"), ((reason) ? `${getText("reson")}: "${reason}"` : ""), ((dateAdded) ? `${getText("at")}: ${dateAdded}` : ""), ((commandBanned) ? `YES: ${(commandNeedBan.length == global.client.commands.size) ? getText("allCommand") : commandNeedBan.join(", ")}` : "NO")), threadID, messageID);
		}
	}
}.includes(targetID)) return api.sendMessage(getText("IDNotFound", "[ UnbanCommand User ]"), threadID, messageID);
			if (!global.data.commandBanned.has(targetID)) return api.sendMessage(getText("notExistBanCommand"), threadID, messageID);
			if (reason == null || reason.length == 0) return api.sendMessage(getText("missingCommandInput", "[ UnbanCommand User ]"), threadID, messageID);
			if (reason == "all") {
				reason = (global.data.commandBanned.get(targetID)).join(" ");
			}
			const commandNeedBan = reason.split(" ");
			const nameTarget = global.data.userName.get(targetID) || await Users.getNameUser(targetID);
			return api.sendMessage(getText("returnUnbanCommand", `${targetID} - ${nameTarget}`, ((commandNeedBan.length == global.data.commandBanned.get(targetID).length) ? getText("allCommand") : commandNeedBan.join(", "))), threadID, (error, info) => {
				global.client.handleReaction.push({
					type: "unbanCommand",
					targetID,
					commandNeedBan,
					nameTarget,
					name: this.config.name,
					messageID: info.messageID,
					author: event.senderID,
					
				});
			}, messageID);
		}

		case "list":
		case "-l": {
			var listBan = [], i = 0;
			const threadData = global.data.userBanned.keys();
			for (; ;) {
				let idUser = String(threadData.next().value);
				if (typeof idUser == "undefined") {
					const userName = (await Users.getData(idUser)).name || "unknown";
					listBan.push(`${i+=1}/ ${idUser} - ${userName}`);
				}
				if (i == global.data.userBanned.size || i == (parseInt(reason) || 10)) break;
			}
			return api.sendMessage(getText("returnList",(global.data.userBanned.size || 0), listBan.length, listBan.join("\n")), threadID, messageID);
		}

		case "info":
		case "-i": {
			if (!global.data.allUserID.includes(targetID)) return api.sendMessage(getText("IDNotFound", "[ Info User ]"), threadID, messageID);
			if (global.data.commandBanned.has(targetID)) { var commandBanned = global.data.commandBanned.get(targetID) || [] };
			if (global.data.userBanned.has(targetID)) { var { reason, dateAdded } = global.data.userBanned.get(targetID) || {} };
			const nameTarget = global.data.userName.get(targetID) || await Users.getNameUser(targetID);
			return api.sendMessage(getText("returnInfo", `${targetID} - ${nameTarget}`, ((!dateAdded) ? "YES" : "NO"), ((reason) ? `${getText("reson")}: "${reason}"` : ""), ((dateAdded) ? `${getText("at")}: ${dateAdded}` : ""), ((commandBanned) ? `YES: ${(commandNeedBan.length == global.client.commands.size) ? getText("allCommand") : commandNeedBan.join(", ")}` : "NO")), threadID, messageID);
		}
	}
}
