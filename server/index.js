
require('dotenv').config();


const express = require('express');
const app = express(); 


const cors = require('cors');


const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;





app.use(express.json());

app.use(cors());
app.use(express.static('public'));

const PORT = process.env.PORT || 3000;


app.listen(PORT, () => {
    console.log(`Servidor backend rodando em http://localhost:${PORT}`);
    console.log(`Acesse seu frontend em: http://localhost:${PORT}/index.html`);
});

app.get('/login', (req, res) => {
    const scopes = 'user-read-private user-read-email user-top-read';
    const redirectUri = 'https://41a250841863.ngrok-free.app'; 

    const spotifyAuthUrl = 'https://accounts.spotify.com/authorize' +
        '?response_type=code' +
        '&client_id=' + CLIENT_ID +
        (scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
        '&redirect_uri=' + encodeURIComponent(redirectUri);

    res.redirect(spotifyAuthUrl);
});


app.get('/callback', async (req, res) => { 
    const code = req.query.code || null;

    if (code === null) {
        return res.redirect('/error.html');
    }

    const authOptions = {
        method: 'POST',
        url: 'https://accounts.spotify.com/api/token',
        headers: {
            'Authorization': 'Basic ' + (Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64')),
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
            code: code,
            redirect_uri: 'https://41a250841863.ngrok-free.app',
            grant_type: 'authorization_code'
        })
    };

    try {
        const tokenResponse = await fetch('https://accounts.spotify.com/api/token', authOptions);
        const tokenData = await tokenResponse.json();

        if (!tokenResponse.ok) {
            console.error('Erro ao obter token do Spotify:', tokenData.error_description || 'Erro desconhecido.');
            return res.redirect('/error.html');
        }


        const { access_token, refresh_token } = tokenData;

        
        res.redirect('/index.html');

    } catch (error) { 
        console.error('Erro na rota de callback:', error);
        res.redirect('/error.html');
    }
}); 