document.addEventListener('DOMContentLoaded', function () {
    // obter o formulário de criação de conta
    const formCriarConta = document.getElementById('formLogin');

    // adicionar evento de submit ao formulário
    formCriarConta.addEventListener('submit', function (e) {
        e.preventDefault();

        // verificar se as senhas coincidem
        const senha = document.querySelector('input[type="password"][placeholder="Senha"]').value;
        const confirmarSenha = document.querySelector('input[type="password"][placeholder="Confirme sua Senha"]').value;

        if (senha !== confirmarSenha) {
            mostrarMensagemErro('As senhas não coincidem!');
            return;
        }

        // se tudo estiver ok, mostrar mensagem de sucesso
        mostrarMensagemSucesso();
    });

    // função para mostrar mensagem de erro
    function mostrarMensagemErro(mensagem) {
        const mensagemErro = document.createElement('div');
        mensagemErro.className = 'mensagem-erro';
        mensagemErro.innerHTML = `
            <div class="mensagem-conteudo">
                <i class="fas fa-exclamation-circle"></i>
                <p>${mensagem}</p>
            </div>
        `;

        document.body.appendChild(mensagemErro);

        setTimeout(() => {
            mensagemErro.classList.add('fade-out');
            setTimeout(() => {
                if (document.body.contains(mensagemErro)) {
                    document.body.removeChild(mensagemErro);
                }
            }, 500);
        }, 3000);
    }

    // função para mostrar mensagem de sucesso e redirecionar
    function mostrarMensagemSucesso() {
        const mensagem = document.createElement('div');
        mensagem.className = 'mensagem-sucesso';
        mensagem.innerHTML = `
            <div class="mensagem-conteudo">
                <i class="fas fa-check-circle"></i>
                <p>Conta criada com sucesso!</p>
            </div>
        `;

        document.body.appendChild(mensagem);

        setTimeout(() => {
            mensagem.classList.add('fade-out');
            setTimeout(() => {
                if (document.body.contains(mensagem)) {
                    document.body.removeChild(mensagem);
                }

                // mostrar tela de loading
                const telaLoading = document.getElementById('telaLoading');
                telaLoading.classList.add('ativo');

                // redirecionar após o tempo para mostrar o loading
                setTimeout(() => {
                    window.location.href = "../../index.html";
                }, 1000);

            }, 500);
        }, 3000);
    }
});