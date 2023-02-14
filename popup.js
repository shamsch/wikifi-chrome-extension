let word = "Loading ...";
let definition = "Loading ...";
const wordElement = document.getElementById("word");
const definitionElement = document.getElementById("definition");

document.addEventListener("DOMContentLoaded", async () => {
	wordElement.innerText = word;
	definitionElement.innerText = definition;

	const tabId = await getActiveTabId();

	chrome.tabs.sendMessage(tabId, { TYPE: "GET_WORD" }, (response) => {
		word = response.word;
		wordElement.innerText = word;
	});

	setTimeout(() => {
		chrome.runtime.sendMessage(
			{ TYPE: "GET_DEFINITION", word },
			(response) => {
				definition = response.definition;
				definitionElement.innerText = definition;
			},
		);
	}, 100);
});

const getActiveTabId = async () => {
	const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
	return tabs[0].id;
};
