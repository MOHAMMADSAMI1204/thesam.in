document.querySelector(".form-container.sign-in form").addEventListener("submit", function (e) {
    e.preventDefault();

    const edition = document.getElementById("edition").value;
    const selectValue = document.querySelector("select[name='Select']").value; // Get the selected value
    const usernameField = document.querySelector("input[name='minecraft-username']");
    const youtubeUsername = document.querySelector("input[name='youtube-username']").value;
    const imageUpload = document.querySelector("input[name='profile-image']").files[0];
    const submitButton = document.querySelector(".form-container.sign-in button");
    const messageDiv = document.createElement("div");
    messageDiv.id = "message";
    document.body.appendChild(messageDiv);

    let formattedUsername = usernameField.value;

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

                sendToDiscord(formData, formattedUsername, youtubeUsername, edition, selectValue); // Pass selectValue
            }, "image/png");
        };
    };
    reader.readAsDataURL(imageUpload);

    submitButton.disabled = true;
    submitButton.style.backgroundColor = "grey";
});

// Update the sendToDiscord function
function sendToDiscord(imageBlob, formattedUsername, youtubeUsername, edition, selectValue) {
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
                    { name: "**YouTube Username**", value: youtubeUsername, inline: false }
                    
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
            displayEmbedOnWebsite(youtubeUsername, formattedUsername, edition);
        })
        .catch(error => {
            document.getElementById("message").innerHTML = "Error: " + error.message;
            const submitButton = document.querySelector(".form-container.sign-in button");
            submitButton.disabled = false;
            submitButton.style.backgroundColor = "#4CAF50";
        });
}

// Select the form and result display element
const form = document.getElementById('form-container.sign-in form');
const resultDiv = document.querySelector('.result');
const button = form.querySelector('button[type="submit"]');

// Add a submit event listener to the form
form.addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent the default form submission

    // Disable the button to prevent multiple clicks
    button.disabled = true;

    // Change button color to gray
    button.classList.add('button-disabled');

    // Collect form data
    const formData = new FormData(form);
    const details = Array.from(formData.entries())
        .map(([key, value]) => `${key}: ${value}`)
        .join('<br>');

    // Show results after a 10-second delay
    setTimeout(() => {
        // Clear the form fields
        form.reset();

        // Prepare result content
        const resultMessage = Math.random() > 0.5 ? 'Successful' : 'Failed';
        resultDiv.innerHTML = `
            <h3>Submission ${resultMessage}</h3>
            <div>${details}</div>
        `;

        // Display the results with a slide-up effect
        resultDiv.classList.add('show');

        // Re-enable the button and reset color
        button.disabled = false;
        button.classList.remove('button-disabled');
    }, 50000); // 10 seconds delay
});
