// console.log("popup.js loaded");

// document.addEventListener("DOMContentLoaded", function () {
//     console.log("Popup.html loaded");

//     const backendUrl = "http://localhost:8080";
//     const appContainer = document.getElementById("app");

//     // function verifyToken(token) {
//     //     fetch(`${backendUrl}/verify-token`, {
//     //         method: "GET",
//     //         headers: { Authorization: `Bearer ${token}` }
//     //     })
//     //     .then(response => response.ok ? response.json() : Promise.reject("Invalid Token"))
//     //     .then(data => showJobForm(data.email))
//     //     .catch(() => {
//     //         localStorage.removeItem("access_token");
//     //         showLoginScreen();
//     //     });
//     // }

//     function showLoginScreen() {
//         appContainer.innerHTML = `
//             <div>
//                 <button id="loginButton">Sign in with Google</button>
//             </div>
//         `;

//         document.getElementById("loginButton").addEventListener("click", function () {
//             fetch("http://localhost:8080/auth/google", {
//                 method: "POST"
//             })
//             .then(response => response.json())
//             .then(data => {
//                 window.open(data?.auth_url, "GoogleAuth", "width=500, height=600")
//                 return;
//             })
//             .catch(reason => {
//                 console.log(reason, 'Reason for error');
//             });

//             window.addEventListener("message", function (event) {
//                 if (event.origin !== window.location.origin) return;
//                 const params = new URLSearchParams(event.data);
//                 const token = params.get("access_token");

//                 if (token) {
//                     localStorage.setItem("access_token", token);
//                     // verifyToken(token);
//                 }
//             });
//         });
//     }

//     function showJobForm(userEmail) {
//         appContainer.innerHTML = `
//             <p>✅ Logged in as ${userEmail}</p>
//             <h2>Save Job Application</h2>
            
//             <label>Role:</label>
//             <input type="text" id="role" placeholder="Job Title"><br>

//             <label>Company:</label>
//             <input type="text" id="company" placeholder="Company Name"><br>

//             <label>Applied Date:</label>
//             <input type="date" id="appliedDate"><br>

//             <label>Location:</label>
//             <select id="location">
//                 <option value="Remote">Remote</option>
//                 <option value="Onsite">Onsite</option>
//                 <option value="Hybrid">Hybrid</option>
//             </select><br>

//             <div id="jobLocationField" style="display: none;">
//                 <label>Job Location:</label>
//                 <input type="text" id="jobLocation" placeholder="Job Location"><br>
//             </div>

//             <button id="saveJob">Save</button>
//         `;

//         document.getElementById("location").addEventListener("change", function () {
//             const jobLocationField = document.getElementById("jobLocationField");
//             jobLocationField.style.display = (this.value === "Onsite" || this.value === "Hybrid") ? "block" : "none";
//         });

//         document.getElementById("saveJob").addEventListener("click", function () {
//             alert("Job Saved! (Implement API Call Here)");
//         });
//     }

//     // Check if user is logged in
//     const token = true
//     if (token) {
//         showJobForm('dharsan001122@gmail.com')
//     } else {
//         showLoginScreen();
//     }
// });

console.log("popup.js loaded");

