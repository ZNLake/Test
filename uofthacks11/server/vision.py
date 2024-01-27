from flask import Flask
import json
import requests
import os
import os

google_headers = {"Authorization": f"Bearer: {os.getenv('VISION_API_KEY')}"}
url = "https://api.edenai.run/v2/image/face_detection"
app = Flask(__name__)

@app.route('/')
def call_vision_api(file_url):
    json_payload = {
        "providers": "google",
        "file_url": file_url,
        "fallback_providers": ""
    }

    response = requests.post(url, json=json_payload, headers=google_headers)
    result = json.loads(response.text)

    emotions = ["joy", "sorrow", "anger", "surprise", "disgust", "fear", "confusion", "calm", "neutral", "contempt"]
    
    emotion_dict = {"joy": 0, "sorrow": 0, "anger": 0, "surprise": 0, "disgust": 0, "fear": 0, "confusion": 0, "calm": 0, "neutral": 0, "contempt": 0}
    faces = result["google"]["items"]
    for face in faces:
        for emotion in emotions:
            if face["emotions"][emotion] != None:
                emotion_dict[emotion] += face["emotions"][emotion]
    
    main_emotions = []

    for emotion, value in emotion_dict.items():
        if value > (2*len(faces)):
            main_emotions.append(emotion)

    if main_emotions == []:
        main_emotions.append("chill")

    return main_emotions
    



if __name__ == '__main__':
    app.run(debug=True)