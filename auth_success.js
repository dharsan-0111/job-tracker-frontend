window.onload = function () {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
        // Store token in Chrome Extension storage instead of localStorage
        chrome.storage.local.set({ authToken: token }, () => {
            console.log("Token stored in Chrome storage:", token);
        });

        // Send message to popup.js or background script (if needed)
        chrome.runtime.sendMessage({ type: "AUTH_SUCCESS", token });

        // Close the tab after a delay
        // setTimeout(() => {
        //     window.close();
        // }, 1000);
    } else {
        console.error("No token found in URL.");
    }
};