document.addEventListener("DOMContentLoaded", function () {
    console.log("Popup.html loaded");

    const backendUrl = "http://localhost:8080";
    const appContainer = document.getElementById("app");

    function showSpinner() {
        appContainer.innerHTML = `<div style="text-align: center;"><p>🔄 Loading...</p></div>`;
    }

    // function showLoginScreen() {
    //     appContainer.innerHTML = `
    //         <div style="text-align: center;">
    //             <button id="loginButton">Sign in with Google</button>
    //         </div>
    //     `;

    //     document.getElementById("loginButton").addEventListener("click", function () {
    //         fetch(`${backendUrl}/auth/google`, { method: "GET" })
    //             .then(response => response.json())
    //             .then(data => {
    //                 if (data.auth_url) {
    //                     chrome.tabs.create({ url: data.auth_url }); // Open Google login in a new tab
    //                 } else {
    //                     console.error("No auth_url received from /auth/google");
    //                 }
    //             })
    //             .catch(reason => {
    //                 console.error("Error during authentication:", reason);
    //             });
    //     });
    // }

    function showJobForm(userEmail) {
        appContainer.innerHTML = `
            <p>✅ Logged in as ${userEmail}</p>
            <h2>Save Job Application</h2>
            
            <label>Role:</label>
            <input type="text" id="role" placeholder="Job Title"><br>

            <label>Company:</label>
            <input type="text" id="company" placeholder="Company Name"><br>

            <label>Applied Date:</label>
            <input type="date" id="appliedDate"><br>

            <label>Location:</label>
            <select id="location">
                <option value="Remote">Remote</option>
                <option value="Onsite">Onsite</option>
                <option value="Hybrid">Hybrid</option>
            </select><br>

            <div id="jobLocationField" style="display: none;">
                <label>Job Location:</label>
                <input type="text" id="jobLocation" placeholder="Job Location"><br>
            </div>

            <button id="saveJob">Save</button>
        `;

        chrome.storage.local.get("jobData", (data) => {
            if (data.jobData) {
                document.getElementById("role").value = data.jobData.role || "";
                document.getElementById("company").value = data.jobData.company || "";
                document.getElementById("appliedDate").value = data.jobData.appliedDate || new Date().toISOString().split("T")[0];
                document.getElementById("location").value = data.jobData.location !== 'Remote' ? 'Onsite' : "Remote";
                // if (data.jobData.location === "Onsite" || data.jobData.location === "Hybrid") {
                document.getElementById("jobLocationField").style.display = "block";
                document.getElementById("jobLocation").value = data.jobData.location || "";
                // }
            } else {
                document.getElementById("appliedDate").value = new Date().toISOString().split("T")[0];
                document.getElementById("location").value = 'Onsite';
            }
        });

        document.getElementById("location").addEventListener("change", function () {
            const jobLocationField = document.getElementById("jobLocationField");
            jobLocationField.style.display = (this.value === "Onsite" || this.value === "Hybrid") ? "block" : "none";
        });

        document.getElementById("saveJob").addEventListener("click", function () {
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                const currentTabUrl = tabs[0]?.url || "";

                const data = {
                    role: document.getElementById("role").value,
                    company: document.getElementById("company").value,
                    applied_date: document.getElementById("appliedDate").value,
                    location: document.getElementById("location").value,
                    job_location: document.getElementById("jobLocation").value,
                    job_application_link: currentTabUrl
                };

                fetch(`http://localhost:8080/jobs`, {
                    method: 'POST',
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data),
                })
                .then(() => {
                    alert("Job Data added to sheets successfully");
                })
                .catch(() => {
                    alert("Error in adding job data to sheets. Please try again");
                })
                .finally(() => {
                    document.getElementById("role").value = "";
                    document.getElementById("company").value = "";
                    document.getElementById("appliedDate").value = new Date().toISOString().split("T")[0];
                    document.getElementById("location").value = "Remote";
                    document.getElementById("jobLocationField").style.display = "none";
                    document.getElementById("jobLocation").value = "";
                });
            });
            fetch(`http://localhost:8080/jobs`, {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            })
            .then(() => {
                alert("Job Data added to sheets successfully")
            }).catch(() => {
                alert("Error in adding job data to sheets. Please try again")
            })
        });
    }

    // function checkUserAuth() {
    //     showSpinner();

    //     chrome.storage.local.get("authToken", function (data) {
    //         if (!data?.authToken) {
    //             showLoginScreen();
    //             return;
    //         }

    //         fetch(`${backendUrl}/user`, {
    //             method: "GET",
    //             headers: { Authorization: `Bearer ${data?.authToken}` }
    //         })
    //         .then(response => {
    //             response.ok ? response.json() : Promise.reject("Invalid Token")
    //         })
    //         .then(data => showJobForm(data.email))
    //         .catch(() => {
    //             chrome.storage.local.remove("token", function () {
    //                 showLoginScreen();
    //             });
    //         });
    //     });
    // }

    // Listen for authentication success message
    // chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    //     if (message.type === "AUTH_SUCCESS") {
    //         console.log("Received token:", message.token);

    //         // Store token in Chrome extension storage
    //         chrome.storage.local.set({ token: message.token }, function () {
    //             console.log("Token stored successfully.");
    //             checkUserAuth();
    //         });
    //     }
    // });

    // checkUserAuth();

    showJobForm("dharsan001122@gmail.com")
});
