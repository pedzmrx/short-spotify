
const loginBtn = document.getElementById('login-btn');


const resultsContainer = document.getElementById('results-container');


const API_BASE_URL = 'http://localhost:3000';


loginBtn.addEventListener('click', () => {

    window.location.href = `${API_BASE_URL}/login`;

    const loginUrl = 'http://localhost:3000/login'
    console.log('Redirecionando para o login do Spotify para:', loginUrl);
});