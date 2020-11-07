/**
 * Váriaveis usadas durante o desenvolvimento
 */
var CARD_CONTAINER = document.getElementsByClassName('card-container')[0];
var NOMES = ["Anderson", "Beatriz", "Caio", "Daniela", "Everton", "Fabiana", "Gabriel", "Hortencia", "Igor", "Joana"];

/**
 * firebase: objeto global
 * database(): metodo para acesso ao realtime database.
 * ref(): url em string para referencia do caminho do banco
 */
var ref = firebase.database().ref('card');

/**
 * Botão para cria um card no card-contaier
 */
function criarCard() {
    var card = {
        nome: NOMES[Math.floor(Math.random() * NOMES.length - 1)],
        idade: Math.floor(Math.random() * 22 + 18),
        curtidas: 0
    };

    /**
     * set(): metodo que cria dados na url passada
     * child(): Acessa o nó filho passado por parametro
     */
    // ref.child(card.nome).set(card).then(() => {
    //     adicionaCardATela(card);
    // });

    /**
     * push(): cria um id unico e insere os dados dentro desse uid
     */
    // ref.push(card).then(snapshot => {
    //     // adicionaCardATela(card, snapshot.key);
    // });

    /**
     * USANDO FETCH PARA ADICIONAR UM CARD
     */
    fetch('https://curso-firebase-webapps.firebaseio.com/card.json', {
        body: JSON.stringify(card),
        method: 'POST',
        mode: 'no-cors'
    }).catch(err => console.log(err));
};

/**
 * Recebe a referencia do card e exclui do banco de dados
 * @param {String} id Id do card
 */
function deletar(id) {
    var card = document.getElementById(id);

    // .remove(): remove o nó em que o metodo é utilizado, remove também todos os nós dentro desse nó removido.
    ref.child(id).remove().then(() => {
        card.remove();
    });

    // .set(null): Ao setar um nó em nulo exclui esse nó do firebase
    // ref.child(id).set(null).then(() =>{
    //     card.remove();
    // });
};

/**
 * Incrementa o numero de curtidas
 * @param {String} id Id do card
 */
function curtir(id) {
    var card = document.getElementById(id);
    var count = card.getElementsByClassName('count-number')[0];
    var countNumber = +count.innerText;
    countNumber = countNumber + 1;
    // .set(): Pode ser acessado diretamente o objeto que quer atualizar e passar o valor atualizado
    // ou pode-se passar o objeto completo e atualiza-lo com os novos valores nos campos correspondentes;
    ref.child(id + '/curtidas').set(countNumber).then(() => {
        count.innerText = countNumber;
    }, err => {
        console.log('erro ao curtir', err);
    });
};

/**
 * Decrementa o numero de curtidas
 * @param {String} id Id do card
 */
function descurtir(id) {
    var card = document.getElementById(id);
    var count = card.getElementsByClassName('count-number')[0];
    var countNumber = +count.innerText;
    if (countNumber > 0) {
        countNumber = countNumber - 1;
        // update(): Recebe um objeto (e apenas um objeto) e atualiza APENAS as propriedades desse objeto
        ref.child(id).update({
            curtidas: countNumber
        }).then(() => {
            count.innerText = countNumber;
        }).catch((err) => {
            console.log('erro ao descurtir', err);
        });
    };
};

/**
 * Espera o evento de que a DOM está pronta para executar algo
 */
