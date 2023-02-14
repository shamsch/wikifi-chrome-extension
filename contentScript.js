console.log("content script loaded");
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	if (request.TYPE == "GET_WORD") {
		const word = document.getSelection().toString();
		if (word.length > 0) {
			sendResponse({ word });
		} else {
			sendResponse({ word: "ei" });
		}
	}
	sendResponse({ word: "sana" });
});
