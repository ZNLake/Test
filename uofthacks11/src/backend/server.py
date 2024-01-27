from flask import Flask
import json
import requests

headers = {"Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiZDAyYzg2MTQtNjJmNC00NWRhLWJiZjYtMGQ4ZWU0YTRkMTY4IiwidHlwZSI6InNhbmRib3hfYXBpX3Rva2VuIn0.H9c1fl9MA09se1MtPtU4VYBABTe2eXRKUHc8YX5az1I"}
#headers = {"Authorization": "Bearer xCBlFtgH5CAOQUMUAiSuEIh71pw8KQPjAvhX0gGl"}
url = "https://api.edenai.run/v2/image/face_detection"
json_payload = {
    "providers": "google",
    "file_url": "https://sadanduseless.b-cdn.net/wp-content/uploads/2021/11/awkward-family-photo15.jpg",
    "fallback_providers": ""
}

app = Flask(__name__)

@app.route('/')
def upload():
    response = requests.post(url, json=json_payload, headers=headers)
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
        if value > (3*len(faces)):
            main_emotions.append(emotion)

    return main_emotions
    



if __name__ == '__main__':
    app.run(debug=True)