# KUVO Catchall Proxy

This application simulates the KUVO API that RekordboxDJ uses to send realtime track data.


# Setup/Installation
In order to use this application, you need to do the following:
- Clone the Repo
- run `npm install --save-dev` and then `npm start`
- make sure you have openssl installed for generating the fake root-ca certificate (happens automatically on first application start)
- add the ip of the computer the application runs on to the `/etc/hosts` (e.g. `127.0.0.1 kuvo.com`)
- go to settings. download and install the fake root certificate (depending on your OS this is a copy command or a few simple clicks)
- set the callback path. This could be a file on your OBS machine or a http/https REST API's POST-Endpoint.
- Start Rekordbox and Start the KUVO Live-Playlist

# Using with OBS

go to settings and either set an absolute path (`/absolute/path/to/playlist.txt`) or a path relative to your user dir (`~/playlist.txt` this should also work on windows)

it then generates a text file with one entry per track:

```
Title Track 1 (Artist Track 1)
Title Track 2 (Artist Track 2)
Title Track 3 (Artist Track 3)
...
```

# Integrating with your tools

if you want to integrate this script with your own tools, you need to provide a REST-API POST-Endpoint that accepts JSON.

The format is:

```
{
    "tracks": [
        {title: "", artist: "", album: "", genre: "", bpm: 123.45, key: "12A", time: 234},
        ...
    ]
}
```

# Project Stability

This project is meant to be used by people who know a little bit of prgramming. This project is developed by modern standards, however it was an application that was needed to be done within a short time and thus some design decisions are not that good and here and there is some code-smell. Feel free to create Merge Requests for improving upon this tool.

# Roadmap:

- [X] Intercept Start/Stop/Update/Login/Logout from Rekordbox
- [X] Create a simple UI for setting settings
- [X] Create UI for showing currently running tracks and playlist (for making sure that it actually works)
- [X] Send Tracklist to REST-API
- [X] Store Tracklist in a file
- [ ] Automatically generate certificats on startup
- [ ] Web-Page for embedding in OBS or showing on a tablet for your guests
- [ ] ~~Showing Cover-Art~~ sadly not possible
- [ ] Check if "virgin" rekordbox can setup KUVO account over this script (for not needing a kuvo account in the first place)