document.addEventListener('DOMContentLoaded', () => {
    // 1. Elementos da interface
    const loginBtn = document.getElementById('login-btn');
    const resultsContainer = document.getElementById('results-container');

    // 2. Lógica de Autenticação
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get('access_token');
    const refreshToken = urlParams.get('refresh_token');

    //Função para exibir as músicas na interface
    const displayTopTracks = (tracks) => {
        resultsContainer.innerHTML = '';
        if (tracks.length === 0) {
            resultsContainer.innerHTML = '<p>Nenhuma música encontrada. Ouça mais para ver seus resultados!</p>';
            return; 
        }
        const tracksHtml = tracks.map(track => {
            const artistNames = track.artists.map(artist => artist.name).join(', ');
            return `
                <div class="track-card">
                    <img src="${track.album.images[1].url}" alt="Capa do álbum de ${track.name}">
                    <div class="track-info">
                        <h3>${track.name}</h3>
                        <p>por ${artistNames}</p> 
                    </div>
                </div>
            `;
        }).join('');
        resultsContainer.innerHTML = tracksHtml; 
    };


    //Função para buscar as músicas mais ouvidas do usuário
    const fetchTopTracks = async (token) => {
        const topTracksUrl = 'https://developer.spotify.com/documentation/web-api/concepts/redirect_uri6';
        try {
            const response = await fetch(topTracksUrl, {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            }); 
            if (!response.ok) {
                throw new Error('Erro ao buscar as músicas mais ouvidas.');
            }
            const data = await response.json();
            console.log('Músicas mais ouvidas:', data);
            displayTopTracks(data.items);
        } catch (error) {
            console.error('Erro ao buscar as músicas:', error);
            resultsContainer.innerHTML = '<p class="error-message">Erro ao carregar as músicas. Tente novamente.</p>';
        }
    };

     if (accessToken) {
        console.log('Token de Acesso obtido:', accessToken);
        
        if (loginBtn) {
            loginBtn.style.display = 'none';
        }
        
        window.history.pushState({}, document.title, window.location.pathname);

        fetchTopTracks(accessToken);
    } else {
        console.log('Nenhum token encontrado. Exibindo botão de login.');
        if (loginBtn) {
            loginBtn.style.display = 'block';
            loginBtn.addEventListener('click', (event) => {
                event.preventDefault();
                window.location.href = `${window.location.origin}/login`;
            });
        }
    }

    
    // 5. Animação de Fundo com Partículas
    const canvas = document.getElementById('background-canvas');
    const ctx = canvas.getContext('2d');
    
    let particles = [];
    const numParticles = 80;
    const particleSize = 1;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * particleSize + 0.5;
            this.speedX = Math.random() * 0.5 - 0.25;
            this.speedY = Math.random() * 0.5 - 0.25;
            this.color = `rgba(29, 185, 84, ${Math.random() * 0.4 + 0.1})`;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
        }

        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    
    function initParticles() {
        particles = [];
        for (let i = 0; i < numParticles; i++) {
            particles.push(new Particle());
        }
    }

    function animateParticles() {
        ctx.fillStyle = 'rgba(18, 18, 18, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
            for (let j = i; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < 80) {
                    ctx.strokeStyle = `rgba(29, 185, 84, ${1 - (distance / 80)})`;
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animateParticles);
    }

    window.addEventListener('resize', () => {
        resizeCanvas();
        initParticles();
    });

    resizeCanvas();
    initParticles();
    animateParticles();
});