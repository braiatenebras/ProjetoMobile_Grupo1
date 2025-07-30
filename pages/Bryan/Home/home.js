// Funções básicas para interatividade
document.addEventListener('DOMContentLoaded', function () {
    // Alternar play/pause
    const playPauseBtn = document.querySelector('.play-pause');
    if (playPauseBtn) {
        playPauseBtn.addEventListener('click', function () {
            const icon = this.querySelector('i');
            if (icon.classList.contains('fa-play')) {
                icon.classList.remove('fa-play');
                icon.classList.add('fa-pause');
            } else {
                icon.classList.remove('fa-pause');
                icon.classList.add('fa-play');
            }
        });
    }

    // Simular progresso da música
    const progressFill = document.querySelector('.progress-fill');
    if (progressFill) {
        let progress = 0;
        setInterval(() => {
            if (progress < 100) {
                progress += 0.5;
                progressFill.style.width = `${progress}%`;
            }
        }, 1000);
    }

});