const messageInput = document.querySelector(".message-input");

// cancel file upload button event listener
const fileCancelButton = document.querySelector("#file-cancel");
fileCancelButton.addEventListener("click", () => {
  // Add an event listener to the file cancel button
  userData.files = {}; // Clear the file data in the userData object
  fileUploadWrapper.classList.remove("file-uploaded"); // Add the file-uploaded class to the file upload wrapper
});

const fileInput = document.querySelector("#file-input");

document
  .querySelector("#file-upload")
  .addEventListener("click", () => fileInput.click());

const fileUploadWrapper = document.querySelector(".file-upload-wrapper");

//handle file input change event to read the file content and display the image
fileInput.addEventListener("change", () => {
  const file = fileInput.files[0];
  if (!file) return; // Exit if no file selected

  const reader = new FileReader(); // Create a new FileReader object to read the file content
  reader.onload = (e) => {
    fileUploadWrapper.querySelector("img").src = e.target.result; // Display the selected image 49:39
    fileUploadWrapper.classList.add("file-uploaded"); // Add the file-uploaded class to the file upload wrapper
    const base64String = e.target.result.split(",")[1]; // Extract the base64 string from the data URL

    userData.files = {
      // Store the file data in the userData object
      data: base64String,
      mime_type: file.type,
    };
    /*    // Display the selected image
        console.log(userData); */

    fileInput.value = ""; // Clear the file input
  };
  reader.readAsDataURL(file); // Read the file as a data URL
});

