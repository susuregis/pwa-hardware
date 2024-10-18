const speakButton = document.getElementById('speak-btn');
const result = document.getElementById('cep-result');

// Adiciona um campo para a imagem
const imageContainer = document.createElement('div');
imageContainer.id = 'map-image';
document.querySelector('.container').appendChild(imageContainer);

// Verificar se o navegador suporta a API de reconhecimento de voz
window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (window.SpeechRecognition) {
    const recognition = new window.SpeechRecognition();
    recognition.lang = 'pt-BR';

    // Evento quando o reconhecimento de voz retorna um resultado
    recognition.onresult = function(event) {
        const cep = event.results[0][0].transcript.replace(/\D/g, ''); // Remove tudo que não for número
        result.innerText = `CEP falado: ${cep}`;
        if (cep.length === 8) {
            buscarEndereco(cep);
        } else {
            result.innerText = 'CEP inválido. Tente novamente.';
        }
    };

    // Iniciar o reconhecimento de voz ao clicar no botão
    speakButton.addEventListener('click', () => {
        recognition.start();
    });

    // Tratamento de erros
    recognition.onerror = function(event) {
        result.innerText = `Erro ao capturar voz: ${event.error}`;
    };

} else {
    result.innerText = 'Reconhecimento de voz não suportado no seu navegador. Por favor, use o Google Chrome.';
}

// Função para buscar o endereço pelo CEP usando a API ViaCEP
function buscarEndereco(cep) {
    const url = `https://viacep.com.br/ws/${cep}/json/`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.erro) {
                result.innerText = 'CEP não encontrado. Tente novamente.';
            } else {
                result.innerText = `
                    Endereço encontrado:
                    Rua: ${data.logradouro}, 
                    Bairro: ${data.bairro}, 
                    Cidade: ${data.localidade}, 
                    Estado: ${data.uf}
                `;
                buscarImagemDoLugar(data.localidade, data.uf);
            }
        })
        .catch(error => {
            result.innerText = 'Erro ao buscar endereço. Tente novamente.';
            console.error('Erro ao buscar o endereço:', error);
        });
}

// Função para buscar a imagem do local pelo Google Maps Static API
function buscarImagemDoLugar(cidade, estado) {
    const apiKey = 'AIzaSyCA8BYe8dSNBBzES2shQTrhmRvKhHhO-uc'; // Coloque sua chave da API do Google Maps aqui
    const location = `${cidade},${estado}`;
    const imageUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${location}&zoom=12&size=400x300&maptype=roadmap&markers=color:red%7Clabel:S%7C${location}&key=${apiKey}`;
    

    const mapImage = document.createElement('img');
    mapImage.src = imageUrl;
    mapImage.alt = `Mapa de ${cidade}, ${estado}`;
    mapImage.style.width = '100%';
    mapImage.style.borderRadius = '8px';

    // Adiciona a imagem ao container
    const imageContainer = document.getElementById('map-image');
    imageContainer.innerHTML = ''; // Limpa a imagem anterior, se houver
    imageContainer.appendChild(mapImage);
}
