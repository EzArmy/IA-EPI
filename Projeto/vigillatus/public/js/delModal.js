function randomGen(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomNums() {
    var randomNum = document.getElementById('randomNum');
    var num = [];

    for (var i = 0; i < 6; i++) {
        num.push(randomGen(1, 9));
    }

    randomNum.innerHTML = num.join('');
}

function showModal() {
    var delModal = document.getElementById("delModal");
    delModal.classList.toggle("show");

    randomNums()
}

function closeModal() {
    var delModal = document.getElementById("delModal");
    document.getElementById('confirmInput').value = '';
    delModal.classList.toggle("show");

}

function numCheck() {
    /* capturando os números apresentados para o gestor */
    const randomNum = document.getElementById('randomNum').innerHTML;

    /* capturando os números digitados pelo gestor no input */
    var checkInput = document.getElementById('checkInput').value;

    /* Botão de delete */
    var delBtn = document.getElementById('delBtn');

    if(checkInput == randomNum){
        delBtn.setAttribute('disabled', 'false');
        delBtn.style.backgroundColor = 'green';
        console.log('São enguais *-*)');
    }else{
        delBtn.setAttribute('disabled', 'true');
        delBtn.style.backgroundColor = 'red'
        console.log('Não são enguais ._.)');
    }
}
