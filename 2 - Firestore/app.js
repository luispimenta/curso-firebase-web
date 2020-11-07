/**
 * Váriaveis usadas durante o desenvolvimento
 */
var CARD_CONTAINER = document.getElementsByClassName('card-container')[0];
var NOMES = ["Anderson", "Beatriz", "Caio", "Daniela", "Everton", "Fabiana", "Gabriel", "Hortencia", "Igor", "Joana"];

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
     * .collection('coleção'): Referenciar a coleção
     * .doc('documento'): Referencia o documento
     * .set({dados}): Insere o objeto passado por parametro na referencia
     */
    // firebase.firestore().collection('cards').doc('1').set(card).then(() =>{
    //     console.log('dados salvos');
    //     adicionaCardATela(card, 1);
    // });

    /**
     * .add({dados}): Adiciona os dados dentro de um UID gerado automaticamente.
     */
    firebase.firestore().collection('cards').add(card).then(() => {
        console.log('dados salvos');
        adicionaCardATela(card, 1);
    });

    /**
     * Gravações em lote
     * - Para uma gravação em lote é necessário criar um batch.
     * - Esse batch serve para armazenar as operações que serão executadas.
     * - Eu posso executar com batch as operações de set, update e delete.
     * - Para criar uma operação de set, preciso da referencia do documento e os dados que desejo inserir.
     * - Ao criar todos os metodos é necessário executar o metodo .commit() para executar todas as operações.
     * - Com batch, ou são gravados todas as operações, ou nenhuma é gravada.
     */
    // var batch = firebase.firestore().batch();
    // var cards = [];

    // for(var i = 0; i < 3; i++) {
    //     let doc = {
    //         nome: NOMES[Math.floor(Math.random() * NOMES.length - 1)],
    //         idade: Math.floor(Math.random() * 22 + 18),
    //         curtidas: 0
    //     };

    //     cards.push(doc);
    //     let ref = firebase.firestore().collection('cards').doc(String(i));
    //     batch.set(ref, doc);
    // };

    // batch.commit(() => {
    //     for(var i = 0; i < cards.length; i++) {
    //         adicionaCardATela(cards[i], i);
    //     }
    // });
};

/**
 * Recebe a referencia do card e exclui do banco de dados
 * @param {String} id Id do card
 */
function deletar(id) {
    var card = document.getElementById(id);

    // .delete(): Deleta o documento da coleção. OBS: Pode ser usado APENAS em documentos.
    firebase.firestore().collection('cards').doc(id).delete().then(() => {
        card.remove();
    });

    // Para remover uma propriedade do documento, podemos dar um update() e passamos no objeto
    // a propriedade que será excluida e chamamos o metodo de .delete() vindo de firebase.firestore.FieldValue

    // firebase.firestore().collection('cards').doc(id).update({curtidas: firebase.firestore.FieldValue.delete()}).then(() => {
    //     console.log('removido curtidas');
    // })
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

    /**
     * .update({dados}): Atualiza todos os dados passados no parametro. OBS: Pode ser usado apenas em docs.
     */
    firebase.firestore().collection('cards').doc(id).update({
        curtidas: countNumber
    }).then(() => {
        count.innerText = countNumber;
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
        firebase.firestore().collection('cards').doc(id).update({
            curtidas: countNumber
        }).then(() => {
            count.innerText = countNumber;
        });
    };
};

/**
 * Espera o evento de que a DOM está pronta para executar algo
 */
document.addEventListener("DOMContentLoaded", function () {
    /**
     * .get(): busca um resultado apenas uma vez
     */
    firebase.firestore().collection('cards').get().then(snapshot => {

        // Os documentos dentro da minha coleção, retorna um objeto e deve-se utilizar um forEach
        // snapshot.docs()

        // Uma propriedade que retorna um booleano se o snapshot estiver vazio
        // snapshot.empty

        // São os metadados da coleção
        // snapshot.metadata

        // Retorna a query utilizada no filtro para esse get
        // snapshot.query

        // O numero de documentos dentro dessa coleção
        // snapshot.size

        // retorna um array com as mudanças que essa coleção sofreu desde a ultima leitura
        // snapshot.docChanges

        snapshot.docs.forEach(card => {

            // Retorna os dados do meu documento
            // card.data()

            // Retorna o UID do meu documento
            // card.id

            // Retorna um booleano caso o documento passado seja igual ao documento utilizado (serve para docs e collections)
            // card.isEqual(doc)

            adicionaCardATela(card.data(), card.id);
        });
    });

    /**
     * .onSnapshot(): Observando em tempo real
     */
    // firebase.firestore().collection('cards').onSnapshot(snapshot => {
    // Usar dessa forma é equivalente ao .on('value') do Realtime Database
    // snapshot.docs.forEach();

    // Traz todos os dados com o evento de 'added' na primeira chamada e depois
    // traz apenas os novos documentos ou documentos que sofreram alterações
    //     snapshot.docChanges().forEach(card => {
    //         if(card.type == 'added') {
    //             adicionaCardATela(card.doc.data(), card.doc.id);
    //         };

    //         if(card.type == 'modified') {
    //             console.log('modified');
    //         };

    //         if(card.type == 'removed') {
    //             console.log('removed');
    //         };
    //     });
    // });

    /**
     * Consultas
     */

    /**
     * .where(campo, operador, valor): Retorna dados que obedecerem a condição passada
     * .where não aceita || ou && e nem != 
     * colecao where
     * - doc 
     * - - colecao where
     */
    //  firebase.firestore().collection('cards').where('idade', ">", 25).where('idade', "<", 35).get().then(snapshot => {
    //     snapshot.docs.forEach(card => {
    //         adicionaCardATela(card.data(), card.id);
    //     });
    //  });

    /**
     * Ordenação
     * .orderBy(campo, ordenação): Ordena pelo campo e pelo tipo de ordenação passados, tipo não obrigatório
     * OBS: ao usar juntamente do .where() deve-se ordenar pelo mesmo campo
     */
    // firebase.firestore().collection('cards').where('curtidas', ">", 0).orderBy('curtidas', 'desc').get().then(snapshot => {
    //     snapshot.docs.forEach(card => {
    //         adicionaCardATela(card.data(), card.id);
    //     });
    // });

    /**
     * Limite
     * .limit(numero): Retorna apenas o numero de resultados que foi passado no metodo.
     */
    // firebase.firestore().collection('cards').limit(3).get().then(snapshot => {
    //     snapshot.docs.forEach(card => {
    //         adicionaCardATela(card.data(), card.id);
    //     });
    // });

    /**
     * Cursores / filtrar
     * .startAt(valor): Começa a filtrar no valor passado. Funciona como o operador >=
     * .startAfter(valor): ||. funciona como o operador >
     * .endBefore(valor): ||. Funciona como o operador de <
     * .endAt(valor): ||. Funciona como o operador de <=
     * Os cursores aceitam além de um valor, um documento para começar o filtro.
     */
    // var startAt;
    // firebase.firestore().collection('cards').limit(3).get().then(snap => {
    //     startAt = snap.docs[snap.docs.length - 1];
    //     firebase.firestore().collection('cards').startAt(startAt).get().then(snapshot => {
    //         snapshot.docs.forEach(card => {
    //             adicionaCardATela(card.data(), card.id);
    //         });
    //     });
    // })
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