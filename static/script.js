document.getElementById('user-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const favoriteColor = document.getElementById('favoriteColor').value;
    const favoriteTaste = document.getElementById('favoriteTaste').value;
    const musicType = document.getElementById('musicType').value;
    const relaxationMethod = document.getElementById('relaxationMethod').value;

    const catData = await generateCatData(username, favoriteColor, favoriteTaste, musicType, relaxationMethod);
    const translatedCatData = await translateCatData(catData);
    const catImage = await generateCatImage(translatedCatData);

    displayResult(catData, catImage);
    // displayResult(catData);
});

async function generateCatData(username, favoriteColor, favoriteTaste, musicType, relaxationMethod) {
    // 调用Flask后端
    const response = await fetch('/generate-cat-data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: username,
            favoriteColor: favoriteColor,
            favoriteTaste: favoriteTaste,
            musicType: musicType,
            relaxationMethod: relaxationMethod
        }),
    });

    const data = await response.json();
    return data['content'];
}

async function translateCatData(catData) {
    // 调用Flask后端
    const response = await fetch('/translate-cat-data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            catData: catData
        }),
    });

    const data = await response.json();
    return data['content'];
}

async function generateCatImage(translatedCatData) {
    // 调用Flask后端
    const response = await fetch('/generate-cat-image', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            translatedCatData: translatedCatData
        }),
    });

    const data = await response.json();
    return data['content'];
}

function displayResult(catData, catImage) {
    const resultDiv = document.getElementById('cat-result');
    catData = catData.replace(/\n/g, '<br/>');
    resultDiv.innerHTML = `
        <h2>你的小猫：</h2>
        <img src=${catImage} alt="cat image" width="15%" height="15%">
        <div>${catData}</div>
    `;
}