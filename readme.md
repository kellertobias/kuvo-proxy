# KUVO Catchall Proxy

This application simulates the KUVO API that RekordboxDJ uses to send realtime track data.


![alt text](/docs/app.png "Application Main Window")


# Setup/Installation (For End-Users)

- Download and install openssl
- Download the Release from the releases page and unzip it. You might need to allow this binary (right-click open, then open).
- The first run wll ask for your password to do the setup (in order to add some configuration to your `/etc/hosts` file as well as adding configration to openssl to allow creating root-ca certificates.)
- go to settings. download and install the fake root certificate (depending on your OS this is a copy command or a few simple clicks)
- Start Rekordbox and Start the KUVO Live-Playlist. Once you change tracks, the program window should update accordingly.
- to use the benefits of the application do one of the following:
  - embed `https://localhost/overlay` in your OBS
  - set a file as callback path
  - set a HTTP/HTTPS REST API endpoint as callback path

# Using with OBS, external REST APIs or Playlist Textfiles

## Using the Built-In overlay

The easiest way is to use the built-in web-overlay.

![alt text](/docs/overlay.png "Overlay Example")

Add a web source to your OBS scene and add the path `https://localhost/overlay`. You can add several parameters to control how the overlay looks as well as add custom CSS.

All colors are hex (without the pound sign)

*The following parameters exist:*

- `headerback`: background color of headers
- `headercolor`: text color of headers
- `headerweight`: font weight of the headers
- `currentback`: background color of current playing track
- `currentcolor`: text color of current playing track
- `prevback`: background color of current playing track
- `prevcolor`: text color of current playing track
- `weight`: font weight of the tracks
- `current`: Header Text for "Currently Playing"
- `prev`: "Header Text for "Played Before"

*if you want to write custom css, here's the DOM structure:*

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

### Fixing connection issues from OBS

If you cannot connect make sure that you have installed the root certificate on the computer running OBS and running the application on the same computer than OBS.
If you want to run the application on another computer than you run OBS, you need to add the `ip.of.kuvo.computer   kuvo.com` to the `/etc/hosts` file of the computer running OBS.

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


## Integrating with your existing API

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

# Development


## Setup Requirements
- make sure you have openssl installed for generating the fake root-ca certificate (happens automatically on first application start)
- add the ip of the computer the application runs on to the `/etc/hosts` (e.g. `127.0.0.1 kuvo.com`)

if none of the above are setup, the program attempts to install it on the first run. this is done using `sudo-prompt`

## Building and Using the Application
In order to build this application, you need to do the following:

- run `npm install --save-dev` and then `npm start`

this application supports multiple flags that can be set via environment variables:
- SPY=1 disables internal functionality and just displays requests and respones to original KUVO
- LOG=1 enables request logging
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
- [X] Automatic Setup of Mac systems for openssl
- [ ] Check if "virgin" rekordbox can setup KUVO account over this script (for not needing a kuvo account in the first place)

# Changelog:

- 2021-04-10 - First End-User capable beta version and start of changelog