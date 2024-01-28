from flask import Flask, render_template, send_from_directory
from vision import call_vision_api
from spotifyrec import get_track_list, generate_playlist
import os
import json
import requests
from flask import jsonify
import http.client

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

@app.route('/login')
def login(login_info):
    global user_id, spotify_code, spotify_state
    login_info = json.loads(login_info)
    user_id = login_info.get('user')
    spotify_code = login_info.get('spotify_code')
    spotify_state = login_info.get('spotify_state')

@app.route('/getuser/<email>')
def get_user(email):
    
    #api call for token
    conn = http.client.HTTPSConnection("")

    payload = "grant_type=client_credentials&client_id=gOEkoNaxbDeDVHLXRXIEppzqD5GtvARj&client_secret=KMLU4rlSSC5GDTbAKg9hhK13AGgY2rYj4BrfsfXCX-CAtKMVyej6-2NYyOc0hVB8&audience=https://dev-3q743fc24vrnr2ng.us.auth0.com/api/v2/"

    headers = { 'content-type': "application/x-www-form-urlencoded" }

    conn.request("POST", "/dev-3q743fc24vrnr2ng.us.auth0.com/oauth/token", payload, headers)

    res = conn.getresponse()
    data = res.read()

    print(data.decode("utf-8"))
    MgmtApiAccessToken = data.decode("utf-8")
        #api call for user info
    conn = http.client.HTTPSConnection("dev-3q743fc24vrnr2ng.us.auth0.com")
    headers = { 'authorization': f"Bearer %7{MgmtApiAccessToken}%7" }
    conn.request("GET", f"/dev-3q743fc24vrnr2ng.us.auth0.com/api/v2/users-by-email?email=%7{email}%7D", headers=headers)
    res = conn.getresponse()
    data = res.read()
    
    return data.decode("utf-8")


@app.route('/upload_images')
def upload_images(img_data):
    file_urls = img_data.get('file_urls')
    album = img_data.get('album')
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

@app.route('/get_playlist')
def get_playlist(album):
    params = {"app": app_id, "query": f'album = "{album}" and user = "{user_id}"'}
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
    playlist = generate_playlist(track_list)
    update_playlist(album, playlist)
    
    ret = {}
    ret['playlist'] = playlist
    return json.dumps(ret)

@app.route('/get_album')
def get_album(get_data):
    album = get_data['album']
    album_params = {"app": app_id, "query": f'album = "{album}" and user = "{user_id}"'}
    response = requests.get(retrieve_records_endpoint, headers=retrieve_records_headers, params=album_params)
    data = response.json()
    ret = {}
    ret['images'] = []
    for record in data['records']:
        ret['images'].append(record['image']['value'])
    return json.dumps(ret)

@app.route('/get_image')
def get_image(get_data):
    album = get_data['album']
    retrieve_img_params = {"app": app_id, "query": f'album = "{album}" and user = "{user_id} limit 1"'}
    response = requests.get(retrieve_records_endpoint, headers=retrieve_records_headers, params=retrieve_img_params)
    data = response.json()
    ret = {}
    ret['image'] = data['records'][0]['image']['value']
    return json.dumps(ret)

def update_playlist(album, playlist):
    album_params = {"app": app_id, "query": f'album = "{album}" and user = "{user_id}"', "fields": ["$id"]}
    response = requests.get(retrieve_records_endpoint, headers=retrieve_records_headers, params=album_params)
    data = response.json()
    for record in data['records']:
        record_id = record['$id']['value']
        update_data = {
            "app": app_id,
            "id": record_id,
            "record": {
                "spotify": {
                    "value": playlist
                }
            }
        }
        response = requests.put(add_record_endpoint, headers=add_record_headers, json=update_data)


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')


# if __name__ == '__main__':
#     port = int(os.environ.get("PORT", 5000))
#     app.run(debug=True,host='0.0.0.0',port=port)
if __name__ == '__main__':
    #port = int(os.environ.get("PORT", 5000))
    #app.run(debug=True,host='0.0.0.0',port=port)
    login_info = {'user': 'katarina', 'spotify_code': 'aaaa', 'spotify_state': 'bbbb'}
    login_info_json = json.dumps(login_info)
    print(login_info_json)
    login(login_info_json)
    #file_urls = {'album': '18th bday', 'file_urls': ['https://sadanduseless.b-cdn.net/wp-content/uploads/2021/11/awkward-family-photo15.jpg', 'https://assets3.cbsnewsstatic.com/hub/i/r/2010/08/20/89d66a34-a642-11e2-a3f0-029118418759/thumbnail/640x480/3c127f50286ff6f1fc5df89d5b79f25b/iStock_000008964742XSmall.jpg?v=9bdba4fec5b17ee7e8ba9ef8c71cf431', 'https://globalnews.ca/wp-content/uploads/2017/10/scare.jpg?quality=85&strip=all', 'https://t3.ftcdn.net/jpg/02/47/40/98/360_F_247409832_pPugfgU5cKLsrH5OCJRMn5JTcy2L1Rrg.jpg', 'https://media.cnn.com/api/v1/images/stellar/prod/200723132104-woman-crying-stock.jpg?q=w_3861,h_2574,x_0,y_0,c_fill']}
    file_urls = {'album': 'early_childhood', 'file_urls': ['https://scontent-yyz1-1.xx.fbcdn.net/v/t1.18169-9/1923706_10704337323_3710_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=4dc865&_nc_ohc=dnnSJVnsuqsAX_9mHwM&_nc_ht=scontent-yyz1-1.xx&oh=00_AfDhN84gX0izC_L-PWLsiyh7LyQ0Hg0x4Jz1WeuR6S0a5Q&oe=65DD64AE', 
                                                    'https://scontent-yyz1-1.xx.fbcdn.net/v/t1.18169-9/10398944_12845172323_4205_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=4dc865&_nc_ohc=IbkP-jllwpkAX-NohGz&_nc_ht=scontent-yyz1-1.xx&oh=00_AfB7a3qrnpZmtHC_qkjb9OcXltOL7lUGIVVWvq35cey0Tw&oe=65DD429A', 
                                                    'https://scontent-yyz1-1.xx.fbcdn.net/v/t1.18169-9/1929907_19036732323_7321_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=4dc865&_nc_ohc=z5H1H7of-xQAX_ZNj5U&_nc_ht=scontent-yyz1-1.xx&oh=00_AfD8uZluS91KWioV9Uwm46BuYJYzZEvNvoExDYpyXAmnvQ&oe=65DD7CBC',
                                                    'https://scontent-yyz1-1.xx.fbcdn.net/v/t1.18169-9/1923956_39878552323_9947_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=4dc865&_nc_ohc=EFOlKuauRHUAX97By5S&_nc_ht=scontent-yyz1-1.xx&oh=00_AfA2JBCCzUtBCBIZP-uybygzGmlZEONVs6YtUgoSbAkN2w&oe=65DD640C',
                                                    'https://scontent-yyz1-1.xx.fbcdn.net/v/t1.18169-9/1923956_39878507323_7107_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=4dc865&_nc_ohc=oGkf_FRWDkkAX8B5kV-&_nc_ht=scontent-yyz1-1.xx&oh=00_AfCu82yKNo7fhLEFP8-9R0q1QdyL8CFc_nFNhwSIpBus7A&oe=65DD4F88']}
    
    file_urls_json = json.dumps(file_urls)
    get_playlist('early_childhood')
