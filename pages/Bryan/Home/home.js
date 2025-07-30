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
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const searchResults = document.getElementById('search-results');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const shuffleBtn = document.getElementById('shuffle-btn');
    const repeatBtn = document.getElementById('repeat-btn');

    let songsMap = {};
    let songIds = [];
    let currentSongIndex = -1;
    let isShuffleOn = false;
    let isRepeatOn = false;
    let originalSongOrder = [];

    try {
        const response = await fetch('songs.json');
        const data = await response.json();
        data.musicLibrary.forEach(song => {
            songsMap[song.id] = song;
            songIds.push(song.id);
        });
        originalSongOrder = [...songIds]; // salva a ordem original
    } catch (error) {
        console.error("Erro ao carregar songs.json:", error);
        alert("Erro ao carregar a biblioteca de músicas.");
        return;
    }

    // estado do player
    let currentSong = null;
    let isPlaying = false;

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
        currentSongIndex = songIds.indexOf(songId);
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

    function playNextSong() {
        if (songIds.length === 0) return;

        let nextIndex = currentSongIndex + 1;

        if (nextIndex >= songIds.length) {
            if (isRepeatOn) {
                nextIndex = 0;
            } else {
                isPlaying = false;
                playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
                return;
            }
        }

        loadAndPlaySong(songIds[nextIndex]);
    }

    function playPrevSong() {
        if (songIds.length === 0) return;

        let prevIndex = currentSongIndex - 1;

        if (prevIndex < 0) {
            if (isRepeatOn) {
                prevIndex = songIds.length - 1;
            } else {
                prevIndex = 0;
            }
        }

        loadAndPlaySong(songIds[prevIndex]);
    }

    function toggleShuffle() {
        isShuffleOn = !isShuffleOn;

        if (isShuffleOn) {
            // ativa o shuffle
            shuffleBtn.classList.add('active');
            const currentSongId = songIds[currentSongIndex];

            let tempArray = [...songIds];
            tempArray.splice(currentSongIndex, 1);
            tempArray = shuffleArray(tempArray);
            tempArray.unshift(currentSongId);

            songIds = tempArray;
            currentSongIndex = 0;
        } else {
            // desativa o shuffle - volta para a ordem original
            shuffleBtn.classList.remove('active');
            const currentSongId = songIds[currentSongIndex];
            songIds = [...originalSongOrder];
            currentSongIndex = songIds.indexOf(currentSongId);
        }
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function toggleRepeat() {
        isRepeatOn = !isRepeatOn;
        repeatBtn.classList.toggle('active', isRepeatOn);
    }

    // Função de busca
    function searchSongs(query) {
        query = query.toLowerCase().trim();
        if (!query) {
            searchResults.innerHTML = '';
            searchResults.style.display = 'none';
            return;
        }

        const results = [];
        for (const songId in songsMap) {
            const song = songsMap[songId];
            if (song.title.toLowerCase().includes(query) ||
                song.artist.toLowerCase().includes(query)) {
                results.push(song);
            }
        }

        displaySearchResults(results);
    }

    function displaySearchResults(results) {
        searchResults.innerHTML = '';

        if (results.length === 0) {
            searchResults.innerHTML = '<div class="search-result-item">Nenhum resultado encontrado</div>';
            searchResults.style.display = 'block';
            return;
        }

        results.forEach(song => {
            const resultItem = document.createElement('div');
            resultItem.className = 'search-result-item';
            resultItem.innerHTML = `
                <img src="${song.cover}" alt="${song.title}">
                <div class="search-result-info">
                    <h4>${song.title}</h4>
                    <p>${song.artist}</p>
                </div>
            `;
            resultItem.addEventListener('click', () => {
                loadAndPlaySong(song.id);
                searchResults.style.display = 'none';
                searchInput.value = '';
            });
            searchResults.appendChild(resultItem);
        });

        searchResults.style.display = 'block';
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

    // event listeners para busca
    searchInput.addEventListener('input', () => searchSongs(searchInput.value));
    searchBtn.addEventListener('click', () => searchSongs(searchInput.value));

    // fechar resultados ao clicar fora
    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
            searchResults.style.display = 'none';
        }
    });

    // controles do player
    playPauseBtn.addEventListener('click', function () {
        if (isPlaying) {
            audioPlayer.pause();
            this.innerHTML = '<i class="fas fa-play"></i>';
        } else {
            if (currentSong) {
                audioPlayer.play()
                    .then(() => {
                        this.innerHTML = '<i class="fas fa-pause"></i>';
                    });
            } else if (songIds.length > 0) {
                loadAndPlaySong(songIds[0]);
            }
        }
        isPlaying = !isPlaying;
    });

    prevBtn.addEventListener('click', playPrevSong);
    nextBtn.addEventListener('click', playNextSong);
    shuffleBtn.addEventListener('click', toggleShuffle);
    repeatBtn.addEventListener('click', toggleRepeat);

    audioPlayer.addEventListener('timeupdate', updateProgress);
    audioPlayer.addEventListener('ended', function () {
        if (isRepeatOn && currentSongIndex !== -1) {
            loadAndPlaySong(songIds[currentSongIndex]);
        } else {
            playNextSong();
        }
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