document.addEventListener("DOMContentLoaded", function () {
    // LOGGING DO STATUS DAS CHAMADAS DO FIREBASE
    // firebase.database.enableLogging(function(message) {
    //     console.log('[Firebase]', message);
    // });
    /**
     * once(): retorna os dados lidos de uma URL
     * snapshot: objeto retornado pela leitura
     */
    // ref.once('value').then(snapshot => {
    // acessa um nó filho
    // console.log('child', snapshot.child('-LQGr2gZN3cGfZE5BqFs').val());

    // checa se existe algo no snapshot
    // console.log('exists()', snapshot.exists());

    // se existe o filho passado na url
    // console.log('hasChild() nome', snapshot.hasChild('-LQGr2gZN3cGfZE5BqFs/nome'));
    // console.log('hasChild() comentario', snapshot.hasChild('-LQGr2gZN3cGfZE5BqFs/comentario'));

    // se existe algum filho no nó
    // console.log('hasChildren()', snapshot.child('-LQGr2gZN3cGfZE5BqFs').hasChildren());

    // numero de filhos no snapshot
    // console.log('numChildren()', snapshot.numChildren());

    // a chave desse snapshot/caminho
    // console.log('chave', snapshot.key);
    //     snapshot.forEach(value => {
    //          console.log('chave', value.key);
    //         adicionaCardATela(value.val(), value.key);
    //     });
    // });

    /**
     * ON
     */
    // ref.on('value', snapshot => {
    //     console.log('value', snapshot.key);
    //     snapshot.forEach(value => {
    //         adicionaCardATela(value.val(), value.key);
    //     });
    // });

    // ref.on('child_added', snapshot => {
    //     console.log('child_added', snapshot.key);
    //     adicionaCardATela(snapshot.val(), snapshot.key);
    // });

    // ref.on('child_changed', (snapshot, uid) => {
    //     console.log('child_changed', snapshot.key + ' - ' + uid);
    // });

    // ref.on('child_removed', snapshot => {
    //     console.log('child_removed', snapshot.key);
    // });

    /**
     * ORDERNAÇÃO
     * .orderByChild('filho'): Ordena pela propriedade filho passado como parametro
     * .orderByKey(): Ordernar pela chave dos nós
     * .orderByValue(): Ordena pelo valor de cada propriedade dentro do nó, não vale para nós que tenham como filho outros nós
     * !!! É possivel utilizar apenas um metodo de ordenação por vez !!!
     */
    // ref.child('-LQW4HkgzSKKZbvUFW-P').orderByValue().on('child_added', snapshot => {
    //     console.log('O valor da chave ' + snapshot.key + ' é ' + snapshot.val());
    //     // adicionaCardATela(snapshot.val(), snapshot.key);
    // });

    /** 
     * Filtro
     * .startAt(): Traz valores cujo valor passado na query comece no valor da propriedade selecionada.
     * .endAt(): Traz valores cujo valor passado na query vá até o valor da propriedade selecionada.
     * .equalTo(): Traz valores cujo valor passado na query bata exatamente com o valor da propriedade selecionada
     */
    // ref.orderByChild('idade').startAt(25).endAt(35).on('child_added', snapshot => {
    //     adicionaCardATela(snapshot.val(), snapshot.key);
    // });

    /**
     * Limites
     * limitToFirst(Number): Retorna apenas os primeiros valores de acordo com o numero passado por parametro.
     * limitToLast(Number): Retorna apenas os ultimos valores de acordo com o numero passado por parametro
     */
    // ref.orderByChild('idade').startAt(0).limitToLast(20).on('child_added', snapshot => {
    //     adicionaCardATela(snapshot.val(), snapshot.key);
    // });

    // ref.on('value', snapshot => {
    //     snapshot.forEach(value => {
    //         adicionaCardATela(value.val(), value.key);
    //     });

    //     ref.off('value');
    // }, err => {
    //     console.log('erro no on', err);
    // });

    /**
     * USANDO FETCH NO LUGAR DA BIBLIOTECA DO FIREBASE
     */
    fetch('https://curso-firebase-webapps.firebaseio.com/card.json')
        .then(res => res.json())
        .then(res => {
            for (var key in res) {
                adicionaCardATela(res[key], key);
            };
        })

});

/**
 * Adiciona card na tela
 * @param {Object} informacao Objeto contendo dados do card
 * @param {String} id UID do objeto inserido/consultado
 */
function adicionaCardATela(informacao, id) {
    /**
     * HEADER DO CARD
     */
    let header = document.createElement("h2");
    header.innerText = informacao.nome;
    header.classList.add('card-title');
    // ===================================

    /**
     * CONTENT DO CARD
     */
    let content = document.createElement("p");
    content.classList.add('card-text');
    content.innerText = informacao.idade + ' anos.';
    // ===================================

    /**
     * BOTÕES DO CARD
     */
    let inner = document.createElement("div");
    inner.classList.add('row')
    // Botão adicionar
    let button_add = document.createElement("button");
    button_add.classList.add('btn', 'btn-link', 'col-3');
    button_add.setAttribute('onclick', "curtir('" + id + "')");
    button_add.innerText = '+';
    inner.appendChild(button_add);

    // Contador de curtidas
    let counter = document.createElement("span");
    counter.innerHTML = informacao.curtidas;
    counter.classList.add('col-3', 'text-center', 'count-number');
    inner.appendChild(counter);

    // Botão de subtrair
    let button_sub = document.createElement("button");
    button_sub.classList.add('btn', 'btn-link', 'col-3');
    button_sub.setAttribute('onclick', "descurtir('" + id + "')");
    button_sub.innerText = '-';
    inner.appendChild(button_sub);
    // ===================================

    // Botão de excluir
    let button_del = document.createElement("button");
    button_del.classList.add('btn', 'btn-danger', 'col-3');
    button_del.setAttribute('onclick', "deletar('" + id + "')");
    button_del.innerText = 'x';
    inner.appendChild(button_del);
    // ===================================

    /**
     * CARD
     */
    let card = document.createElement("div");
    card.classList.add('card');
    card.id = id;
    let card_body = document.createElement("div");
    card_body.classList.add('card-body');
    // ===================================

    // popula card
    card_body.appendChild(header);
    card_body.appendChild(content);
    card_body.appendChild(inner);
    card.appendChild(card_body);

    // insere no container
    CARD_CONTAINER.appendChild(card);
}