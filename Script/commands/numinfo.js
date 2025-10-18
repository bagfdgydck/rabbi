const NEW_API_URL = "YOUR_WORKING_API_ENDPOINT"; // <<< REPLACE THIS LINE
const axios = require("axios");

module.exports = {
    config: {
        name: "numinfo",
        credits: "Dipto",
        hasPermssion: 0,
        commandCategory: "Information",
        usages: "numinfo <number>",
        version: "1.0.1" // Updated version
    },
    run: async function ({ api, event, args }) {
        if (!args[0]) return api.sendMessage("⚠️ দয়া করে একটি নম্বর দিন!", event.threadID, event.messageID);

        // This number formatting logic is specific to the old API. 
        // You may need to adjust it depending on your new API's requirements.
        let number = args[0]?.startsWith("01") ? "88" + args[0] : args[0]; 

        api.setMessageReaction("⌛", event.messageID, () => {}, true);

        try {
            // Check if the placeholder is still present
            if (NEW_API_URL === "YOUR_WORKING_API_ENDPOINT") {
                return api.sendMessage("❌ Error: API endpoint has not been updated. Please replace 'YOUR_WORKING_API_ENDPOINT' in the code with a working number lookup API URL.", event.threadID, event.messageID);
            }

            // The format for the new API call will depend on the API you choose!
            // The old format was: NEW_API_URL + "?number=" + number
            let { data } = await axios.get(`${NEW_API_URL}?number=${number}`);

            // This line assumes your new API returns data in the same 'data.info' format.
            // You may need to change 'data.info' to match your new API's response structure.
            let msg = {
                body: data.info.map(i => `Name: ${i.name} \nType: ${i.type || "Not found"}`).join("\n")
            };

            if (data.image) msg.attachment = (await axios.get(data.image, { responseType: "stream" })).data;
            
            api.sendMessage(msg, event.threadID, event.messageID);

        } catch (e) {
            api.sendMessage(`❌ Error in API lookup. Check the API URL and response structure. Details: ${e.message}`, event.threadID, event.messageID);
            console.log(e);
        }
    }
};
