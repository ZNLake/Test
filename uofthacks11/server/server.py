from flask import Flask
from vision import call_vision_api
app = Flask(__name__)

@app.route('/')
def execute():
    file_urls = ['https://images.inc.com/uploaded_files/image/1920x1080/getty_152414899_97046097045006_68075.jpg', 'https://sadanduseless.b-cdn.net/wp-content/uploads/2021/11/awkward-family-photo15.jpg', 'https://assets3.cbsnewsstatic.com/hub/i/r/2010/08/20/89d66a34-a642-11e2-a3f0-029118418759/thumbnail/640x480/3c127f50286ff6f1fc5df89d5b79f25b/iStock_000008964742XSmall.jpg?v=9bdba4fec5b17ee7e8ba9ef8c71cf431']
    emotions = []
    for file_url in file_urls:
        emotion = call_vision_api(file_url=file_url)
        emotions.extend(emotion)
    # add to kintone db
        
    emotion_count = {}
    for emotion in emotions:
        if emotion in emotion_count.keys():
            emotion_count[emotion] += 1
        else:
            emotion_count[emotion] = 1
    
    total_urls = len(file_urls)
    top_three = []
    for emotion, count in emotion_count.items():
        score = count / total_urls
        top_three.append({'emotion': emotion, 'score': score})
    
    # Sort top_three based on score in descending order
    top_three = sorted(top_three, key=lambda x: x['score'], reverse=True)[:3]
    return top_three

if __name__ == '__main__':
    app.run(debug=True)