// ... (rabbi.js ফাইলের অন্যান্য কোড) ...

// মেসেজ হ্যান্ডলিং ফাংশন
function handleMessage(sender_psid, received_message) {
  let response;

  if (received_message.text) {
    let messageText = received_message.text.toLowerCase().trim();

    if (messageText === 'রাব্বি' || messageText === 'rabbi') {
      // রাব্বি-এর জন্য ছবির রিপ্লাই (আগের মতই)
      // ...
    } else if (messageText === 'কল' || messageText === 'call') {
      // কলের জন্য বাটন যুক্ত
      response = {
        "attachment": {
          "type": "template",
          "payload": {
            "template_type": "button",
            "text": "আপনার সাথে কথা বলার জন্য নিচের বাটনটি চাপুন:",
            "buttons": [
              {
                "type": "phone_number", // ফোন নম্বর কলের জন্য বিশেষ টাইপ
                "title": "আমাদেরকে কল করুন",
                "payload": "+8801795486467" // আপনার ফোন নম্বর এখানে দিন (কান্ট্রি কোড সহ)
              }
              // আপনি যদি URL দিতে চান, তবে এটি ব্যবহার করুন:
              // {
              //   "type": "web_url",
              //   "url": "https://meet.google.com/yourlink", // মিটিং লিঙ্ক
              //   "title": "ভিডিও কলে যোগ দিন"
              // }
            ]
          }
        }
      };
    } else {
      // অন্য মেসেজের জন্য সাধারণ রিপ্লাই
      response = {
        "text": `আপনি বলেছেন: "${received_message.text}"।`
      }
    }
  }

  // API কল করে রেসপন্স পাঠান
  callSendAPI(sender_psid, response);
}

// ... (ফাইলের বাকি অংশ) ...
