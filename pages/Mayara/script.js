const body = document.body;
let angle = 270;
let direction = 1;
function animateGradient() {
  angle += direction * 0.1;
  if(angle > 450) direction = -1;
  else if(angle < 270) direction = 1;
  body.style.background = `linear-gradient(${angle}deg, #0f3460, #4B0082, #0f3460, #4B0082)`;
  body.style.backgroundSize = '800% 800%';
  requestAnimationFrame(animateGradient);
}
animateGradient();

const playPauseButton = document.querySelector('.play-pause-btn');

playPauseButton.addEventListener('click', () => {
    playPauseButton.classList.toggle('paused');

    
    const playIcon = playPauseButton.querySelector('.bi-play-fill');
    const pauseIcon = playPauseButton.querySelector('.bi-pause-fill');

    if (playPauseButton.classList.contains('paused')) {
        playIcon.style.display = 'block';
        pauseIcon.style.display = 'none';
    } else {
        playIcon.style.display = 'none';
        pauseIcon.style.display = 'block';
    }
});
