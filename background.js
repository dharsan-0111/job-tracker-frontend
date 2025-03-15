chrome.runtime.onInstalled.addListener(() => {
  console.log("🛠 Extension Installed or Updated");
});

chrome.runtime.onStartup.addListener(() => {
  console.log("🚀 Extension started!");
});

// Listen for tab updates (keeps service worker alive)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  console.log("📌 Tab updated:", tabId, changeInfo);
});

// Listen for extension icon click
chrome.action.onClicked.addListener((tab) => {
  console.log("🖱️ Extension icon clicked:", tab);
});

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  console.log("📩 Message received in background.js:", message);

  if (message.action === "job_application_detected") {
    console.log("🟢 Job application detected. Waiting for submission...");
    // Do nothing here. Popup should open only after submission.
  }

  if (message.action === "parse_job_details") {
    console.log("Parsing started");
    chrome.tabs.sendMessage(sender.tab.id, message, sendResponse);
    return true; // Keep the response alive  
  }

  if (message.action === "job_application_completed") {
    console.log("✅ Job application submission confirmed!");

    // Store job details in local storage
    chrome.storage.local.set({ jobData: message.details }, () => {
      console.log("📦 Job details stored:", message.details);

      // Notify the popup to update UI
      chrome.runtime.sendMessage({ action: "update_popup" });

      // Open the popup after storing job details
      chrome.action.openPopup();
    });
  }

  sendResponse({ status: "ok" });
});
