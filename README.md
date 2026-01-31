# 📘 Prompt Quality Evaluator
A Chrome extension that evaluates the quality of prompts **while you type** in ChatGPT and provides real-time feedback with actionable suggestions — without changing your workflow.

## 🧠 Overview
Prompt Quality Evaluator is designed to help users write **clearer, more effective prompts** for Large Language Models (LLMs).

Instead of manually asking an LLM to rate your prompt, this extension **silently evaluates prompt structure in real time** and displays feedback directly inside the ChatGPT interface.

## ✨ Features
- 📊 Real-time prompt quality evaluation  
- 🧠 Hybrid scoring (rule-based + LLM-powered)  
- 💡 Click-to-view improvement suggestions  
- 🎨 Clean, non-intrusive UI badge  
- 🧩 Works directly inside ChatGPT  
- ⌨️ Toggle ON/OFF using **Ctrl + Q**  
- ☁️ Backend deployed using **FastAPI**


## 🏗️ Tech Stack

### Frontend
- JavaScript  
- Chrome Extensions API  

### Backend
- Python  
- FastAPI  
- LLM-based evaluation logic  

### Deployment
- Render (Backend API)

## 🧩 Installing the Chrome Extension (Step-by-Step)

> The extension is currently distributed in **developer mode**.

### Step 1: Clone the repository

```bash
git clone https://github.com/deepesht306-cmd/prompt-quality-evaluator.git

```
### Step 2: Open Chrome Extensions page
Go to:

```bash
chrome://extensions
```

### Step 3: Enable Developer Mode
Turn ON the Developer mode toggle (top-right corner)

### Step 4: Load the extension
Click Load unpacked
Select the extension/ folder from the project

## 📁 Important:
Do NOT select the root project folder.
Select only the extension directory.

## Step 5: Start using it
Open ChatGPT
Start typing a prompt
A quality badge appears below the input box
Click the badge to view improvement suggestions

## ⌨️ Controls
Ctrl + Q → Toggle the extension ON / OFF

## 🔄 Updating the Extension
If you pull new updates:
- Go to chrome://extensions
- Click Reload on the extension card

## 🧪 How It Works
The extension detects user input inside ChatGPT
The prompt is evaluated after typing stops (debounced)
The backend scores:
- Clarity
- Depth
- Specificity

Results are sent back to the extension
A contextual badge and suggestion tooltip are displayed

## 🔐 Privacy & Ethics
- Prompts are not stored.
- No user data is collected.
- Evaluation focuses on question structure, not user intelligence.
- Suggestions are advisory, not prescriptive.

## 📌 Project Status
MVP Complete – Actively usable

## Planned future improvements:
- Chrome Web Store publishing.
- Settings panel.
- Multi-LLM support.
- UI customization.

## 🙌 Acknowledgements
Built as a learning-focused AI product combining:
- Backend API design
- Browser extension architecture
- UX-driven AI feedback
