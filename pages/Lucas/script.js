    const form = document.getElementById('settingsForm');
    const volumeControl = document.getElementById('volumeControl');
    const volumeValue = document.getElementById('volumeValue');
    const resetBtn = document.getElementById('resetBtn');

    // Define configurações padrão
    const defaultSettings = {
      audioQuality: 'medium',
      equalizerPreset: 'normal',
      backgroundPlayback: true,
      notifications: true,
      volumeControl: 50,
      theme: 'system'
    };

    // Atualiza o valor exibido do slider de volume
    function updateVolumeDisplay(value) {
      volumeValue.textContent = value;
      volumeControl.setAttribute('aria-valuenow', value);
    }

    // Salva as configurações no localStorage
    function saveSettings(settings) {
      localStorage.setItem('musicAppSettings', JSON.stringify(settings));
    }

    // Carrega as configurações do localStorage ou padrão
    function loadSettings() {
      const savedSettings = localStorage.getItem('musicAppSettings');
      if (savedSettings) {
        return JSON.parse(savedSettings);
      }
      return {...defaultSettings};
    }

    // Preenche o formulário com as configurações
    function fillForm(settings) {
      form.audioQuality.value = settings.audioQuality;
      form.equalizerPreset.value = settings.equalizerPreset;
      form.backgroundPlayback.checked = settings.backgroundPlayback;
      form.notifications.checked = settings.notifications;
      form.volumeControl.value = settings.volumeControl;
      updateVolumeDisplay(settings.volumeControl);
      form.theme.value = settings.theme;
    }

    // Captura as configurações do formulário
    function getFormSettings() {
      return {
        audioQuality: form.audioQuality.value,
        equalizerPreset: form.equalizerPreset.value,
        backgroundPlayback: form.backgroundPlayback.checked,
        notifications: form.notifications.checked,
        volumeControl: parseInt(form.volumeControl.value),
        theme: form.theme.value
      };
    }

    // Lida com o envio do formulário (salvar)
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const settings = getFormSettings();
      saveSettings(settings);
      alert('Configurações salvas com sucesso!');
    });

    // Atualizar valor do volume em tempo real
    volumeControl.addEventListener('input', () => {
      updateVolumeDisplay(volumeControl.value);
    });

    // Botão resetar configurações
    resetBtn.addEventListener('click', () => {
      fillForm(defaultSettings);
      saveSettings(defaultSettings);
      alert('Configurações resetadas para padrão.');
    });
      
    function navigate(event) {
      event.preventDefault();
      window.location.href = "../Mayara/musica.html";
    }