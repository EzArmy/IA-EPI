function randomGen(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomNums() {
    var randomNum = document.getElementById('randomNum');
    var num = [];

    for (var i = 0; i < 6; i++) {
        num.push(randomGen(0, 9));
    }

    randomNum.innerHTML = num.join('');
}

function showModal() {
    var delModal = document.getElementById("delModal");
    delModal.classList.toggle("show");
    document.getElementById('delBtn').disabled = true;
    randomNums()
}

function closeModal() {
    var delModal = document.getElementById("delModal");
    document.getElementById('checkInput').value = '';
    delModal.classList.toggle("show");

}

function numCheck() {
    /* capturando os números apresentados para o gestor */
    const randomNum = document.getElementById('randomNum').innerHTML;

    /* capturando os números digitados pelo gestor no input */
    var checkInput = document.getElementById('checkInput').value;

    if (checkInput == '' || checkInput != randomNum) {
        document.getElementById('delBtn').disabled = true;
    } else if (checkInput == randomNum) {
        document.getElementById('delBtn').disabled = false;
    }
}
