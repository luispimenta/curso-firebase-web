/**
 * Variáveis com referencias dos inputs
 */
var fileInput = document.getElementById('file-input');
var stringInput = document.getElementById('string-input');

/**
 * Referencia para o storage do firebase criando um pasta com o nome de arquivos.
 */
var ref = firebase.storage().ref('arquivos');
var tarefaDeUpload;

/**
 * Metodo que observa mudanças no input de arquivo
 */
fileInput.onchange = function (event) {
    var arquivo = event.target.files[0];
    // cria um id unico sem inserir nada no firebase realtime
    var uid = firebase.database().ref().push().key;

    /**
     * .child(nome) - Acessar o caminho para inserir o arquivo.
     * .put(arquivo) - Vai inserir o arquivo
     */
    // ref.child(uid).put(arquivo, {
    //     customMetadata: {
    //         nome: 'Curriculo'
    //     }
    // }).then(snapshot => {
    //     console.log('snapshot', snapshot);
    //     /**
    //      * .getdownloadURL() - retorna a url para download/apresentação desse arquivo enviado.
    //      */
    //     ref.child(uid).getDownloadURL().then(url => {
    //         console.log('string para download', url);
    //     });

    //     ref.child(uid).getMetadata().then(metadata => {
    //         console.log('metadados', metadata);
    //     });
    // });

    // .getMetadata() - retorna os metadados do arquivo inserido.
    // ref.child('arquivo').getMetadata().then(metadata => {
    //     console.log(metadata);
    // });

    // Atribui a tarefa de upload á variavel de tarefaDeUpload e executa essa tarefa ao dar o put()
    tarefaDeUpload = ref.child(uid).put(arquivo);

    // .on('state_changed', observavel_upload(), error(), completou())
    tarefaDeUpload.on('state_changed', upload => {
        console.log('mudou o estado', upload);
        // .state retorna o estado do upload. Ele pode ser running, paused ou success
        if(upload.state == 'running') {
            // .bytesTransferred são os bytes transferidos
            // .totalBytes são os bytes totais do arquivo
            var progresso = Math.round((upload.bytesTransferred / upload.totalBytes) * 100);
            console.log(`${progresso}%`);
        };
    }, error => {
        console.log('ocorreu um erro', error);
    }, () => {
        console.log('completou a tarefa');
        ref.child(uid).getDownloadURL().then(url => {
            console.log(url);
        });
    });

    // tarefaDeUpload.then(snapshot => {
    //     console.log('snapshot', snapshot);
    // }).catch(error => {
    //     // pega o erro e no nosso caso o cancelamento da tarefa
    //     console.log('error', error);
    // });
}

/**
 * Deleta um arquivo
 */
function deletar() {
    ref.child('-LSj8Y8gmpVN2hIwyOHw').delete().then(() => {
        console.log('deletou com sucesso');
    }).catch(error => {
        console.log('erro', error);
    })
}

/**
 * Metodo que observa mudanças no input de string
 */
stringInput.onchange = function (event) {
    var arquivo = event.target.files[0];

    const reader = new FileReader();
    reader.readAsDataURL(arquivo);
    reader.onload = function () {
        const base64 = reader.result.split('base64,')[1];

        /**
         * .putString(string, formato, metadados) - Salva uma string no firebase e eu posso colocar um formato de
         * imagem para que ele automaticamente converta para um png
         */
        ref.child('imagem').putString(base64, 'base64', {
            contentType: 'image/png'
        }).then(snapshot => {
            ref.child('imagem').getDownloadURL().then(url => {
                console.log('string para download', url);
            });
        });
    }
}

/**
 * Pausa a tarefa de upload
 */
pausar = function () {
    // pausa a tarefa
    tarefaDeUpload.pause();
    console.log('pausou tarefa');
}

// Continua a tarefa de upload pausada
continuar = function () {
    // continua tarefa
    tarefaDeUpload.resume();
    console.log('continuou tarefa');
}

// Cancela a tarefa de upload
cancelar = function () {
    // cancela tarefa
    tarefaDeUpload.cancel();
    console.log('cancelou tarefa');
}