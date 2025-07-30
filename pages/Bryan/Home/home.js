document.addEventListener('DOMContentLoaded', async function () {
    // elementos 
    const audioPlayer = document.getElementById('audio-player');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const progressFill = document.getElementById('progress-fill');
    const currentTimeDisplay = document.getElementById('current-time');
    const durationDisplay = document.getElementById('duration');
    const volumeControl = document.getElementById('volume-control');
    const currentSongTitle = document.getElementById('current-song-title');
    const currentSongArtist = document.getElementById('current-song-artist');
    const currentAlbumCover = document.getElementById('current-album-cover');

    let songsMap = {};

    try {
        const response = await fetch('songs.json');
        const data = await response.json();
        data.musicLibrary.forEach(song => {
            songsMap[song.id] = song;
        });
    } catch (error) {
        console.error("Erro ao carregar songs.json:", error);
        alert("Erro ao carregar a biblioteca de músicas.");
        return;
    }

    // estado do player
    let currentSong = null;
    let isPlaying = false;

    // funções auxiliares
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    }

    function updateProgress() {
        const currentTime = audioPlayer.currentTime;
        const duration = audioPlayer.duration;

        if (!isNaN(duration)) {
            const progressPercent = (currentTime / duration) * 100;
            progressFill.style.width = `${progressPercent}%`;
            currentTimeDisplay.textContent = formatTime(currentTime);
            durationDisplay.textContent = formatTime(duration);
        }
    }

    function loadAndPlaySong(songId) {
        const song = songsMap[songId];
        if (!song) return;

        currentSong = song;
        audioPlayer.src = song.file;
        currentSongTitle.textContent = song.title;
        currentSongArtist.textContent = song.artist;
        currentAlbumCover.src = song.cover;

        audioPlayer.play()
            .then(() => {
                isPlaying = true;
                playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
            });
    }

    // event listeners nos elementos que têm data-id
    document.querySelectorAll('[data-id]').forEach(element => {
        element.addEventListener('click', function () {
            const songId = this.getAttribute('data-id');
            if (songId && songsMap[songId]) {
                loadAndPlaySong(songId);
            }
        });
    });

    // controles do player
    playPauseBtn.addEventListener('click', function () {
        if (isPlaying) {
            audioPlayer.pause();
            this.innerHTML = '<i class="fas fa-play"></i>';
        } else {
            audioPlayer.play()
                .then(() => {
                    this.innerHTML = '<i class="fas fa-pause"></i>';
                })
                .catch(error => {
                    console.error("Erro ao reproduzir:", error);
                    alert("Selecione uma música para reproduzir primeiro.");
                });
        }
        isPlaying = !isPlaying;
    });

    audioPlayer.addEventListener('timeupdate', updateProgress);
    audioPlayer.addEventListener('ended', function () {
        isPlaying = false;
        playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
    });

    volumeControl.addEventListener('input', function () {
        audioPlayer.volume = this.value / 100;
    });

    document.getElementById('mute-btn').addEventListener('click', function () {
        if (audioPlayer.volume > 0) {
            audioPlayer.volume = 0;
            volumeControl.value = 0;
            this.innerHTML = '<i class="fas fa-volume-mute"></i>';
        } else {
            audioPlayer.volume = 0.8;
            volumeControl.value = 80;
            this.innerHTML = '<i class="fas fa-volume-up"></i>';
        }
    });

    document.querySelector('.progress-track').addEventListener('click', function (e) {
        const percent = e.offsetX / this.offsetWidth;
        audioPlayer.currentTime = percent * audioPlayer.duration;
    });
});
