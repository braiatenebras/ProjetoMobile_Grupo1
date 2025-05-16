document.addEventListener('DOMContentLoaded', function () {
    // elementos do DOM
    const formRecuperacao = document.getElementById('formRecuperacao');
    const telaLoading = document.getElementById('telaLoading');
    const botaoAltereiSenha = document.getElementById('botaoAltereiSenha');
    const modalSucesso = document.getElementById('modalSucesso');
    const inputTelefone = document.getElementById('telefone');
    const inputEmail = document.getElementById('email');

    // máscara para telefone (formato brasileiro)
    inputTelefone.addEventListener('input', function (e) {
        let value = e.target.value.replace(/\D/g, '');
        let formattedValue = '';

        if (value.length > 0) {
            formattedValue = `(${value.substring(0, 2)}`;
        }
        if (value.length > 2) {
            formattedValue += `) ${value.substring(2, 7)}`;
        }
        if (value.length > 7) {
            formattedValue += `-${value.substring(7, 11)}`;
        }

        e.target.value = formattedValue;
    });

    // validação do formulário de recuperação
    formRecuperacao.addEventListener('submit', function (e) {
        e.preventDefault();

        const email = inputEmail.value.trim();
        const telefone = inputTelefone.value.replace(/\D/g, '').trim();

        if (!email && !telefone) {
            mostrarErro('Por favor, preencha pelo menos um dos campos: e-mail ou telefone.');
            return;
        }

        if (email && !validarEmail(email)) {
            mostrarErro('Por favor, insira um endereço de e-mail válido.');
            return;
        }

        if (telefone && !validarTelefone(telefone)) {
            mostrarErro('Por favor, insira um número de telefone válido com DDD (11 dígitos).');
            return;
        }

        mostrarLoading();

        // simulação de envio
        setTimeout(function () {
            esconderLoading();
            mostrarSucesso('Solicitação enviada com sucesso! Verifique seu e-mail ou telefone para as instruções.');
            formRecuperacao.reset();
        }, 2000);
    });

    // função do botão "Alterei a Senha"
    botaoAltereiSenha.addEventListener('click', function () {
        mostrarModalSucesso();

        setTimeout(function () {
            esconderModalSucesso();
            mostrarLoading('Redirecionando...');

            setTimeout(function () {
                window.location.href = "../../index.html";
            }, 1500);
        }, 2000);
    });

    // funções de validação
    function validarEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function validarTelefone(telefone) {
        return telefone.length === 10 || telefone.length === 11;
    }

    // funções de UI
    function mostrarErro(mensagem) {
        const erroElemento = document.createElement('div');
        erroElemento.className = 'mensagem-erro';
        erroElemento.textContent = mensagem;

        // remove mensagens antigas
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