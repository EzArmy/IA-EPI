// Adiciona um ouvinte de evento de carregamento à janela do navegador
window.addEventListener('load', function() {
    // Seleciona o elemento de carregamento
    const loader = document.getElementById('loader');
    
    // Mostra o elemento de carregamento
    loader.style.display = 'block';
    
    // Quando o carregamento estiver concluído, remove o elemento de carregamento
    setTimeout(function() {
        loader.style.display = 'none';
    }, 1000); // Tempo de exibição do efeito de carregamento (em milissegundos)
});