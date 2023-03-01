apiKey = "";

let summarizeTextOption = {
    "id": "summarizeText",
    "title": "Summarize Text",
    "contexts": ["selection"],
};

chrome.contextMenus.create(summarizeTextOption);

chrome.contextMenus.onClicked.addListener(function(clickEventInfo) {
    if (clickEventInfo.menuItemId === "summarizeText") {
        summarizeText();
    }
});

function displaySummaryWindow(summarizedText) {
    chrome.windows.create({
        url: "summary_window.html?textSummarized=" + encodeURIComponent(summarizedText),
        type: "popup",
        width: 500,
        height: 300
    });
}

function captureHighlightedText() {
    var highlightedText = window.getSelection().toString();
    return highlightedText;
}

async function summarizeText() {
    var prompt = "Summarize this text: ";
    var textToSummarize = captureHighlightedText();

    const response = await fetch('https://api.openai.com/v1/engines/text-davinci-003/jobs', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            "prompt": prompt + textToSummarize,
            "max_tokens": 50,
            "temperature": 0.5
        })
    });

    if (!response.ok) {
        throw new Error("Failed to summarize text");
    }

    const data = await response.json();
    const textSummarized = data.choices[0].text;

    displaySummaryWindow(textSummarized);
}