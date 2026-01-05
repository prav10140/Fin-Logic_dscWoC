# Fin-Logic: Dark Pattern & Fine Print Detector

A prototype web application that analyzes documents (PDF/Images) to detect risky clauses, hidden fees, and dark patterns using OCR and AI analysis.

## Features
- **OCR Integration**: Extracts text from images/PDFs using Tesseract.js.
- **Risk Detection**: Identifies hidden fees, auto-renewal traps, and variable interest rates.
- **Explainable AI**: Provides "Why it's risky", "Future Loss Simulator", and "Safer Rewrites".
- **Modern UI**: Clean, dark-themed interface.

## Prerequisites
- Node.js (v14 or higher)
- npm

## Setup & Run

1.  **Install Dependencies**
    ```bash
    npm install
    ```

2.  **Start the Server**
    ```bash
    node server.js
    ```
    You should see: `Server running at http://localhost:3000`

3.  **Usage**
    - Open `http://localhost:3000` in your browser.
    - Drag & drop an image or PDF containing text (e.g., a contract screenshot).
    - Click **Analyze**.
    - View the detected risks and analysis cards.

## Configuration
- **Firebase**: Currently using a placeholder. To enable, uncomment code in `firebase-config.js` and add your `serviceAccountKey.json`.
- **LLM**: Currently using a rule-based placeholder in `analysis.js`. Replace with actual API calls (e.g., Gemini API) for production.

## Disclaimer
**Informational Only.** This tool does not provide legal advice.
