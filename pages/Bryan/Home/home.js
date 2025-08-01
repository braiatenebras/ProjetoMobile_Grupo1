document.addEventListener('DOMContentLoaded', async function () {
    // =============================================
    // 1. CONSTANTES E ELEMENTOS DO DOM
    // =============================================
    const elements = {
        audioPlayer: document.getElementById('audio-player'),
        playPauseBtn: document.getElementById('play-pause-btn'),
        progressFill: document.getElementById('progress-fill'),
        currentTimeDisplay: document.getElementById('current-time'),
        durationDisplay: document.getElementById('duration'),
        volumeControl: document.getElementById('volume-control'),
        currentSongTitle: document.getElementById('current-song-title'),
        currentSongArtist: document.getElementById('current-song-artist'),
        currentAlbumCover: document.getElementById('current-album-cover'),

        searchInput: document.getElementById('search-input'),
        searchBtn: document.getElementById('search-btn'),
        searchResults: document.getElementById('search-results'),

        prevBtn: document.getElementById('prev-btn'),
        nextBtn: document.getElementById('next-btn'),
        shuffleBtn: document.getElementById('shuffle-btn'),
        repeatBtn: document.getElementById('repeat-btn'),
        muteBtn: document.getElementById('mute-btn'),

        progressTrack: document.querySelector('.progress-track')
    };

    // =============================================
    // 2. ESTADO DA APLICAÇÃO
    // =============================================
    const state = {
        songsMap: {},
        songIds: [],
        currentSongIndex: -1,
        isShuffleOn: false,
        isRepeatOn: false,
        originalSongOrder: [],
        currentSong: null,
        isPlaying: false
    };

    // =============================================
    // 3. FUNÇÕES UTILITÁRIAS
    // =============================================
    const utils = {
        formatTime: (seconds) => {
            const minutes = Math.floor(seconds / 60);
            const secs = Math.floor(seconds % 60);
            return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
        },

        shuffleArray: (array) => {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        },

        animateElement: (element, animation, duration = 200) => {
            element.style.transform = animation;
            setTimeout(() => {
                element.style.transform = '';
            }, duration);
        }
    };

    // =============================================
    // 4. FUNÇÕES PRINCIPAIS DO PLAYER
    // =============================================
    const player = {
        updateProgress: () => {
            const currentTime = elements.audioPlayer.currentTime;
            const duration = elements.audioPlayer.duration;

            if (!isNaN(duration)) {
                const progressPercent = (currentTime / duration) * 100;
                elements.progressFill.style.width = `${progressPercent}%`;
                elements.currentTimeDisplay.textContent = utils.formatTime(currentTime);
                elements.durationDisplay.textContent = utils.formatTime(duration);
            }
        },

        loadAndPlaySong: (songId) => {
            const song = state.songsMap[songId];
            if (!song) return;

            state.currentSong = song;
            state.currentSongIndex = state.songIds.indexOf(songId);

            elements.audioPlayer.src = song.file;
            elements.currentSongTitle.textContent = song.title;
            elements.currentSongArtist.textContent = song.artist;
            elements.currentAlbumCover.src = song.cover;

            elements.currentAlbumCover.style.transform = 'scale(0.8)';
            elements.currentAlbumCover.style.opacity = '0.7';
            setTimeout(() => {
                elements.currentAlbumCover.style.transform = 'scale(1)';
                elements.currentAlbumCover.style.opacity = '1';
                elements.currentAlbumCover.style.transition = 'all 0.3s ease';
            }, 50);

            // toca a música
            elements.audioPlayer.play().then(() => {
                state.isPlaying = true;
                elements.playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
                elements.playPauseBtn.classList.add('playing');
            }).catch(error => {
                console.error("Erro ao reproduzir:", error);
            });
        },

        playNextSong: () => {
            if (state.songIds.length === 0) return;

            let nextIndex = state.currentSongIndex + 1;
            if (nextIndex >= state.songIds.length) {
                if (state.isRepeatOn) nextIndex = 0;
                else {
                    state.isPlaying = false;
                    elements.playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
                    elements.playPauseBtn.classList.remove('playing');
                    return;
                }
            }

            player.loadAndPlaySong(state.songIds[nextIndex]);
        },

        playPrevSong: () => {
            if (state.songIds.length === 0) return;

            let prevIndex = state.currentSongIndex - 1;
            if (prevIndex < 0) {
                prevIndex = state.isRepeatOn ? state.songIds.length - 1 : 0;
            }

            player.loadAndPlaySong(state.songIds[prevIndex]);
        },

        toggleShuffle: () => {
            state.isShuffleOn = !state.isShuffleOn;
            elements.shuffleBtn.classList.toggle('active', state.isShuffleOn);

            const currentSongId = state.songIds[state.currentSongIndex];
            if (state.isShuffleOn) {
                let tempArray = [...state.songIds];
                tempArray.splice(state.currentSongIndex, 1);
                tempArray = utils.shuffleArray(tempArray);
                tempArray.unshift(currentSongId);
                state.songIds = tempArray;
                state.currentSongIndex = 0;
            } else {
                state.songIds = [...state.originalSongOrder];
                state.currentSongIndex = state.songIds.indexOf(currentSongId);
            }

            utils.animateElement(elements.shuffleBtn, 'scale(1.2)');
        },

        toggleRepeat: () => {
            state.isRepeatOn = !state.isRepeatOn;
            elements.repeatBtn.classList.toggle('active', state.isRepeatOn);
            utils.animateElement(elements.repeatBtn, 'rotate(30deg)');
        },

        togglePlayPause: () => {
            if (state.isPlaying) {
                elements.audioPlayer.pause();
                elements.playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
                elements.playPauseBtn.classList.remove('playing');
            } else {
                if (state.currentSong) {
                    elements.audioPlayer.play().then(() => {
                        elements.playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
                        elements.playPauseBtn.classList.add('playing');
                    });
                } else if (state.songIds.length > 0) {
                    player.loadAndPlaySong(state.songIds[0]);
                }
            }
            state.isPlaying = !state.isPlaying;
        },

        toggleMute: () => {
            if (elements.audioPlayer.volume > 0) {
                elements.audioPlayer.volume = 0;
                elements.volumeControl.value = 0;
                elements.muteBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
            } else {
                elements.audioPlayer.volume = 0.8;
                elements.volumeControl.value = 80;
                elements.muteBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
            }
        },

        handleProgressClick: (e) => {
            const percent = e.offsetX / elements.progressTrack.offsetWidth;
            elements.audioPlayer.currentTime = percent * elements.audioPlayer.duration;
        }
    };

    // =============================================
    // 5. FUNÇÕES DE BUSCA
    // =============================================
    const search = {
        searchSongs: (query) => {
            query = query.toLowerCase().trim();
            if (!query) {
                elements.searchResults.innerHTML = '';
                elements.searchResults.style.display = 'none';
                return;
            }

            const results = [];
            for (const songId in state.songsMap) {
                const song = state.songsMap[songId];
                if (song.title.toLowerCase().includes(query) || song.artist.toLowerCase().includes(query)) {
                    results.push(song);
                }
            }

            search.displaySearchResults(results);
        },

        displaySearchResults: (results) => {
            elements.searchResults.innerHTML = '';

            if (results.length === 0) {
                elements.searchResults.innerHTML = '<div class="search-result-item">Nenhum resultado encontrado</div>';
                elements.searchResults.style.display = 'block';
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
                    player.loadAndPlaySong(song.id);
                    elements.searchResults.style.display = 'none';
                    elements.searchInput.value = '';
                });
                elements.searchResults.appendChild(resultItem);
            });

            elements.searchResults.style.display = 'block';
        }
    };

    // =============================================
    // 6. FUNÇÕES DE MODAIS
    // =============================================
    const modals = {
        setupModals: () => {
            // Abrir modais
            document.querySelectorAll('.abrir-modal').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const modalId = btn.getAttribute('data-modal');
                    const modal = document.getElementById(modalId);
                    if (modal) {
                        modal.style.display = 'block';
                        setTimeout(() => {
                            modal.classList.add('show');
                        }, 10);
                    }
                });
            });

            // fechar modais
            document.querySelectorAll('.modal .fechar').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const modal = btn.closest('.modal');
                    modal.classList.remove('show');
                    setTimeout(() => {
                        modal.style.display = 'none';
                    }, 300);
                });
            });

            // fechar ao clicar fora
            window.addEventListener('click', (e) => {
                if (e.target.classList.contains('modal')) {
                    e.target.classList.remove('show');
                    setTimeout(() => {
                        e.target.style.display = 'none';
                    }, 300);
                }
            });
        },

        handleModalItemClick: (e) => {
            // verifica se o clique foi em um artista-card (Mais Ouvidas)
            if (e.target.closest('.artist-card')) {
                const artistCard = e.target.closest('.artist-card');
                const songId = artistCard.getAttribute('data-id');
                modals.playSongFromElement(songId, artistCard);
            }

            if (e.target.closest('.musica-modal')) {
                const musicaModal = e.target.closest('.musica-modal');
                const songId = musicaModal.getAttribute('data-id');
                modals.playSongFromElement(songId, musicaModal);

                // fecha o modal
                const modal = musicaModal.closest('.modal');
                modal.classList.remove('show');
                setTimeout(() => {
                    modal.style.display = 'none';
                }, 300);
            }
        },

        playSongFromElement: (songId, element) => {
            if (songId && state.songsMap[songId]) {
                player.loadAndPlaySong(songId);
                utils.animateElement(element, 'scale(0.95)');
            }
        }
    };

    // =============================================
    // 7. INICIALIZAÇÃO
    // =============================================
    const init = async () => {
        try {
            // carrega as músicas
            const response = await fetch('songs.json');
            const data = await response.json();
            data.musicLibrary.forEach(song => {
                state.songsMap[song.id] = song;
                state.songIds.push(song.id);
            });
            state.originalSongOrder = [...state.songIds];
        } catch (error) {
            console.error("Erro ao carregar songs.json:", error);
            alert("Erro ao carregar a biblioteca de músicas.");
            return;
        }

        // configura modais
        modals.setupModals();

        // configura event listeners
        elements.searchInput.addEventListener('input', () => search.searchSongs(elements.searchInput.value));
        elements.searchBtn.addEventListener('click', () => search.searchSongs(elements.searchInput.value));

        document.addEventListener('click', (e) => {
            if (!elements.searchInput.contains(e.target) && !elements.searchResults.contains(e.target)) {
                elements.searchResults.style.display = 'none';
            }

            modals.handleModalItemClick(e);
        });

        elements.playPauseBtn.addEventListener('click', player.togglePlayPause);
        elements.prevBtn.addEventListener('click', player.playPrevSong);
        elements.nextBtn.addEventListener('click', player.playNextSong);
        elements.shuffleBtn.addEventListener('click', player.toggleShuffle);
        elements.repeatBtn.addEventListener('click', player.toggleRepeat);
        elements.muteBtn.addEventListener('click', player.toggleMute);

        elements.audioPlayer.addEventListener('timeupdate', player.updateProgress);
        elements.audioPlayer.addEventListener('ended', () => {
            if (state.isRepeatOn && state.currentSongIndex !== -1) {
                player.loadAndPlaySong(state.songIds[state.currentSongIndex]);
            } else {
                player.playNextSong();
            }
        });

        elements.volumeControl.addEventListener('input', () => {
            elements.audioPlayer.volume = elements.volumeControl.value / 100;
        });

        elements.progressTrack.addEventListener('click', player.handleProgressClick);
    };

    // inicia a aplicação
    init();
});

