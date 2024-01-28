from flask import Flask, render_template, send_from_directory
from vision import call_vision_api
#from spotifyrec import get_track_list
import os
import json
import requests
from flask import jsonify

kintone_api_key = os.getenv('KINTONE_API_KEY')

app = Flask(__name__, static_folder='./frontend')

user_id = None
spotify_code = None
spotify_state = None

base_url = "https://katarinaav.kintone.com"
app_id = "2"
add_record_endpoint = f'{base_url}/k/v1/record.json'
retrieve_records_endpoint = f'{base_url}/k/v1/records.json'
add_record_headers = {
    'X-Cybozu-API-Token': kintone_api_key,
    'Content-Type': 'application/json'
}
retrieve_records_headers = {
    'X-Cybozu-API-Token': kintone_api_key
}
params = {
        "app": app_id,
        "query": f"user = {user_id}"
}

@app.route('/login')
def login(login_info):
    global user_id, spotify_code, spotify_state
    user_id = login_info.get('user')
    spotify_code = login_info.get('spotify_code')
    spotify_state = login_info.get('spotify_state')


@app.route('/upload_images')
def upload_images(img_data):
    file_urls = img_data.get('file_urls')
    album = img_data.get('album')
    # Rest of the code remains the same
    for file_url in file_urls:
        emotion = call_vision_api(file_url=file_url)
        payload = {
            "app": app_id,
            "record": {
                "user": {"value": user_id},
                "spotify_code": {"value": spotify_code},
                "spotify_state": {"value": spotify_state},
                "album": {"value": album}, 
                "image": {"value": file_url},
                "emotion": {"value": emotion},  
                "spotify": {"value": ""}  
            }
        }
        response = requests.post(add_record_endpoint, headers=add_record_headers, data=json.dumps(payload))
        
        # Rest of the code remains the same
    for file_url in file_urls:
        emotion = call_vision_api(file_url=file_url)
        payload = {
            "app": app_id,
            "record": {
                "user": {"value": user_id},
                "spotify_code": {"value": spotify_code},
                "spotify_state": {"value": spotify_state},
                "album": {"value": album}, 
                "image": {"value": file_url},
                "emotion": {"value": emotion},  
                "spotify": {"value": ""}  
            }
        }
        response = requests.post(add_record_endpoint, headers=add_record_headers, data=json.dumps(payload))

        if response.status_code == 200:
            print("Record added successfully.")
        else:
            print(f"Error: {response.status_code} - {response.text}")

    response = requests.get(retrieve_records_endpoint, headers=retrieve_records_headers, params=params)
    data = response.json()
    
    emotion_count = {}
    for record in data['records']:
        for emotion in record['emotion']['value']:
            if emotion in emotion_count.keys():
                emotion_count[emotion] += 1
            else:
                emotion_count[emotion] = 1
    
    total_imgs = len(data['records'])
    top_three = []
    for emotion, count in emotion_count.items():
        score = count / total_imgs
        top_three.append({'emotion': emotion, 'score': score})
    
    top_three = sorted(top_three, key=lambda x: x['score'], reverse=True)[:3]

    #track_list = get_track_list(top_three)
    
    return jsonify(top_three)

@app.route('/get_album')
def get_album(get_data):
    album = get_data['album']
    album_params = {"app": app_id, "query": f"album = '{album}' and user = '{user_id}'"}
    response = requests.get(retrieve_records_endpoint, headers=retrieve_records_headers, params=album_params)
    data = response.json()
    images = []
    for record in data['records']:
        images.append(record['image']['value'])
    return jsonify(images)


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(debug=True,host='0.0.0.0',port=port)