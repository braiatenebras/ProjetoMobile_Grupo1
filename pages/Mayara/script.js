// Fundo degradê
const body = document.body;
let angle = 270;
let direction = 1;
function animateGradient() {
  angle += direction * 0.1;
  if(angle > 450) direction = -1;
  else if(angle < 270) direction = 1;
  body.style.background = `linear-gradient(${angle}deg, #0f3460, #673ab7, #0f3460, #673ab7)`;
  body.style.backgroundSize = '800% 800%';
  requestAnimationFrame(animateGradient);
}
animateGradient();

// Botão de play
const playPauseButton = document.querySelector('.play-pause-btn');
       
const audio = document.getElementById('audio');
        const progress = document.getElementById('progress');
        const progressBar = document.getElementById('progress-bar');
        const currentTimeDisplay = document.getElementById('current-time');
        const durationDisplay = document.getElementById('duration');

        const playIcon = playPauseButton.querySelector('.bi-play-fill');
        const pauseIcon = playPauseButton.querySelector('.bi-pause-fill');

        playIcon.style.display = 'block';
        pauseIcon.style.display = 'none';

         // Atualiza a duração quando a música é carregada
         audio.addEventListener('loadedmetadata', () => {
            durationDisplay.textContent = formatTime(audio.duration);
        });

        playPauseButton.addEventListener('click', () => {
            playPauseButton.classList.toggle('paused');
            if (playPauseButton.classList.contains('paused')) {
                playIcon.style.display = 'block';
                pauseIcon.style.display = 'none';
            } else {
                playIcon.style.display = 'none';
                pauseIcon.style.display = 'block';
            }
        });

         // Atualiza a barra de progresso e o tempo atual
         audio.addEventListener('timeupdate', () => {
            const progressPercent = (audio.currentTime / audio.duration) * 100;
            progressBar.style.width = progressPercent + '%';
            currentTimeDisplay.textContent = formatTime(audio.currentTime);
        });
        // Permite que o usuário clique na barra de progresso para mudar a posição da música
        progress.addEventListener('click', (event) => {
            const rect = progress.getBoundingClientRect();
            const offsetX = event.clientX - rect.left;
            const totalWidth = rect.width;
            const clickPercent = offsetX / totalWidth;
            audio.currentTime = clickPercent * audio.duration;
        });
        // Função para formatar o tempo em minutos e segundos
        function formatTime(seconds) {
            const minutes = Math.floor(seconds / 60);
            const secs = Math.floor(seconds % 60);
            return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
        }
        


        document.getElementById('bluetoothButton').addEventListener('click', function() {
            // Verifica se a API Web Bluetooth é suportada
            if (navigator.bluetooth) {
                navigator.bluetooth.requestDevice({ acceptAllDevices: true })
                    .then(device => {
                        console.log('Dispositivo Bluetooth conectado:', device);
                    })
                    .catch(error => {
                        console.error('Erro ao conectar ao dispositivo Bluetooth:', error);
                    });
            } else {
                console.error('API Web Bluetooth não é suportada neste navegador.');
            }
        });