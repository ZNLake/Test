from flask import Flask, render_template, send_from_directory
from vision import call_vision_api
from spotifyrec import get_track_list
import os
import json
import requests

kintone_api_key = os.getenv('KINTONE_API_KEY')

app = Flask(__name__, static_folder='./frontend')
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
        "app": app_id
}

@app.route('/api/db')
def execute():
    file_urls = ['https://sadanduseless.b-cdn.net/wp-content/uploads/2021/11/awkward-family-photo15.jpg', 'https://assets3.cbsnewsstatic.com/hub/i/r/2010/08/20/89d66a34-a642-11e2-a3f0-029118418759/thumbnail/640x480/3c127f50286ff6f1fc5df89d5b79f25b/iStock_000008964742XSmall.jpg?v=9bdba4fec5b17ee7e8ba9ef8c71cf431', 'https://globalnews.ca/wp-content/uploads/2017/10/scare.jpg?quality=85&strip=all', 'https://t3.ftcdn.net/jpg/02/47/40/98/360_F_247409832_pPugfgU5cKLsrH5OCJRMn5JTcy2L1Rrg.jpg', 'https://media.cnn.com/api/v1/images/stellar/prod/200723132104-woman-crying-stock.jpg?q=w_3861,h_2574,x_0,y_0,c_fill']
    for file_url in file_urls:
        emotion = call_vision_api(file_url=file_url)
        payload = {
            "app": app_id,
            "record": {
                "image": {"value": file_url},
                "emotion": {"value": emotion},  
                "spotify": {"value": ""}  
            }
        }
        print(f"img URL: {file_url}")
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

    track_list = get_track_list(top_three)
    
    return top_three


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    app.run(debug=True, host='172.17.0.2' ,port=5000)