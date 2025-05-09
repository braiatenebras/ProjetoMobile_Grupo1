document.addEventListener('DOMContentLoaded', function() {
    const formCriarConta = document.getElementById('formLogin');
    const inputTelefone = document.querySelector('input[type="tel"]');
    const telaLoading = document.getElementById('telaLoading');

    // telefone formato
    if (inputTelefone) {
        inputTelefone.addEventListener('input', function(e) {
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
    }

    formCriarConta.addEventListener('submit', function(e) {
        e.preventDefault();

        // validação senha
        const senha = document.querySelector('input[type="password"][placeholder="Senha"]').value;
        const confirmarSenha = document.querySelector('input[type="password"][placeholder="Confirme sua Senha"]').value;

        if (senha !== confirmarSenha) {
            mostrarMensagem('As senhas não coincidem!', 'erro');
            return;
        }

        // validação telefone
        if (inputTelefone) {
            const phoneDigits = inputTelefone.value.replace(/\D/g, '');
            if (phoneDigits.length > 0 && (phoneDigits.length < 10 || phoneDigits.length > 11)) {
                mostrarMensagem('Por favor, insira um número de telefone válido com DDD (10 ou 11 dígitos)', 'erro');
                return;
            }
        }

        // se tudo estiver certo, simula o envio
        mostrarMensagem('Conta criada com sucesso!', 'sucesso');
    });

    function mostrarMensagem(mensagem, tipo) {
        const icon = tipo === 'erro' ? 'fa-exclamation-circle' : 'fa-check-circle';
        const mensagemElement = document.createElement('div');
        mensagemElement.className = `mensagem-${tipo}`;
        mensagemElement.innerHTML = `
            <div class="mensagem-conteudo">
                <i class="fas ${icon}"></i>
                <p>${mensagem}</p>
            </div>
        `;

        document.body.appendChild(mensagemElement);

        setTimeout(() => {
            mensagemElement.classList.add('fade-out');
            setTimeout(() => {
                if (document.body.contains(mensagemElement)) {
                    document.body.removeChild(mensagemElement);
                }

                if (tipo === 'sucesso') {
                    telaLoading.classList.add('ativo');
                    setTimeout(() => {
                        window.location.href = "../../index.html";
                    }, 1000);
                }
            }, 500);
        }, 3000);
    }
});