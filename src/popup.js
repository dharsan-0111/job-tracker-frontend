console.log("🟢 Popup script loaded!");

// Function to load stored job details
function loadJobDetails() {
  chrome.storage.local.get("jobData", (data) => {
    if (data.jobData) {
      console.log("📄 Prefilling job details:", data.jobData);
      document.getElementById("role").value = data.jobData.role || "";
      document.getElementById("company").value = data.jobData.company || "";
      document.getElementById("appliedDate").value = new Date().toISOString().split("T")[0]; // Auto-fill today’s date
      document.getElementById("location").value = data.jobData.location || "Remote";
    }
  });
}

// Listen for updates from background.js
chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "update_popup") {
    console.log("🔄 Updating popup with stored job details...");
    loadJobDetails();
  }
});

// Load job details when the popup opens
document.addEventListener("DOMContentLoaded", loadJobDetails);

// Handle form submission
document.getElementById("saveJob").addEventListener("click", async () => {
  const jobEntry = {
    role: document.getElementById("role").value.trim(),
    company: document.getElementById("company").value.trim(),
    appliedDate: document.getElementById("appliedDate").value.trim(),
    location: document.getElementById("location").value.trim(),
  };

  console.log("📤 Sending job entry to backend:", jobEntry);

  // Call backend API to save to Google Sheets
  try {
    const response = await fetch("localhost:8080/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(jobEntry),
    });

    const result = await response.json();
    console.log("✅ Job saved successfully:", result);
    alert("Job saved successfully!");
  } catch (error) {
    console.error("🚨 Error saving job:", error);
    alert("Failed to save job.");
  }
});
