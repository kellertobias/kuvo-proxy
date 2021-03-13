from pprint import pprint
import requests

# response = requests.post(url, data=data)
shift = lambda elm, elmlist: [elm] + elmlist # i.e. shift([1, 2, 3, 4], 3)

players = [{'index': 1},{'index': 2},{'index': 3},{'index': 4}]
tracklist = []

def kuvo(title, artist, genre, bpm, key, time, playerNo, running):
    global tracklist

    stuffChanged = False
    
    if playerNo > 0 and playerNo <= 5:
        currentState = players[playerNo - 1]
        nextState = {
            'title': title,
            'artist': artist,
            'genre': genre,
            'bpm': bpm,
            'key': key,
            'time': time,
            'index': playerNo,
            'running': running
        }
        players[playerNo - 1] = nextState
        if running and currentState != nextState:
            if len(tracklist) == 0 or tracklist[0] != nextState:
                tracklist = shift(nextState, tracklist)
                tracklist = tracklist[0:3]
                stuffChanged = True
            
            
    else:
        print("[KUVO] Wrong Player Number")

    for player in players:
        if player.get("title", False):
            if player.get("running", False):
                print("[%s] ▶  %s - %s" % (player["index"], player["title"], player["artist"]))
            else:
                print("[%s] ❚❚ %s - %s" % (player["index"], player["title"], player["artist"]))
        else:
            print("[%s] ❚❚ Empty" % (player["index"]))
    
    print("\nRecent Tracks:")
    textlines = []
    for track in tracklist:
        textlines.append("%s - %s" % (track.get("title", ""), track.get("artist", "")))
        print(" - %s - %s" % (track.get("title", ""), track.get("artist", "")))
    if stuffChanged:
        requests.post("http://127.0.0.1:3020/text", json = {"lines": textlines})

    print("")