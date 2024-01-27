import spotipy
from spotipy.oauth2 import SpotifyClientCredentials

POPULATION_SCORE = 80

# Let me know if you need the client ID and secret
spotify = spotipy.Spotify(client_credentials_manager=SpotifyClientCredentials())

# Get emotion data from Vision API Top 3 emotions will be in the form of a list of 3 dicts. i.e:
# [{'emotion': 'Joy', 'score': 4.7}, {'emotion': 'Sorrow', 'score': 3.8}, {'emotion': 'Anger', 'score': 3.5}]
top_three = [{},{},{}]
top_three = [{'emotion': 'Joy', 'score': 4.7}, {'emotion': 'Sorrow', 'score': 3.8}, {'emotion': 'Anger', 'score': 3.5}]

# In order left to right: Joy, Sorrow, Anger, Surprise, Disgust, Fear, Confusion, Calm, Neutral, Contempt.
# In order top to bottom: Danceability, Energy, Acousticness, Liveness, Loudness, Mode, Popularity, Valence.
emotion_weight_matrix = [["Joy", "Sorrow", "Anger", "Surprise", "Disgust", "Fear", "Confusion", "Calm", "Neutral", "Contempt"],
                         [1.0, 0.1, 0.5, 0.9, 0.1, 0.1, 0.1, 0.3, 0.5, 0.5],
                         [1.0, 0.1, 1.0, 1.0, 0.4, 0.2, 0.8, 0.3, 0.5, 0.7],
                         [0.2, 1.0, 0.3, 0.5, 0.5, 1.0, 0.3, 0.7, 0.5, 0.2],
                         [1.0, 0.1, 1.0, 0.9, 0.1, 0.3, 0.1, 0.5, 0.5, 0.6],
                         [1.0, 0.1, 1.0, 1.0, 0.5, 0.5, 0.8, 0.3, 0.5, 0.8],
                         [1.0, 0.0, 1.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.5, 0.0],
                         [80, 80, 80, 80, 80, 80, 80, 80, 80, 80],
                         [1.0, 0.1, 0.3, 0.7, 0.1, 0.1, 0.1, 0.7, 0.5, 0.2]]

# Weighing algorithm:
total = top_three[0]['score'] + top_three[1]['score'] + top_three[2]['score']
emo1, emo2, emo3 = top_three[0]['emotion'], top_three[1]['emotion'], top_three[2]['emotion']
emo1percent = top_three[0]['score'] / total
emo2percent = top_three[1]['score'] / total
emo3percent = top_three[2]['score'] / total

attributes = [0.0, 0.0, 0.0, 0.0, 0.0, 0, 0, 0.0, 0.0]

# Set target values for Spotify API
def set_attribute_value(emotion: str, percent: float) -> None:
    for i in range(0, 8):
        attributes[i] += emotion_weight_matrix[i+1][emotion_weight_matrix[0].index(emotion)] * percent


set_attribute_value(emo1, emo1percent)
set_attribute_value(emo2, emo2percent)
set_attribute_value(emo3, emo3percent)

# Let user choose genre seeds
# Available genres: https://developer.spotify.com/console/get-available-genre-seeds/
results = spotify.recommendations(seed_genres=["pop"], limit=20, target_danceability=attributes[0], target_energy=attributes[1], target_acousticness=attributes[2], target_liveness=attributes[3], target_loudness=attributes[4], target_mode=round(attributes[5]), target_popularity=POPULATION_SCORE, target_valence=attributes[7])

for track in results['tracks']:
    print(track['name'])
