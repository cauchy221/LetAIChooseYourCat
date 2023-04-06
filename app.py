import time
from flask import Flask, request, jsonify, render_template
import requests
import openai
from openai.error import RateLimitError

app = Flask(__name__)
openai.api_key = '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'

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/generate-cat-data', methods=['GET','POST'])
def generate_cat_data():
    data = request.json
    username = data['username']
    favorite_color = data['favoriteColor']
    favorite_taste = data['favoriteTaste']
    music_type = data['musicType']
    relaxation_method = data['relaxationMethod']

    # 调用GPT API
    user_input = f"假装你是一个魔法师，请根据以下个人信息，为我在多元宇宙中选出最适合我的一只虚拟小猫（根据相关描述用最强大的想象力进行富有创意的生成）：\
                我的名字是{username}，我最喜欢的颜色是{favorite_color}，我最喜欢吃{favorite_taste}，我平时爱听{music_type}，周末我会{relaxation_method}来放松自己。\
                请为我选出一只最适合我的小猫，并按照以下的格式进行回复（不要输出其它信息）：小猫姓名：\n来自的星球：\n毛色：\n擅长的事情：\n小猫的口头禅：\n"
    message = [{"role": "user", "content": user_input}]

    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo", 
            messages=message
        )
        content = response.choices[0].message["content"]
    except RateLimitError:
        content = "服务器请求次数过多，请稍后重新尝试。"

    return jsonify(content=content)

@app.route('/translate-cat-data', methods=['GET','POST'])
def translate_cat_data():
    data = request.json
    catData = data['catData']

    # 调用GPT API
    user_input = f"将下面的内容翻译为英文：\n{catData}"
    message = [{"role": "user", "content": user_input}]

    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo", 
            messages=message
        )
        content = response.choices[0].message["content"]
    except RateLimitError:
        content = "服务器请求次数过多，请稍后重新尝试。"

    return jsonify(content=content)

@app.route('/generate-cat-image', methods=['GET', 'POST'])
def generate_cat_image():
    # 调用stable diffusion API
    data = request.json
    translatedCatData = data['translatedCatData']
    SD_data = {
        "key": "bD9pVuCJ2jo438mqN3mMN1dy4DHUxoh6KAiMjH1mUAzp4JZVmPV7GOAfU0TX", 
        "prompt": f"Generate a 2d, pixel art, cartoon cat image using imagination and creativity based on the following description:\n{translatedCatData}",
        "width": "512",
        "height": "512",
        "samples": "1"
    }
    response = requests.post("https://stablediffusionapi.com/api/v3/text2img", data=SD_data)
    status = response.json()['status']
    url = response.json()['fetch_result']
    while status == 'processing':
        time.sleep(1)
        response = requests.post(url=url, data=SD_data)
        status = response.json()['status']
    return jsonify(content=response.json()['output'][0])


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=9000)