function logout() {
    // Faço um logout do meu usuário (saio da aplicação).
    firebase.auth().signOut().then(() =>{
        alert('Usuário deslogou');
    })
}

/**
 * Listener de dom ready
 */
document.addEventListener("DOMContentLoaded", function () {
    // nova instancia do firebaseui
    var ui = new firebaseui.auth.AuthUI(firebase.auth());

    // configurações do firebaseui
    var config = {
        callbacks : {
            signInSuccessWithAuthResult: function(authResult) {
                console.log('authResult', authResult);
                return false;
            }
        },
        signInOptions: [
            firebase.auth.EmailAuthProvider.PROVIDER_ID,
            firebase.auth.FacebookAuthProvider.PROVIDER_ID,
            firebase.auth.GoogleAuthProvider.PROVIDER_ID,
            firebase.auth.GithubAuthProvider.PROVIDER_ID,
            {
                provider: firebase.auth.PhoneAuthProvider.PROVIDER_ID,
                defaultCountry: 'BR'
            }
        ],
        signInFlow: 'popup'
    };

    // inicializa o firebaseui
    ui.start('#firebaseui-auth', config);
})