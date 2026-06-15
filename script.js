
/* ----------------- SCRIPT Geral para o site do Centro-Oeste -----------------*/

document.addEventListener("DOMContentLoaded", () => {
    const dropdowns = document.querySelectorAll(".dropdown");

    dropdowns.forEach((dropdown) => {
        const toggle = dropdown.querySelector(".dropdown-toggle");

        toggle.addEventListener("click", (e) => {
            e.stopPropagation();

            // Fecha os outros dropdowns abertos
            dropdowns.forEach((other) => {
                if (other !== dropdown) other.classList.remove("active");
            });

            dropdown.classList.toggle("active");
        });
    });

    // Fecha o dropdown se clicar fora dele
    document.addEventListener("click", () => {
        dropdowns.forEach((dropdown) => dropdown.classList.remove("active"));
    });
});



/* ---------------------------- SCRIPT DO TURISMO -----------------------------*/


// ===== MAPA INTERATIVO (Leaflet) =====
document.addEventListener("DOMContentLoaded", () => {
    const mapElement = document.getElementById("map");
    if (!mapElement) return; // só executa nas páginas que têm o mapa

    // Posição inicial: centro da região Centro-Oeste
    const map = L.map("map").setView([-15.7801, -47.9292], 5);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    let currentMarker = null;

    function irParaLocal(lat, lng, zoom, popupText) {
        map.setView([lat, lng], zoom);

        if (currentMarker) {
            map.removeLayer(currentMarker);
        }

        currentMarker = L.marker([lat, lng]).addTo(map);
        if (popupText) {
            currentMarker.bindPopup(popupText).openPopup();
        }
    }

    // ===== Cards de destinos pré-prontos =====
    const cards = document.querySelectorAll(".destino-card");

    cards.forEach((card) => {
        card.addEventListener("click", () => {
            const lat = parseFloat(card.dataset.lat);
            const lng = parseFloat(card.dataset.lng);
            const zoom = parseInt(card.dataset.zoom) || 13;
            const titulo = card.querySelector("h4").textContent;

            irParaLocal(lat, lng, zoom, titulo);

            // Marca visualmente o card selecionado
            cards.forEach((c) => c.classList.remove("active"));
            card.classList.add("active");
        });
    });

    // ===== Barra de busca (usando Nominatim - geocoding gratuito do OSM) =====
    const searchInput = document.getElementById("map-search-input");
    const searchBtn = document.getElementById("map-search-btn");

    async function buscarLocal() {
        const query = searchInput.value.trim();
        if (!query) return;

        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`
            );
            const data = await response.json();

            if (data.length === 0) {
                alert("Local não encontrado. Tente buscar de outra forma.");
                return;
            }

            const lat = parseFloat(data[0].lat);
            const lng = parseFloat(data[0].lon);

            irParaLocal(lat, lng, 13, data[0].display_name);

            // Remove destaque de cards ao buscar manualmente
            cards.forEach((c) => c.classList.remove("active"));

        } catch (error) {
            console.error("Erro ao buscar local:", error);
            alert("Erro ao buscar local. Tente novamente.");
        }
    }

    searchBtn.addEventListener("click", buscarLocal);
    searchInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") buscarLocal();
    });
});


/* ----------------------------- SCRIPT DO RÁDIO ------------------------------*/


// ===== RÁDIO CENTRO-OESTE =====
document.addEventListener("DOMContentLoaded", () => {
    const audioPlayer = document.getElementById("audio-player");
    if (!audioPlayer) return; // só executa na página do rádio

    // ----- BANCO DE MÚSICAS (nomes fictícios - troque pelos arquivos reais) -----
    const musicas = [
        {
            titulo: "É o AMor",
            artista: "Zezé Di Camargo & Luciano",
            ano: 1991,
            arquivo: "../music/ZL---É-o-Amor.mp3"
        },
        {
            titulo: "Entre Ele e Eu",
            artista: "Zezé Di Camargo & Luciano",
            ano: 1991,
            arquivo: "../music/ZL---Entre-Ele-e-Eu.mp3"
        },
        {
            titulo: "Rédeas do Possante",
            artista: "Zezé Di Camargo & Luciano",
            ano: 1991,
            arquivo: "../music/ZL---Rédeas-do-Possante.mp3"
        },
        {
            titulo: "Deus",
            artista: "Zezé Di Camargo & Luciano",
            ano: 1991,
            arquivo: "../music/ZL---Deus.mp3"
        },
        {
            titulo: "A Estrela Só",
            artista: "Zezé Di Camargo & Luciano",
            ano: 1991,
            arquivo: "../music/ZL---A-Estrela-Só.mp3"
        },
                {
            titulo: "Pouco a Pouco",
            artista: "Zezé Di Camargo & Luciano",
            ano: 1991,
            arquivo: "../music/ZL---Pouco-a-Pouco.mp3"
        },
        {
            titulo: "Águas Passadas",
            artista: "Zezé Di Camargo & Luciano",
            ano: 1991,
            arquivo: "../music/ZL---Águas-Passadas.mp3"
        },
        {
            titulo: "Eu Te Amo",
            artista: "Zezé Di Camargo & Luciano",
            ano: 1991,
            arquivo: "../music/ZL---Eu-Te-Amo.mp3"
        },
        {
            titulo: "Quem Sou Eu Sem Ela",
            artista: "Zezé Di Camargo & Luciano",
            ano: 1991,
            arquivo: "../music/ZL---Quem-Sou-Eu-Sem-Ela.mp3"
        },
        {
            titulo: "Para Desbotar a Saudade",
            artista: "Zezé Di Camargo & Luciano",
            ano: 1991,
            arquivo: "../music/ZL---Para-Desbotar-a-Saudade.mp3"
        },
    ];

    // ----- ELEMENTOS -----
    const disco = document.getElementById("disco");
    const infoTitulo = document.getElementById("info-titulo");
    const infoArtista = document.getElementById("info-artista");
    const infoAno = document.getElementById("info-ano");

    const btnPlay = document.getElementById("btn-play");
    const btnAnterior = document.getElementById("btn-anterior");
    const btnProximo = document.getElementById("btn-proximo");

    const progressBar = document.getElementById("progress-bar");
    const tempoAtual = document.getElementById("tempo-atual");
    const tempoTotal = document.getElementById("tempo-total");

    const volumeSlider = document.getElementById("volume");

    const filtroArtista = document.getElementById("filtro-artista");
    const filtroAno = document.getElementById("filtro-ano");
    const btnFiltrar = document.getElementById("btn-filtrar");
    const listaMusicas = document.getElementById("lista-musicas");

    let listaAtual = [...musicas]; // lista que está em reprodução (pode ser filtrada)
    let indiceAtual = 0;

    // ----- PREENCHE OS FILTROS DINAMICAMENTE -----
    function preencherFiltros(){
        const artistas = [...new Set(musicas.map(m => m.artista))].sort();
        const anos = [...new Set(musicas.map(m => m.ano))].sort((a, b) => a - b);

        artistas.forEach(artista => {
            const option = document.createElement("option");
            option.value = artista;
            option.textContent = artista;
            filtroArtista.appendChild(option);
        });

        anos.forEach(ano => {
            const option = document.createElement("option");
            option.value = ano;
            option.textContent = ano;
            filtroAno.appendChild(option);
        });
    }

    // ----- RENDERIZA A LISTA DE MÚSICAS -----
    function renderizarLista(lista){
        listaMusicas.innerHTML = "";

        lista.forEach((musica, index) => {
            const li = document.createElement("li");
            li.innerHTML = `
                <span>${musica.titulo} - ${musica.artista}</span>
                <span>${musica.ano}</span>
            `;
            li.addEventListener("click", () => {
                listaAtual = lista;
                indiceAtual = index;
                tocarMusica();
            });
            listaMusicas.appendChild(li);
        });
    }

    // ----- TOCAR MÚSICA -----
    function tocarMusica(){
        const musica = listaAtual[indiceAtual];
        if (!musica) return;

        audioPlayer.src = musica.arquivo;
        audioPlayer.play();

        infoTitulo.textContent = musica.titulo;
        infoArtista.textContent = `Artista: ${musica.artista}`;
        infoAno.textContent = `Lançamento: ${musica.ano}`;

        disco.classList.add("tocando");
        btnPlay.textContent = "⏸";

        // Destaca a música atual na lista
        const itens = listaMusicas.querySelectorAll("li");
        itens.forEach(li => li.classList.remove("tocando-agora"));
        const itemAtual = [...itens].find(li =>
            li.textContent.includes(musica.titulo)
        );
        if (itemAtual) itemAtual.classList.add("tocando-agora");
    }

    // ----- PLAY / PAUSE -----
    btnPlay.addEventListener("click", () => {
        if (audioPlayer.paused){
            if (!audioPlayer.src){
                // Se nada foi tocado ainda, começa do início da lista completa
                listaAtual = [...musicas];
                indiceAtual = 0;
                tocarMusica();
            } else {
                audioPlayer.play();
                disco.classList.add("tocando");
                btnPlay.textContent = "⏸";
            }
        } else {
            audioPlayer.pause();
            disco.classList.remove("tocando");
            btnPlay.textContent = "▶";
        }
    });

    // ----- PRÓXIMA / ANTERIOR -----
    function proximaMusica(){
        indiceAtual = (indiceAtual + 1) % listaAtual.length;
        tocarMusica();
    }

    function musicaAnterior(){
        indiceAtual = (indiceAtual - 1 + listaAtual.length) % listaAtual.length;
        tocarMusica();
    }

    btnProximo.addEventListener("click", proximaMusica);
    btnAnterior.addEventListener("click", musicaAnterior);

    // ----- LOOP AUTOMÁTICO (quando a música acaba, toca a próxima) -----
    audioPlayer.addEventListener("ended", () => {
        proximaMusica();
    });

    // ----- BARRA DE PROGRESSO -----
    audioPlayer.addEventListener("loadedmetadata", () => {
        progressBar.max = audioPlayer.duration;
        tempoTotal.textContent = formatarTempo(audioPlayer.duration);
    });

    audioPlayer.addEventListener("timeupdate", () => {
        progressBar.value = audioPlayer.currentTime;
        tempoAtual.textContent = formatarTempo(audioPlayer.currentTime);
    });

    progressBar.addEventListener("input", () => {
        audioPlayer.currentTime = progressBar.value;
    });

    function formatarTempo(segundos){
        if (isNaN(segundos)) return "0:00";
        const min = Math.floor(segundos / 60);
        const sec = Math.floor(segundos % 60).toString().padStart(2, "0");
        return `${min}:${sec}`;
    }

    // ----- VOLUME -----
    volumeSlider.addEventListener("input", () => {
        audioPlayer.volume = volumeSlider.value;
    });
    audioPlayer.volume = volumeSlider.value;

    // ----- FILTRO POR ARTISTA E ANO -----
    btnFiltrar.addEventListener("click", () => {
        const artistaSelecionado = filtroArtista.value;
        const anoSelecionado = filtroAno.value;

        let filtradas = musicas.filter(musica => {
            const passaArtista = !artistaSelecionado || musica.artista === artistaSelecionado;
            const passaAno = !anoSelecionado || musica.ano == anoSelecionado;
            return passaArtista && passaAno;
        });

        if (filtradas.length === 0){
            alert("Nenhuma música encontrada com esses filtros.");
            return;
        }

        renderizarLista(filtradas);

        // Toca a primeira música encontrada automaticamente
        listaAtual = filtradas;
        indiceAtual = 0;
        tocarMusica();
    });

    // ----- INICIALIZAÇÃO -----
    preencherFiltros();
    renderizarLista(musicas);
});