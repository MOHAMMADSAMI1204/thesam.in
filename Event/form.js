document.querySelector(".form-container.sign-in form").addEventListener("submit", function (e) {
    e.preventDefault(); // Prevent the default form submission

    const edition = document.getElementById("edition").value;
    const selectValue = document.querySelector("select[name='Select']").value; // Get the selected value
    const usernameField = document.querySelector("input[name='minecraft-username']");
    const youtubeUsername = document.querySelector("input[name='youtube-username']").value;
    const youtubeCoins = document.querySelector("input[name='youtube-coins']").value; // Get YouTube coins value
    const imageUpload = document.querySelector("input[name='profile-image']").files[0];
    const submitButton = document.querySelector(".form-container.sign-in button");
    const messageDiv = document.createElement("div");
    messageDiv.id = "message";
    document.body.appendChild(messageDiv);

    // Disable the submit button immediately to prevent multiple clicks
    submitButton.disabled = true;

    // JSS approach to modify the button's appearance
    submitButton.style.backgroundColor = "grey"; // Change button color to indicate it's disabled
    submitButton.style.cursor = "not-allowed"; // Change cursor to not-allowed
    submitButton.innerText = "Submited"; // Optional: change button text to "Submitting..."

    let formattedUsername = usernameField.value;

    // Format Minecraft username based on edition
    if (edition === "Pocket" || edition === "Bedrock") {
        if (!formattedUsername.startsWith(".")) {
            formattedUsername = `.${formattedUsername}`;
        }
    } else {
        if (formattedUsername.startsWith(".")) {
            formattedUsername = formattedUsername.substring(1);
        }
    }

    usernameField.value = formattedUsername;

    const reader = new FileReader();
    reader.onload = function (event) {
        const img = new Image();
        img.src = event.target.result;
        img.onload = function () {
            const canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0);

            canvas.toBlob(function (blob) {
                const formData = new FormData();
                formData.append("file", blob, "image.png");

                sendToDiscord(formData, formattedUsername, youtubeUsername, youtubeCoins, edition, selectValue); // Pass youtubeCoins as well
            }, "image/png");
        };
    };
    reader.readAsDataURL(imageUpload);

    // Optionally, disable the submit button for a longer time (e.g., 5 minutes) after the form submission
    setTimeout(function () {
        submitButton.disabled = false;
        submitButton.style.backgroundColor = "#4CAF50"; // Re-enable the button and reset color
        submitButton.style.cursor = "pointer"; // Reset cursor to pointer
        submitButton.innerText = "Submit"; // Reset button text
    }, 300000); // 5 minutes in milliseconds
});

// Function to display all the submitted details with the server info
function displaySubmissionDetails(formattedUsername, youtubeUsername, youtubeCoins, edition, selectValue) {
    const resultDiv = document.querySelector('.result');
    const resultMessage = `
        <h3>Submission Successful</h3>
        <div>
            <p><strong>YouTube Username:</strong> ${youtubeUsername}</p>
            <p><strong>Minecraft Username:</strong> ${formattedUsername}</p>
            <p><strong>Minecraft Edition:</strong> ${edition}</p>
            <p><strong>YouTube Coins:</strong> ${youtubeCoins}</p>
            <p><strong>Server IP:</strong> mc.thesam.in</p>
            <p><strong>Server Port:</strong> 25778</p>
        </div>
    `;
    resultDiv.innerHTML = resultMessage;
    resultDiv.classList.add('show'); // Make the result visible
}

// Update the sendToDiscord function to include youtubeCoins
function sendToDiscord(imageBlob, formattedUsername, youtubeUsername, youtubeCoins, edition, selectValue) {
    const webhookURL = "https://discord.com/api/webhooks/1312804695185686658/iv-tCoqFL0FB3WetRG7GPfNmMzpNe17m1S5YNDQiJ5R-XPcvnn3jiMprF1wm4qGM_Ilj";

    const title = selectValue === "Whitelist" ? "Whitelist Request" : "Coins Request";

    const payload = {
        content: `<@&1216145532859191467>`, // Mention the specific role ID
        embeds: [
            {
                title: title,
                fields: [
                    { name: "**Minecraft Edition**", value: edition, inline: false },
                    { name: "**Minecraft Username**", value: formattedUsername, inline: false },
                    { name: "**YouTube Username**", value: youtubeUsername, inline: false },
                    { name: "**YouTube Coins**", value: youtubeCoins, inline: false } // Add the YouTube Coins to the embed
                ],
                color: 117505,
                image: {
                    url: "attachment://image.png" // Attach image by filename
                }
            }
        ],
    };

    fetch(webhookURL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to send message to Discord");
            }
            return fetch(webhookURL, {
                method: "POST",
                body: imageBlob
            });
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to send image to Discord");
            }
            displayEmbedOnWebsite(youtubeUsername, formattedUsername, edition, youtubeCoins);
        })
        .catch(error => {
            document.getElementById("message").innerHTML = "Error: " + error.message;
            const submitButton = document.querySelector(".form-container.sign-in button");
            submitButton.disabled = false;
            submitButton.style.backgroundColor = "#4CAF50";
        });
}

// Add a function to display the result on the website
function displayEmbedOnWebsite(youtubeUsername, formattedUsername, edition, youtubeCoins) {
    const resultDiv = document.querySelector('.result');
    const resultMessage = `
        <h3>Submission Successful</h3>
        <div>
            <p>YouTube Username: ${youtubeUsername}</p>
            <p>Minecraft Username: ${formattedUsername}</p>
            <p>Edition: ${edition}</p>
            <p>YouTube Coins: ${youtubeCoins}</p>
        </div>
    `;
    resultDiv.innerHTML = resultMessage;
    resultDiv.classList.add('show');
}
