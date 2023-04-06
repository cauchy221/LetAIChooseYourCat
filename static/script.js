document.getElementById('user-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    // 显示等待动画
    const loading = document.getElementById('loading');
    const progressBar = document.getElementsByClassName('progress-bar');
    loading.style.display = 'block';
    
    // 生成结果
    const username = document.getElementById('username').value;
    const favoriteColor = document.getElementById('favoriteColor').value;
    const favoriteTaste = document.getElementById('favoriteTaste').value;
    const musicType = document.getElementById('musicType').value;
    const relaxationMethod = document.getElementById('relaxationMethod').value;

    const catData = await generateCatData(username, favoriteColor, favoriteTaste, musicType, relaxationMethod);
    const translatedCatData = await translateCatData(catData);
    const catImage = await generateCatImage(translatedCatData);

    // 隐藏等待动画
    setTimeout(function () {
        loading.style.display = 'none';
    }, 1000);

    // 显示结果
    setTimeout(displayResult(catData, catImage), 1000);
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
        <style>
            .cat_data {
                width: 50%;
                margin: 0 auto;
            }
        </style>
        <h2>你的小猫：</h2>
        <img src=${catImage} alt="cat image" width="10%" height="10%">
        <div class="cat_data">${catData}</div>
    `;
}