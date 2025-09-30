require('dotenv').config();

const express = require('express');
const app = express();
const cors = require('cors');

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const PORT = process.env.PORT || 3000;

// Middleware para servir os arquivos estáticos e habilitar CORS
app.use(cors());
app.use(express.static('public'));
app.use(express.json());

app.get('/login', (req, res) => {
    const spotifyAuthUrl = 'https://accounts.spotify.com/authorize' +
        '?response_type=code' +
        '&client_id=' + process.env.SPOTIFY_CLIENT_ID +
        '&scope=' + encodeURIComponent('user-read-private user-read-email') +
        '&redirect_uri=' + encodeURIComponent('https://f7fabae7245b.ngrok-free.app/callback');

    console.log('URL de Autorização Gerada:', spotifyAuthUrl);
    res.redirect(spotifyAuthUrl);
});

// Rota de callback para receber o código de autorização
app.get('/callback', async (req, res) => {
    console.log('Rota /callback acessada.');
    
    const code = req.query.code || null;
    const redirectUri = 'https://f7fabae7245b.ngrok-free.app/callback';

    // Log do código recebido
    console.log('Código de autorização recebido:', code);

    if (code === null) {
        return res.redirect('/error.html');
    }

// Troca o código de autorização por um token de acesso
    const authOptions = { 
        method: 'POST', 
        headers: {
            'Authorization': 'Basic ' + (Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64')),
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
            code: code,
            redirect_uri: redirectUri,
            grant_type: 'authorization_code'
        })
    };

    try {
        const tokenResponse = await fetch('https://accounts.spotify.com/api/token', authOptions);
        
        console.log('Status da resposta do token:', tokenResponse.status, tokenResponse.statusText);

        const tokenData = await tokenResponse.json();

        if (!tokenResponse.ok) {
                console.error('Erro ao obter token do Spotify:', tokenData);
            return res.redirect('/error.html');
        }
    

        const { access_token } = tokenData;
        return res.redirect(`/index.html?access_token=${access_token}`);

    } catch (error) {
        console.error('Erro na rota de callback:', error); 
        res.redirect('/error.html');
    } 
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor backend rodando em http://localhost:${PORT}`);
    console.log(`Acesse seu frontend em: http://localhost:${PORT}`);
});

//