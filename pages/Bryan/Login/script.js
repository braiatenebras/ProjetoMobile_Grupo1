document.addEventListener('DOMContentLoaded', function () {
    const alternarsenha = document.getElementById('alternarSenha');
    const senhainput = document.getElementById('senha');

    // evento de clique no ícone para alternar a visibilidade da senha
    alternarsenha.addEventListener('click', function () {
        if (senhainput.type === 'password') {
            senhainput.type = 'text';
            alternarsenha.classList.replace('fa-eye', 'fa-eye-slash');
        } else {
            senhainput.type = 'password';
            alternarsenha.classList.replace('fa-eye-slash', 'fa-eye');
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

        function fecharComESC(e) {
            if (e.key === "Escape") fecharModal();
        }

        document.addEventListener('keydown', fecharComESC);

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
                window.location.href = '../../../index.html';
            }, 500);
        }, 3000);
    }

    document.getElementById('formLogin').addEventListener('submit', function (e) {
        e.preventDefault(); // impede o comportamento padrão de recarregar a página

        const email = document.getElementById('email').value.trim();
        const senha = document.getElementById('senha').value;

        if (!email || !senha) {
            mostraerro('Preencha todos os campos.');
            return;
        }

        // login com Firebase Auth usando e-mail e senha
        firebase.auth().signInWithEmailAndPassword(email, senha)
            .then((usercredential) => {
                console.log('login bem-sucedido:', usercredential);
                mostrarmensagemsucesso('email');
            })
            .catch((error) => {
                let mensagem = '';

                switch (error.code) {
                    case 'auth/user-not-found':
                        mensagem = 'E-mail não cadastrado.';
                        break;
                    case 'auth/wrong-password':
                        mensagem = 'Senha incorreta.';
                        break;
                    case 'auth/invalid-email':
                        mensagem = 'Formato de e-mail inválido.';
                        break;
                    case 'auth/too-many-requests':
                        mensagem = 'Muitas tentativas. Tente novamente mais tarde.';
                        break;
                    case 'auth/invalid-credential':
                        mensagem = 'Credenciais inválidas. Verifique seu e-mail e senha.';
                        break;
                    default:
                        mensagem = 'Erro ao fazer login. Verifique seus dados.';
                }

                mostraerro(mensagem);
            });
    });

    // função para mostrar mensagem de sucesso no login
    function mostrarmensagemsucesso(servico) {
        const mensagem = document.createElement('div');
        mensagem.className = 'mensagem-sucesso';
        mensagem.innerHTML = `
            <div class="mensagem-conteudo">
                <i class="fas fa-check-circle"></i>
                <p>Login com ${servico} realizado com sucesso!</p>
            </div>
        `;

        document.body.appendChild(mensagem);

        setTimeout(() => {
            mensagem.classList.add('fade-out');
            setTimeout(() => {
                if (document.body.contains(mensagem)) {
                    document.body.removeChild(mensagem);
                }
                window.location.href = '../../../index.html';
            }, 500);
        }, 1000);
    }

    // função para mostrar mensagem de erro no login
    function mostraerro(texto) {
        const erro = document.createElement('div');
        erro.className = 'mensagem-erro';
        erro.innerHTML = `
            <div class="mensagem-conteudo">
                <i class="fas fa-exclamation-circle"></i>
                <p>${texto}</p>
            </div>
        `;

        document.body.appendChild(erro);

        setTimeout(() => {
            erro.classList.add('fade-out');
            setTimeout(() => {
                if (document.body.contains(erro)) {
                    document.body.removeChild(erro);
                }
            }, 500);
        }, 4000);
    }
});
