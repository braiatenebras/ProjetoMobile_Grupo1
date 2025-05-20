document.addEventListener('DOMContentLoaded', function () {
    // Elementos do DOM
    const formRecuperacao = document.getElementById('formRecuperacao');
    const telaLoading = document.getElementById('telaLoading');
    const modalSucesso = document.getElementById('modalSucesso');
    const inputEmail = document.getElementById('email');

    // Validação e envio do formulário
    formRecuperacao.addEventListener('submit', function (e) {
        e.preventDefault();

        const email = inputEmail.value.trim();

        if (!email) {
            mostrarErro('Por favor, insira um endereço de e-mail.');
            return;
        }

        if (!validarEmail(email)) {
            mostrarErro('Por favor, insira um endereço de e-mail válido.');
            return;
        }

        mostrarLoading();

        firebase.auth().sendPasswordResetEmail(email)
            .then(() => {
                esconderLoading();
                mostrarSucesso('E-mail de redefinição enviado com sucesso! Verifique sua caixa de entrada.');
                formRecuperacao.reset();

                setTimeout(() => {
                    window.location.href = "../Login/login.html";
                }, 3000);
            })

            .catch((error) => {
                esconderLoading();
                let mensagemErro = 'Ocorreu um erro ao enviar o e-mail.';

                if (error.code === 'auth/user-not-found') {
                    mensagemErro = 'Usuário não encontrado com este e-mail.';
                } else if (error.code === 'auth/invalid-email') {
                    mensagemErro = 'E-mail inválido.';
                }

                mostrarErro(mensagemErro);
            });
    });


    // Funções de validação
    function validarEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // Funções de UI
    function mostrarErro(mensagem) {
        const erroElemento = document.createElement('div');
        erroElemento.className = 'mensagem-erro';
        erroElemento.textContent = mensagem;

        // Remove mensagens antigas
        document.querySelectorAll('.mensagem-erro').forEach(msg => msg.remove());
        formRecuperacao.prepend(erroElemento);

        setTimeout(() => erroElemento.classList.add('mostrar'), 10);
        setTimeout(() => {
            erroElemento.classList.remove('mostrar');
            setTimeout(() => erroElemento.remove(), 300);
        }, 5000);
    }

    function mostrarSucesso(mensagem) {
        const sucessoElemento = document.createElement('div');
        sucessoElemento.className = 'mensagem-sucesso';
        sucessoElemento.textContent = mensagem;

        document.body.appendChild(sucessoElemento);

        setTimeout(() => sucessoElemento.classList.add('mostrar'), 10);
        setTimeout(() => {
            sucessoElemento.classList.remove('mostrar');
            setTimeout(() => sucessoElemento.remove(), 300);
        }, 5000);
    }

    function mostrarLoading(mensagem = 'Enviando solicitação...') {
        telaLoading.querySelector('p').textContent = mensagem;
        telaLoading.style.display = 'flex';
    }

    function esconderLoading() {
        telaLoading.style.display = 'none';
    }

    function mostrarModalSucesso() {
        modalSucesso.style.display = 'flex';
    }

    function esconderModalSucesso() {
        modalSucesso.style.display = 'none';
    }
});
