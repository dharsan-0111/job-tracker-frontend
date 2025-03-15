
console.log("✅ Content script injected!");

// Job-related keywords categorized into sections
const jobKeywords = [
  "job", "job description", "position", "role", "vacancy", "opening", "career", "employment", "work",
  "recruitment", "opportunity", "internship", "full-time", "part-time", "contract", "hiring"
];

const applyKeywords = [
  "apply", "submit", "send resume", "upload resume", "upload CV", "fill application", "apply now",
  "submit resume", "start application", "job application"
];

const confirmationKeywords = [
  "thank you", "your application has been received", "applied successfully",
  "application submitted", "we have received your application", "confirmation"
];

// Function to check if at least `threshold` keywords exist in the text
function keywordMatchCount(text, keywordList, threshold = 2) {
  let matchCount = 0;
  for (const keyword of keywordList) {
    if (text.includes(keyword.toLowerCase())) {
      matchCount++;
      if (matchCount >= threshold) return true; // Stop early if enough matches are found
    }
  }
  return false;
}

// Main function to analyze the page
function analyzePage() {
  console.log("🔍 Analyzing page...");

  const url = window.location.href.toLowerCase();
  console.log("🌐 URL:", url);

  // Step 1: Check URL first
  if (!keywordMatchCount(url, jobKeywords, 1)) {
    console.log("❌ Skipping page: URL does not indicate a job site.");
    return;
  }
  console.log("✅ Passed URL check.");

  // Step 2: Delay text extraction to ensure dynamic content is loaded
  setTimeout(async () => {
    const pageText = document.body.innerHTML;

    // Step 3: Ensure multiple job-related keywords exist before proceeding
    const hasJobTerms = keywordMatchCount(pageText, jobKeywords, 2);
    const hasApplyTerms = keywordMatchCount(pageText, applyKeywords, 2);

    if (!hasJobTerms || !hasApplyTerms) {
      console.log("❌ Skipping page: Not enough job-related keywords detected.");
      return;
    }

    console.log("✅ Job application page detected!");

    // Step 4: Show confirmation popup before enabling AI tracking
    if (confirm("Are you applying for a job? Do you want this job to be stored in Sheets?")) {
      console.log("User confirmed")
      try {
        console.log("📡 Sending API request...");
        const cleanedText = document.body.innerText.replace(/[\n\r]+/g, ' ');
        const response = await fetch(`http://localhost:8080/parse-job-details`, {
          method: 'POST',
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ html_content: cleanedText }),
          credentials: 'include',
        });

        const result = await response.json();
        console.log("✅ API response received:", result);

        // Store parsed job details in local storage
        chrome.storage.local.set({ jobData: result }, () => {
          console.log("📄 Job details stored in local storage:", result);
        });

        chrome.runtime.sendMessage({ action: "show_popup" });
      } catch (error) {
        console.log(error, "Error in parsing")
      } finally {
        trackJobApplication()
      }
    }
  }, 3000); // 2-second delay to allow full page load
}

// Function to track the final confirmation page and extract job details
async function trackJobApplication() {
  console.log("👀 Tracking job application submission...");

  const observer = new MutationObserver(() => {
    const pageText = document.body.innerHTML;

    if (keywordMatchCount(pageText, confirmationKeywords, 2)) {
      console.log("✅ Job application submission detected!");

      // Fetch stored job details from AI parsing (if available)
      chrome.storage.local.get("jobData", (data) => {
        let jobData = data.jobData || {};

        // Store the detected job details
        chrome.storage.local.set({ jobData }, () => {
          console.log("📄 Job details stored:", jobData);

          // Send message to background to show the popup
          chrome.runtime.sendMessage({ action: "show_popup" });
        });
      });

      observer.disconnect(); // Stop observing once detected
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

// Run analysis immediately
analyzePage();

