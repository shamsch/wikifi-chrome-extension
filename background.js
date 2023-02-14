const header = {
	"Content-Type": "application/json",
	"x-api-key": "x-api-key",
};

const url =
	"https://get-the-api.com/prod/word/";

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if (request.TYPE == "GET_DEFINITION") {
		const word = request.word;
		let wordWithoutSpaces = word.replace(/\s/g, "");

		const body = {
			word: wordWithoutSpaces,
		};

		fetch(url, {
			method: "POST",
			headers: header,
			body: JSON.stringify(body),
		})
			.then((response) => {
				return response.json();
			})
			.then((json) => {
				console.log(json[0].definitions[0].text[1]);

				sendResponse({ definition: json[0].definitions[0].text[1] });
			})
			.catch((error) => {
				sendResponse({ definition: "error" });
			});
	}
	return true;
});
