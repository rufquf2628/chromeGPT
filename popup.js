const openai_apiKey = 'OPENAI_KEY';
const youtube_apiKey = 'YOUTUBE_KEY';
const client_id = 'CLIENT_ID'

chrome.tabs.query({active: true, lastFocusedWindow: true}, async tabs => {
    let url = tabs[0].url;
    const videoId = extractID(url);
    let id = '';

    await fetch(`https://www.googleapis.com/youtube/v3/captions?part=snippet&videoId=${videoId}&key=${youtube_apiKey}`)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            console.log(data.items[0].id)
            id = data.items[0].id;
        })
        .catch(error => console.error('Error fetching captions:', error));

    if (id !== '') {
        await fetch(`https://youtube.googleapis.com/youtube/v3/captions/${id}?key=[${youtube_apiKey}]`)
            .then(response => response.json())
            .then(data => {
                console.log(data)
            })
            .catch(error => console.error('Error downloading captions:', error));
    }
});

function extractID(url) {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match&&match[7].length===11)? match[7] : false;
}

document.addEventListener('DOMContentLoaded', () => {
    const sendButton = document.getElementById('input-button');
    const userInput = document.getElementById('input-box');
    const responseDiv = document.getElementById('msg-response');

    sendButton.addEventListener('click', () => {
        const userMessage = userInput.value.trim();
        if (userMessage !== '') {

            const requestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${openai_apiKey}`,
                },
                body: JSON.stringify(
                    { "model": "gpt-3.5-turbo", messages: [{"role": "user", "content": userMessage}]}
                ),
            };

            console.log(requestOptions)

            fetch('https://api.openai.com/v1/chat/completions', requestOptions)
                .then(response => response.json())
                .then(data => {
                    responseDiv.textContent = data.choices[0].message.content;
                    console.log(data.choices[0].message.content)
                })
                .catch(error => {
                    console.error('Error getting response from GPT:', error);
                });
        }
    });
});

