import cohere
import spotifyrec
co = cohere.Client("BpKBURuTZ0YlApK1CLSbGg4Yr6m7twoap4PkBNj1")

response = co.generate(
    prompt=f"Give me three words that describe an album consisting of these songs that I can use as a title: {','.join(spotifyrec.get_track_list())}"
)

print(response)
