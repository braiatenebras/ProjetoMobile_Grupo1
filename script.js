document.addEventListener('DOMContentLoaded', function () {
    // alternar visibilidade da senha
    const alternarSenha = document.getElementById('alternarSenha');
    const senhaInput = document.getElementById('senha');

    alternarSenha.addEventListener('click', function () {
        if (senhaInput.type === 'password') {
            senhaInput.type = 'text';
            alternarSenha.classList.replace('fa-eye', 'fa-eye-slash');
        } else {
            senhaInput.type = 'password';
            alternarSenha.classList.replace('fa-eye-slash', 'fa-eye');
        }
    });

    // função para mostrar modal de login social
    function mostrarModalLogin(servico, icone, cor) {
        const modal = document.createElement('div');
        modal.className = 'modal-simulacao';
        modal.innerHTML = `
            <div class="modal-conteudo">
                <div class="modal-cabecalho">
                    <i class="${icone}" style="color: ${cor}"></i>
                    <h3>Login com ${servico}</h3>
                </div>
                <p>Esta é uma simulação. Em um site real, você seria redirecionado para a página de autenticação do ${servico}.</p>
                <div class="modal-botoes">
                    <button class="modal-cancelar">Cancelar</button>
                    <button class="modal-confirmar">Continuar</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);


        function fecharModal() {
            modal.classList.add('fade-out');
            setTimeout(() => {
                if (document.body.contains(modal)) {
                    document.body.removeChild(modal);
                }
                document.removeEventListener('keydown', fecharComESC);
            }, 300);
        }

        // fechar modal ao clicar em cancelar
        modal.querySelector('.modal-cancelar').addEventListener('click', fecharModal);

        // simular login bem-sucedido ao clicar em continuar
        modal.querySelector('.modal-confirmar').addEventListener('click', function () {
            fecharModal();
            mostrarMensagemSucesso(servico);
        });
    }

    // login com Google
    document.getElementById('btnGoogle').addEventListener('click', function () {
        mostrarModalLogin('Google', 'fab fa-google', '#db4437');
    });

    // login com Apple
    document.getElementById('btnApple').addEventListener('click', function () {
        mostrarModalLogin('Apple', 'fab fa-apple', '#a2aaad');
    });

    // login com email/senha
    document.getElementById('formLogin').addEventListener('submit', function (e) {
        e.preventDefault();
        mostrarMensagemSucesso('Email');
    });

    // mostrar mensagem de sucesso e redirecionar
    function mostrarMensagemSucesso(servico) {
        const mensagem = document.createElement('div');
        mensagem.className = 'mensagem-sucesso';
        mensagem.innerHTML = `
            <div class="mensagem-conteudo">
                <i class="fas fa-check-circle"></i>
                <p>Login com ${servico} simulado com sucesso!</p>
            </div>
        `;

        document.body.appendChild(mensagem);

        setTimeout(() => {
            mensagem.classList.add('fade-out');
            setTimeout(() => {
                if (document.body.contains(mensagem)) {
                    document.body.removeChild(mensagem);
                }
                // levar para outra tela
                window.location.href = "pages/Ana/landingpage.html";
            }, 500);
        }, 3000);
    }
});