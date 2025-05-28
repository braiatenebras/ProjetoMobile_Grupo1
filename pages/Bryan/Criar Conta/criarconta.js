document.addEventListener('DOMContentLoaded', function () {
    const formCriarConta = document.getElementById('formLogin');
    const inputTelefone = document.getElementById('telefone');
    const telaLoading = document.getElementById('telaLoading');

    // formata o telefone automaticamente
    inputTelefone.addEventListener('input', function (e) {
        let value = e.target.value.replace(/\D/g, '');
        let formatted = '';

        if (value.length > 0) formatted = `(${value.substring(0, 2)}`;
        if (value.length > 2) formatted += `) ${value.substring(2, 7)}`;
        if (value.length > 7) formatted += `-${value.substring(7, 11)}`;

        e.target.value = formatted;
    });

    formCriarConta.addEventListener('submit', function (e) {
        e.preventDefault();

        const nome = formCriarConta.querySelector('input[placeholder="Nome"]').value.trim();
        const email = formCriarConta.querySelector('input[type="email"]').value.trim();
        const senha = document.getElementById('senha').value;
        const confirmarSenha = document.getElementById('confirmarSenha').value;
        const telefone = inputTelefone.value.trim();

        if (!nome || !email || !senha || !confirmarSenha || !telefone) {
            mostrarMensagem('Preencha todos os campos.', 'erro');
            return;
        }

        if (senha !== confirmarSenha) {
            mostrarMensagem('As senhas não coincidem.', 'erro');
            return;
        }

        const phoneDigits = telefone.replace(/\D/g, '');
        if (phoneDigits.length < 10 || phoneDigits.length > 11) {
            mostrarMensagem('Telefone inválido. insira o ddd.', 'erro');
            return;
        }

        telaLoading.classList.add('ativo');

        firebase.auth().createUserWithEmailAndPassword(email, senha)
            .then((userCredential) => {
                const user = userCredential.user;
                return user.updateProfile({ displayName: nome });
            })
            .then(() => {
                mostrarMensagem('Conta criada com sucesso!', 'sucesso', true);
            })
            .catch((error) => {
                telaLoading.classList.remove('ativo');
                let mensagem = 'Erro ao criar conta.';

                if (error.code === 'auth/email-already-in-use') {
                    mensagem = 'E-mail já está em uso.';
                } else if (error.code === 'auth/invalid-email') {
                    mensagem = 'E-mail inválido.';
                } else if (error.code === 'auth/weak-password') {
                    mensagem = 'A senha deve ter pelo menos 6 caracteres.';
                }

                mostrarMensagem(mensagem, 'erro');
            });
    });

    function mostrarMensagem(texto, tipo, redirecionar = false) {
        const icone = tipo === 'erro' ? 'fa-exclamation-circle' : 'fa-check-circle';
        const div = document.createElement('div');

        div.className = `mensagem-${tipo}`;
        div.innerHTML = `
            <div class="mensagem-conteudo">
                <i class="fas ${icone}"></i>
                <p>${texto}</p>
            </div>
        `;

        document.body.appendChild(div);

        setTimeout(() => {
            div.classList.add('fade-out');
            setTimeout(() => {
                if (document.body.contains(div)) document.body.removeChild(div);
                if (tipo === 'sucesso' && redirecionar) {
                    window.location.href = '../Login/login.html';
                }
            }, 500);
        }, 3000);
    }
});
