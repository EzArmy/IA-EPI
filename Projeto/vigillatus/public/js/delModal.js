function showModal(){
    var delModal = document.getElementById("delModal");
    delModal.classList.toggle("show");
}

function closeModal(){
    var delModal = document.getElementById("delModal");

    document.getElementById('confirmInput').value = '';
    delModal.classList.toggle("show");
    
}