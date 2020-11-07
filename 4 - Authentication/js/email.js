var currentUser;

/**
 * Função para cadastro com email e senha
 */
function createLogin() {
    var email = document.getElementById('email').value;
    var senha = document.getElementById('senha').value;
    // Crio um usuário com email e senha
    firebase.auth().createUserWithEmailAndPassword(email,senha).then(user => {
        console.log('usuario', user);
        alert('Usuario criado e logado');
    }).catch(err => {
        console.log('error', error);
    });
}

/**
 * Função para login
 */
function loginEmail() {
    var email = document.getElementById('email').value;
    var senha = document.getElementById('senha').value;

    // Faço login e autentico o usuário com email e senha
    firebase.auth().signInWithEmailAndPassword(email, senha).then(() => {
        alert('Usuário logado');
    }).catch(err => {
        console.log('error', error);
    });
}

/**
 * Listener de dom ready
 */
document.addEventListener("DOMContentLoaded", function () {
    // Observa se há um usuário e mudanças na autenticação (login e logout)
    firebase.auth().onAuthStateChanged((usuario) => {
        if(usuario) {
            console.log('usuario', usuario);
            currentUser = usuario;

            // Mudando o idioma do firebase
            // firebase.auth().languageCode = 'pt';
            // Ele muda o idioma, porém utilizando o idioma do aparelho
            firebase.auth().useDeviceLanguage();

            if(!usuario.emailVerified) {
                // Envia um email para o usuario verificar a conta dele.
                // usuario.sendEmailVerification().then(() => {
                //     alert('email de verificação enviado');
                // });
            };

            // Envia um email para mudança de senha ao email passado por parametro.
            // firebase.auth().sendPasswordResetEmail(usuario.email).then(() => {
            //     alert('Email para reset de senha enviado');
            // })
        } else {
            console.log('não há usuários logados');
        }
    });

    // Vai pegar dados do usuário
    currentUser = firebase.auth().currentUser;

    if(currentUser) {
        console.log('currentUser', currentUser);
        // Metodos para update de dados do usuário criado no auth()
        currentUser.updateProfile({
            displayName: "Gabriel Barreto",
            photoURL: ''
        });
        // currentUser.updateEmail('gabriel-gdr@hotmail.com');
        // currentUser.updatePassword('qwerty');
        // currentUser.updatePhoneNumber('+5511xxxxxxxxx');
    }
});

/**
 * Deleta um usuário
 */
function deletaUsuario() {
    if (currentUser) {
        currentUser.delete().then(() => {
            alert('usuario excluido');
        });
    }
}