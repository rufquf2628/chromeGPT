const apiKey = 'OPENAPI';

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
                    'Authorization': `Bearer ${apiKey}`,
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
                    console.error('Error:', error);
                });
        }
    });
});