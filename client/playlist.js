function renderSong(song, style) {

    var songNode = createNode('div', 'track', {style, nodes: song.paused ? [
        createNode('div', 'paused', {text: '- Nothing Playing -'}),
    ]:[
        createNode('div', 'title', {text: song.title}),
        createNode('div', 'artist', {text: song.artist ? (' - ' + song.artist) : song.artist}),
    ]})

    return songNode
}

setupClient('overlay', function(data, params) {
    var outer = document.getElementById('content')
    outer.innerHTML = "";
    outer.style.fontWeight
    var headerStyle = {
        backgroundColor: '#' + (params.headerback ? params.headerback : 'AA0000'),
        color: '#' + (params.headercolor ? params.headercolor : 'FFFFFF'),
        fontWeight: params.headerweight ? params.headerweight : 'bold',
        width: params.width ? params.width : 'fit-content'
    }

    var currentStyle = {
        backgroundColor: '#' + (params.currentback ? params.currentback : '000000'),
        color: '#' + (params.currentcolor ? params.currentcolor : 'FFFFFF'),
        fontWeight: params.weight ? params.weight : 'normal',
        width: params.width ? params.width : 'fit-content'
    }

    var prevStyle = {
        backgroundColor: '#' + (params.prevback ? params.prevback : '000000'),
        color: '#' + (params.prevcolor ? params.prevcolor : 'FFFFFF'),
        fontWeight: params.weight ? params.weight : 'normal',
        width: params.width ? params.width : 'fit-content'
    }

    var currentTrack = createNode('div', 'tracklist')
    var previousTracks = createNode('div', 'tracklist')

    var currentTrackSection = createNode('div', 'current-track', {nodes: [
        createNode('div', 'header', {text: params.current ? params.current : 'Currently Playing', style: headerStyle}),
        currentTrack
    ]})
    var prevTracksSection = createNode('div', 'prev-tracks', {nodes: [
        createNode('div', 'header', {text: params.prev ? params.prev : 'Played Before', style: headerStyle}),
        previousTracks
    ]})

    prevTracksSection.hidden = true

    data.forEach((song, index) => {
        if(index == 0) {
            currentTrack.append(renderSong(song, currentStyle))
        } else {
            prevTracksSection.hidden = false
            previousTracks.append(renderSong(song, prevStyle))
        }
    });

    outer.append(currentTrackSection)
    outer.append(prevTracksSection)                
})