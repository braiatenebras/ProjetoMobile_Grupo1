const body = document.body;
let angle = 270;
let direction = 1;
function animateGradient() {
  // Modifica o ângulo de 270 a 450 graus e volta para gerar movimento diferente
  angle += direction * 0.1;
  if(angle > 450) direction = -1;
  else if(angle < 270) direction = 1;
  body.style.background = `linear-gradient(${angle}deg, #ff6a00, #ee0979, #ff6a00, #ee0979)`;
  body.style.backgroundSize = '800% 800%';
  requestAnimationFrame(animateGradient);
}
animateGradient();

const button = document.querySelector('.play-pause-btn');
    button.addEventListener('click', () => {
      if (button.classList.contains('paused')) {
        button.classList.remove('paused');
        button.classList.add('playing');
      } else {
        button.classList.remove('playing');
        button.classList.add('paused');
      }
    });