// API Key for the Google Cloud API
const GOOGLE_API_KEY = ""; // Replace with your API key
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GOOGLE_API_KEY}`;

const userData = {
  messages: [], // Array to store all messages
  files: {
    data: null,
    mime_type: null,
  },
};

const chatHistory = [];

// Function to generate bot response using the Google Cloud API
const generateBotResponse = async (messageDiv) => {
  const chatBody = document.querySelector(".chat-body"); // Define chatBody
  const messageElement = messageDiv.querySelector(".message-text");
  // add user message to chat history
  chatHistory.push({
    role: "user",
    parts: [
      { text: userData.messages.join("\n") },
      ...(userData.files.data ? [{ inline_data: userData.files }] : []),
    ],
  });
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: chatHistory,
    }),
  };

  // Fetch the response from the Google Cloud API
  try {
    const response = await fetch(API_URL, requestOptions);
    const data = await response.json();
    if (!response.ok) throw new Error(data.error.message); // Corrected error access

    // Extract the response text from the API response
    let apiResponseText = data.candidates[0].content.parts[0].text
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .trim();

    // **Process the response text to preserve formatting**
    // Replace newline characters with <br> tags
    apiResponseText = apiResponseText.replace(/\n/g, "<br>");

    // Optional: Handle multiple spaces
    apiResponseText = apiResponseText.replace(/  /g, " &nbsp;");

    // Append the bot's response to the messages array
    userData.messages.push(apiResponseText); // Store bot message
    // add bot message to chat history
    chatHistory.push({
      role: "model",
      parts: [{ text: userData.messages.join("\n") }],
    });

    // Set the processed text as innerHTML
    messageElement.innerHTML = apiResponseText;
  } catch (error) {
    messageElement.style.color = "red";
    messageElement.innerHTML = `Sorry, something went wrong. ${error.message}`;
  } finally {
    userData.files = {};
    // Remove the thinking indicator and scroll
    const thinkingIndicator = messageDiv.querySelector(".thinking-indicator");
    if (thinkingIndicator) {
      thinkingIndicator.remove();
    }
    chatBody.scrollTop = chatBody.scrollHeight; // Scroll to the bottom
  }
};

// Function to handle outgoing messages
const handleOutgoingMessage = (e) => {
  e.preventDefault();

  const message = messageInput.value.trim();
  if (!message) return; // Exit if the message is empty

  // Push the new message to the messages array
  userData.messages.push(message);

  // Create user message element
  const chatBody = document.querySelector(".chat-body");
  const messageDiv = document.createElement("div");
  messageDiv.classList.add("message", "user-message");
  messageDiv.innerHTML = `
        <div class="message-text">${message}</div>
        ${
          userData.files.data
            ? `<img src="data:${userData.files.mime_type};base64,${userData.files.data}" class="attachment" />`
            : ""
        } `; // Display the image if available
  chatBody.appendChild(messageDiv); // Append the message to the chat body
  chatBody.scrollTop = chatBody.scrollHeight; // Scroll to the bottom

  // Clear the textarea
  messageInput.value = "";
  fileUploadWrapper.classList.remove("file-uploaded"); // Remove the file-uploaded

  // Display bot's thinking indicator after a brief delay
  setTimeout(displayBotThinking, 500); // 500ms delay
};

// Handle the keydown event on the input field for sending messages
document.addEventListener("DOMContentLoaded", () => {
  messageInput.addEventListener("keydown", (e) => {
    const userMessage = e.target.value.trim();
    if (e.key === "Enter" && userMessage) {
      handleOutgoingMessage(e);
    }
  });
});

// Select the chat form
const chatForm = document.querySelector(".chat-form");

// Handle form submission for sending messages
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const userMessage = messageInput.value.trim();
  if (userMessage) {
    handleOutgoingMessage(e);
  }
});

// Function to display bot's thinking indicator
const displayBotThinking = () => {
  const chatBody = document.querySelector(".chat-body");
  const messageDiv = document.createElement("div");
  messageDiv.classList.add("message", "bot-message");
  messageDiv.innerHTML = `
        <div class="bot-icon">
            <!-- Bot SVG Icon -->
             <svg
          xmlns="http://www.w3.org/2000/svg"
          width="50"
          height="50"
          viewBox="0 0 1024 1024"
        >
          <path
            d="M738.3 287.6H285.7c-59 0-106.8 47.8-106.8 106.8v303.1c0 59 47.8 106.8 106.8 106.8h81.5v111.1c0 .7.8 1.1 1.4.7l166.9-110.6 41.8-.8h117.4l43.6-.4c59 0 106.8-47.8 106.8-106.8V394.5c0-59-47.8-106.9-106.8-106.9zM351.7 448.2c0-29.5 23.9-53.5 53.5-53.5s53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5-53.5-23.9-53.5-53.5zm157.9 267.1c-67.8 0-123.8-47.5-132.3-109h264.6c-8.6 61.5-64.5 109-132.3 109zm110-213.7c-29.5 0-53.5-23.9-53.5-53.5s23.9-53.5 53.5-53.5 53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5zM867.2 644.5V453.1h26.5c19.4 0 35.1 15.7 35.1 35.1v121.1c0 19.4-15.7 35.1-35.1 35.1h-26.5zM95.2 609.4V488.2c0-19.4 15.7-35.1 35.1-35.1h26.5v191.3h-26.5c-19.4 0-35.1-15.7-35.1-35.1zM561.5 149.6c0 23.4-15.6 43.3-36.9 49.7v44.9h-30v-44.9c-21.4-6.5-36.9-26.3-36.9-49.7 0-28.6 23.3-51.9 51.9-51.9s51.9 23.3 51.9 51.9z"
          ></path>
        </svg>
        </div>
        <div class="message-text">
            <div class="thinking-indicator">
                <div class="dot"></div>
                <div class="dot"></div>
                <div class="dot"></div>
            </div>
        </div>
    `;
  chatBody.appendChild(messageDiv);
  chatBody.scrollTop = chatBody.scrollHeight; // Scroll to the bottom of the chat body
  generateBotResponse(messageDiv);
};

// toggle the chatbot popup when clicked
const chatbotToggler = document.querySelector("#chatbot-toggler");
chatbotToggler.addEventListener("click", () =>
  document.body.classList.toggle("show-chatbot")
);
