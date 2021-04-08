# KUVO Catchall Proxy

This application simulates the KUVO API that RekordboxDJ uses to send realtime track data.


![alt text](/docs/app.png "Application Main Window")


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

## Using the Built-In overlay

The easiest way is to use the built-in web-overlay.

![alt text](/docs/overlay.png "Overlay Example")

Add a web source to your OBS scene and add the path `https://localhost/overlay`. You can add several parameters to control how the overlay looks as well as add custom CSS.

All colors are hex (without the pound sign)

The following parameters exist:

- headerback: background color of headers
- headercolor: text color of headers
- headerweight: font weight of the headers
- currentback: background color of current playing track
- currentcolor: text color of current playing track
- prevback: background color of current playing track
- prevcolor: text color of current playing track
- weight: font weight of the tracks
- current: Header Text for "Currently Playing"
- prev: "Header Text for "Played Before"

if you want to write custom css, here's the structure:

- `#content`
  - `.current-track`
    - `.header`
    - `.tracklist`
      - `.track`
        - `.title`
        - `.artist`
      - OR: `.track`
        - `.paused`
  - `.prev-tracks`
    - `.header`
    - `.tracklist`
      - `.track`
        - `.title`
        - `.artist`
      - ...

If you cannot connect make sure that you have installed the root certificate on the computer running OBS and running the application on the same computer than OBS.

## Using Playlist Textfiles

go to settings and either set an absolute path (`/absolute/path/to/playlist.txt`) or a path relative to your user dir (`~/playlist.txt` this should also work on windows)

it then generates a text file with one entry per track:

```
Title Track 1 (Artist Track 1)
Title Track 2 (Artist Track 2)
Title Track 3 (Artist Track 3)
...
```

![alt text](/docs/settings.png "Application Main Window")


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

## Possible Instabilities:

- Certificate Generation might be instable as it isn't fully automated yet
- Creation of KUVO-Account might not be possible while the entry in `/etc/hosts` is set

# Developing

this application supports multiple flags that can be set via environment variables:
- SPY=1 disables internal functionality and just displays requests and respones to original KUVO
- LOG=1 enables request logging
- UNSAFE=1 disables https and falls back to http. this will not work with Rekordbox, but might help debugging ssl related stuff
- RENEW=1 recreates all certificates (cannot be undone, you need to install the new root certificate)

# Roadmap:

- [X] Intercept Start/Stop/Update/Login/Logout from Rekordbox
- [X] Create a simple UI for setting settings
- [X] Create UI for showing currently running tracks and playlist (for making sure that it actually works)
- [X] Send Tracklist to REST-API
- [X] Store Tracklist in a file
- [X] Automatically generate certificats on startup
- [X] Delay Stop action (for avoiding setting tracks to stop if it was quiet for too long)
- [X] Revert to previous still running track on track stop of last running track
- [X] Web-Page for embedding in OBS or showing on a tablet for your guests
- [ ] Check if "virgin" rekordbox can setup KUVO account over this script (for not needing a kuvo account in the first place)