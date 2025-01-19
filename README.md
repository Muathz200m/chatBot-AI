# chatBot-AI

ChatBot using Gemini 1.5-flash

**WARNING!**
YOU SHOULDN'T DEPLOY THE PROJECT WITHOUT HIDING THE API KEY THROUGH `.ENV` OR ANY OTHER WAY. PLEASE DO NOT DEPLOY FOR PUBLIC USE BEFORE ENSURING THIS. THIS IS ONLY FOR TESTING AND DEVELOPMENT.

This is a simple chatbot application that uses the Google Cloud API to generate responses. The chatbot allows users to send messages and upload images, and it responds with generated text content.

- `index.html`: The main HTML file that contains the structure of the chatbot interface.
- `style.css`: The CSS file that styles the chatbot interface.
- `script.js`: The JavaScript file that handles the chatbot logic and interactions.

## Setup

1. Clone the repository to your local machine.
2. Open the project directory in your preferred code editor.

## Usage

1. Open `index.html` in your web browser to view the chatbot interface.
2. Click the chatbot toggle button to open the chatbot popup.
3. Enter your message in the input field and press Enter or click the send button to send the message.
4. Optionally, you can upload an image by clicking the attach file button.

## Configuration

To use the project, you need to provide your own API key. Follow these steps to set up your API key:

1. Go to the [Google Cloud API Key](https://ai.google.dev/gemini-api/docs/api-key).
2. Generate an API key for your project.
3. Replace the placeholder API key in `script.js` with your own API key:

```javascript
// API Key for the Google Cloud API
const GOOGLE_API_KEY = "YOUR_API_KEY_HERE"; // Replace with your API key
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GOOGLE_API_KEY}`;
