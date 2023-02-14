let word = "Loading ...";
let definition = "Loading ...";
const wordElement = document.getElementById("word");
const definitionAreaElement = document.getElementById("definitionArea");

document.addEventListener("DOMContentLoaded", async () => {
	wordElement.innerText = word;
	definitionAreaElement.innerText = definition;

	const tabId = await getActiveTabId();

	chrome.tabs.sendMessage(tabId, { TYPE: "GET_WORD" }, (response) => {
		word = response.word;
		wordElement.innerText = word;
	});

	setTimeout(() => {
		chrome.runtime.sendMessage(
			{ TYPE: "GET_DEFINITION", word },
			(response) => {
				try {
					response.definition.forEach((def) => {
						const parsedDefinition = parseDefinition(word, def);
						const definitionElement = document.createElement("div");
						definitionElement.classList.add("definition");
						definitionElement.innerHTML = `
						<div class="type">${parsedDefinition.type}</div>
						<label class="label">Definition</label>
						<div class="definitions">${parsedDefinition.definitions
							.map(
								(def) => `<div class="single-definition">${def}</div>`,
							)
							.join("")}</div>
						<label class="label">Examples</label>
						<div class="examples">${parsedDefinition.examples
							.map(
								(example) =>
									`<div class="example">${example}</div>`,
							)
							.join("")}</div>
					`;

						definitionAreaElement.innerHTML = "";
						definitionAreaElement.appendChild(definitionElement);
					});
				} catch (e) {
					definitionAreaElement.innerText =
						"No definition found in Wiktionary";
				}
			},
		);
	}, 100);
});

const getActiveTabId = async () => {
	const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
	return tabs[0].id;
};

const parseDefinition = (mainWord, definition) => {
	const definitions = definition.text.filter((def) => {
		const mainWordTrimmed = mainWord.replace(/\s/g, "");
		if (!def.includes(mainWordTrimmed)) return true;
	});
	const type = definition.partOfSpeech;
	const examples = definition.examples.map((example) => {
		return example;
	});

	return {
		definitions,
		type,
		examples,
	};
};
