
/* ----------------- SCRIPT Geral para o site do Centro-Oeste -----------------*/

document.addEventListener("DOMContentLoaded", () => {
    const dropdowns = document.querySelectorAll(".dropdown");

    dropdowns.forEach((dropdown) => {
        const toggle = dropdown.querySelector(".dropdown-toggle");

        toggle.addEventListener("click", (e) => {
            e.stopPropagation();
            dropdowns.forEach((other) => {
                if (other !== dropdown) other.classList.remove("active");
            });
            dropdown.classList.toggle("active");
        });
    });

    document.addEventListener("click", () => {
        dropdowns.forEach((dropdown) => dropdown.classList.remove("active"));
    });

    // ===== NOVO: marca o dropdown da página atual como ativo =====
// ===== marca o dropdown da página atual como ativo =====
    const paginaAtual = window.location.pathname;

    dropdowns.forEach((dropdown) => {
        const links = dropdown.querySelectorAll(".dropdown-menu a");
        links.forEach((link) => {
            const hrefPath = link.getAttribute("href").split("#")[0];

            if (hrefPath && paginaAtual.endsWith(hrefPath.replace("./", "").replace("../", ""))){
                dropdown.classList.add("pagina-atual"); // só gira a seta, não abre o menu
            }
        });
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

// ===== BANCO DE MÚSICAS (compartilhado entre todas as páginas) =====
const musicas = [
    { titulo: "É o Amor", artista: "Zezé Di Camargo & Luciano", ano: 1991, arquivo: "../music/ZL---É-o-Amor.mp3" },
    { titulo: "Entre Ele e Eu", artista: "Zezé Di Camargo & Luciano", ano: 1991, arquivo: "../music/ZL---Entre-Ele-e-Eu.mp3" },
    { titulo: "Rédeas do Possante", artista: "Zezé Di Camargo & Luciano", ano: 1991, arquivo: "../music/ZL---Rédeas-do-Possante.mp3" },
    { titulo: "Deus", artista: "Zezé Di Camargo & Luciano", ano: 1991, arquivo: "../music/ZL---Deus.mp3" },
    { titulo: "A Estrela Só", artista: "Zezé Di Camargo & Luciano", ano: 1991, arquivo: "../music/ZL---A-Estrela-Só.mp3" },
    { titulo: "Pouco a Pouco", artista: "Zezé Di Camargo & Luciano", ano: 1991, arquivo: "../music/ZL---Pouco-a-Pouco.mp3" },
    { titulo: "Águas Passadas", artista: "Zezé Di Camargo & Luciano", ano: 1991, arquivo: "../music/ZL---Águas-Passadas.mp3" },
    { titulo: "Eu Te Amo", artista: "Zezé Di Camargo & Luciano", ano: 1991, arquivo: "../music/ZL---Eu-Te-Amo.mp3" },
    { titulo: "Quem Sou Eu Sem Ela", artista: "Zezé Di Camargo & Luciano", ano: 1991, arquivo: "../music/ZL---Quem-Sou-Eu-Sem-Ela.mp3" },
    { titulo: "Para Desbotar a Saudade", artista: "Zezé Di Camargo & Luciano", ano: 1991, arquivo: "../music/ZL---Para-Desbotar-a-Saudade.mp3" },

    { titulo: "Cade Você", artista: "Leandro e Leonardo", ano: 1990, arquivo: "../music/LL---Cade-Você.mp3" },
    { titulo: "Talvez Você Se Lembre", artista: "Leandro e Leonardo", ano: 1990, arquivo: "../music/LL---Talvez-Você-Se-Lembre.mp3" },
    { titulo: "O Cheiro da Maça", artista: "Leandro e Leonardo", ano: 1990, arquivo: "../music/LL---O-Cheiro-da-Maça.mp3" },
    { titulo: "Coração Quer Te Encontrar", artista: "Leandro e Leonardo", ano: 1990, arquivo: "../music/LL---Coração-Quer-Te-Encontrar.mp3" },
    { titulo: "Mais uma Vez Sozinho (Marcas do Amor)", artista: "Leandro e Leonardo", ano: 1990, arquivo: "../music/LL---Mais-uma-Vez-Sozinho-(Marcas-do-Amor).mp3" },
    { titulo: "Pra Nunca Dizer Adeus", artista: "Leandro e Leonardo", ano: 1990, arquivo: "../music/LL---Pra-Nunca-Dizer-Adeus.mp3" },
    { titulo: "Pense em Mim", artista: "Leandro e Leonardo", ano: 1990, arquivo: "../music/LL---Pense-em-Mim.mp3" },
    { titulo: "Só Fazendo Amor", artista: "Leandro e Leonardo", ano: 1990, arquivo: "../music/LL---Só-Fazendo-Amor.mp3" },
    { titulo: "Você Ainda Vai Voltar", artista: "Leandro e Leonardo", ano: 1990, arquivo: "../music/LL---Você-Ainda-Vai-Voltar.mp3" },
    { titulo: "Desculpe Mas Eu Vou Chorar", artista: "Leandro e Leonardo", ano: 1990, arquivo: "../music/LL---Desculpe-Mas-Eu-Vou-Chorar.mp3" },

    { titulo: "Logo Eu", artista: "Jorge e Mateus", ano: 2022, arquivo: "../music/JM---Logo-Eu.mp3" },
    { titulo: "Molhando o Volante", artista: "Jorge e Mateus", ano: 2022, arquivo: "../music/JM---Molhando-o-Volante.mp3" },
    { titulo: "Troca", artista: "Jorge e Mateus", ano: 2022, arquivo: "../music/JM---Troca.mp3" },
    { titulo: "Duas Metades", artista: "Jorge e Mateus", ano: 2022, arquivo: "../music/JM---Duas-Metades.mp3" },
    { titulo: "Tem Que Sorrir", artista: "Jorge e Mateus", ano: 2022, arquivo: "../music/JM---Tem-Que-Sorrir.mp3" },
    { titulo: "Namorando Com Saudade", artista: "Jorge e Mateus", ano: 2022, arquivo: "../music/JM---Namorando-Com-Saudade.mp3" },
    { titulo: "Paradigmas", artista: "Jorge e Mateus", ano: 2022, arquivo: "../music/JM---Paradigmas.mp3" },
    { titulo: "Namora Eu Aí", artista: "Jorge e Mateus", ano: 2022, arquivo: "../music/JM---Namora-Eu-Aí.mp3" },
    { titulo: "A Gente Nem Ficou", artista: "Jorge e Mateus", ano: 2022, arquivo: "../music/JM---A-Gente-Nem-Ficou.mp3" },
    { titulo: "Louca de Saudade", artista: "Jorge e Mateus", ano: 2022, arquivo: "../music/JM---Louca-de-Saudade.mp3" },

    { titulo: "Te Amo Demais", artista: "Marília Mendonça", ano: 2022, arquivo: "../music/MM---Te-amo-Demais.mp3" },
    { titulo: "Leão", artista: "Marília Mendonça", ano: 2022, arquivo: "../music/MM---Leão.mp3" },
    { titulo: "Me Ame Mais", artista: "Marília Mendonça", ano: 2022, arquivo: "../music/MM---Me-Ame-Mais.mp3" },
    { titulo: "Hackearam-me", artista: "Marília Mendonça", ano: 2022, arquivo: "../music/MM---Hackearam-me.mp3" },
    { titulo: "Não Era Pra Ser Assim", artista: "Marília Mendonça", ano: 2022, arquivo: "../music/MM---Não-Era-Pra-Ser-Assim.mp3" },
    { titulo: "Pra Falar a Verdade", artista: "Marília Mendonça", ano: 2022, arquivo: "../music/MM---Pra-Falar-a-Verdade.mp3" },
    { titulo: "Café da Manhã", artista: "Marília Mendonça", ano: 2022, arquivo: "../music/MM---Café-da-Manhã.mp3" },
    { titulo: "Morango do Nordeste", artista: "Marília Mendonça", ano: 2022, arquivo: "../music/MM---Morango-do-Nordeste.mp3" },
    { titulo: "O Que Falta Em Você Sou Eu", artista: "Marília Mendonça", ano: 2022, arquivo: "../music/MM---O-Que-Falta-Em-Você-Sou-Eu.mp3" },
    { titulo: "Troca de Calçada", artista: "Marília Mendonça", ano: 2022, arquivo: "../music/MM---Troca-de-Calçada.mp3" },

    { titulo: "Flor E O Beija-Flor", artista: "Henrique e Juliano", ano: 2015, arquivo: "../music/HJ---Flor-E-O-Beija-Flor.mp3" },
    { titulo: "Garçon Fecha o bar", artista: "Henrique e Juliano", ano: 2015, arquivo: "../music/HJ---Garçon-Fecha-o-bar.mp3" },
    { titulo: "Na Hora Da Raiva", artista: "Henrique e Juliano", ano: 2015, arquivo: "../music/HJ---Na-Hora-Da-Raiva.mp3" },
    { titulo: "Não To Valendo Nada", artista: "Henrique e Juliano", ano: 2015, arquivo: "../music/HJ---Não-To-Valendo-Nada.mp3" },
    { titulo: "Cuida Bem Dela", artista: "Henrique e Juliano", ano: 2015, arquivo: "../music/HJ---Cuida-Bem-Dela.mp3" },
    { titulo: "Até Você Voltar", artista: "Henrique e Juliano", ano: 2015, arquivo: "../music/HJ---Até-Você-Voltar.mp3" },
    { titulo: "As vezes", artista: "Henrique e Juliano", ano: 2015, arquivo: "../music/HJ---As-vezes.mp3" },
    { titulo: "Recaídas", artista: "Henrique e Juliano", ano: 2015, arquivo: "../music/HJ---Recaídas.mp3" },
    { titulo: "Mudando De Assunto", artista: "Henrique e Juliano", ano: 2015, arquivo: "../music/HJ---Mudando-De-Assunto.mp3" },
    { titulo: "Aquela Pessoa", artista: "Henrique e Juliano", ano: 2015, arquivo: "../music/HJ---Aquela-Pessoa.mp3" },

    { titulo: "Narcisista", artista: "Maiara e Maraisa", ano: 2024, arquivo: "../music/MM---Narcisista.mp3" },
    { titulo: "Melhor Terminar", artista: "Maiara e Maraisa", ano: 2024, arquivo: "../music/MM---Melhor-Terminar.mp3" },
    { titulo: "Saudade do Tipo", artista: "Maiara e Maraisa", ano: 2024, arquivo: "../music/MM---Saudade-do-Tipo.mp3" },
    { titulo: "Todo Mundo Menos Você", artista: "Maiara e Maraisa", ano: 2024, arquivo: "../music/MM---Todo-Mundo-Menos-Você.mp3" },
    { titulo: "Medo Bobo", artista: "Maiara e Maraisa", ano: 2024, arquivo: "../music/MM---Medo-Bobo.mp3" },
    { titulo: "Amando o Inimigo", artista: "Maiara e Maraisa", ano: 2024, arquivo: "../music/MM---Amando-o-Inimigo.mp3" },
    { titulo: "Surtos", artista: "Maiara e Maraisa", ano: 2024, arquivo: "../music/MM---Surtos.mp3" },
    { titulo: "Esqueça-me Se For Capaz", artista: "Maiara e Maraisa", ano: 2024, arquivo: "../music/MM---Esqueça-me-Se-For-Capaz.mp3" },
    { titulo: "Quero do Jeito Que Você Quiser", artista: "Maiara e Maraisa", ano: 2024, arquivo: "../music/MM---Quero-do-Jeito-Que-Você-Quiser.mp3" },
    { titulo: "Eu Sou Ela", artista: "Maiara e Maraisa", ano: 2024, arquivo: "../music/MM---Eu-Sou-Ela.mp3" },

    { titulo: "Um Rei", artista: "Ney Matogrosso", ano: 1987, arquivo: "../music/NM---Um-Rei.mp3" },
    { titulo: "Vereda Tropical", artista: "Ney Matogrosso", ano: 1987, arquivo: "../music/NM---Vereda-Tropical.mp3" },
    { titulo: "Tico-Tico No Fubá", artista: "Ney Matogrosso", ano: 1987, arquivo: "../music/NM---Tico-Tico-No-Fubá.mp3" },
    { titulo: "A Cor do Desejo", artista: "Ney Matogrosso", ano: 1987, arquivo: "../music/NM---A-Cor-do-Desejo.mp3" },
    { titulo: "Seu Tipo", artista: "Ney Matogrosso", ano: 1987, arquivo: "../music/NM---Seu-Tipo.mp3" },
    { titulo: "Belíssima", artista: "Ney Matogrosso", ano: 1987, arquivo: "../music/NM---Belíssima.mp3" },
    { titulo: "Sangue Latino", artista: "Ney Matogrosso", ano: 1987, arquivo: "../music/NM---Sangue-Latino.mp3" },
    { titulo: "Samba Rasgado", artista: "Ney Matogrosso", ano: 1987, arquivo: "../music/NM---Samba-Rasgado.mp3" },
    { titulo: "Viajante", artista: "Ney Matogrosso", ano: 1987, arquivo: "../music/NM---Viajante.mp3" },
    { titulo: "Homem Com H", artista: "Ney Matogrosso", ano: 1987, arquivo: "../music/NM---Homem-Com-H.mp3" },

    { titulo: "Amanheceu Peguei a Viola", artista: "Almir Sater", ano: 1990, arquivo: "../music/AS---Amanheceu-Peguei-a-Viola.mp3" },
    { titulo: "Ando Devagar", artista: "Almir Sater", ano: 1990, arquivo: "../music/AS---Ando-Devagar.mp3" },
    { titulo: "Brasil Poeira", artista: "Almir Sater", ano: 1990, arquivo: "../music/AS---Brasil-Poeira.mp3" },
    { titulo: "Boi de Piranha", artista: "Almir Sater", ano: 1990, arquivo: "../music/AS---Boi-de-Piranha.mp3" },
    { titulo: "Boiada", artista: "Almir Sater", ano: 1990, arquivo: "../music/AS---Boiada.mp3" },
    { titulo: "Caminhos Me Levem", artista: "Almir Sater", ano: 1990, arquivo: "../music/AS---Caminhos-Me-Levem.mp3" },
    { titulo: "Cavaleiro da Lua", artista: "Almir Sater", ano: 1990, arquivo: "../music/AS---Cavaleiro-da-Lua.mp3" },
    { titulo: "Corumba", artista: "Almir Sater", ano: 1990, arquivo: "../music/AS---Corumba.mp3" },
    { titulo: "Flor do Amor", artista: "Almir Sater", ano: 1990, arquivo: "../music/AS---Flor-do-Amor.mp3" },
    { titulo: "Lamento Sertanejo", artista: "Almir Sater", ano: 1990, arquivo: "../music/AS---Lamento-Sertanejo.mp3" },
    { titulo: "Luzeiro", artista: "Almir Sater", ano: 1990, arquivo: "../music/AS---Luzeiro.mp3" },
    { titulo: "Minas Gerais", artista: "Almir Sater", ano: 1990, arquivo: "../music/AS---Minas-Gerais.mp3" },
    { titulo: "Peão", artista: "Almir Sater", ano: 1990, arquivo: "../music/AS---Peão.mp3" },
    { titulo: "Rasta Bonito", artista: "Almir Sater", ano: 1990, arquivo: "../music/AS---Rasta-Bonito.mp3" },
    { titulo: "Sabor das Manhãs", artista: "Almir Sater", ano: 1990, arquivo: "../music/AS---Sabor-das-Manhãs.mp3" },
    { titulo: "Trem do Pantanal", artista: "Almir Sater", ano: 1990, arquivo: "../music/AS---Trem-do-Pantanal.mp3" },
    { titulo: "Senhores da Terra", artista: "Almir Sater", ano: 1990, arquivo: "../music/AS---Senhores-da-Terra.mp3" },
    { titulo: "Hora do Clarão", artista: "Almir Sater", ano: 1990, arquivo: "../music/AS---Hora-do-Clarão.mp3" },
    { titulo: "Missões Naturais", artista: "Almir Sater", ano: 1990, arquivo: "../music/AS---Missões-Naturais.mp3" },
    { titulo: "Travessia do Rio Araguaia", artista: "Almir Sater", ano: 1990, arquivo: "../music/AS---Travessia-do-Rio-Araguaia.mp3" }
];

// ===== PLAYER GLOBAL (roda em TODAS as páginas do site) =====
document.addEventListener("DOMContentLoaded", () => {
    const audioPlayer = document.getElementById("audio-player");
    if (!audioPlayer) return;

    audioPlayer.addEventListener("play", () => {
        atualizarIconePlay(true);

        if (disco) {
            disco.classList.add("tocando");
        }
    });

    audioPlayer.addEventListener("pause", () => {
        atualizarIconePlay(false);

        if (disco) {
            disco.classList.remove("tocando");
        }
    });

    const CHAVE_INDICE = "radio_indiceAtual";
    const CHAVE_TEMPO = "radio_tempoAtual";

    // ----- Elementos da interface (só existem na página radio.html) -----
    const disco = document.getElementById("disco");
    const infoTitulo = document.getElementById("info-titulo");
    const infoArtista = document.getElementById("info-artista");
    const infoAno = document.getElementById("info-ano");
    const fixoTitulo = document.getElementById("fixo-titulo");
    const fixoArtista = document.getElementById("fixo-artista");

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

    const temInterfaceRadio = !!disco; // true só na página radio.html

    let listaAtual = [...musicas]; // lista em uso (pode ser filtrada)

    // ----- Sorteia um índice diferente do atual -----
    function sortearIndice(indiceAtualEvitar){
        if (musicas.length === 1) return 0;
        let novoIndice;
        do {
            novoIndice = Math.floor(Math.random() * musicas.length);
        } while (novoIndice === indiceAtualEvitar);
        return novoIndice;
    }

    // ----- Atualiza a interface visual (disco, textos, lista) -----
    function atualizarInterface(musica){
        if (!temInterfaceRadio) return;

        infoTitulo.textContent = musica.titulo;
        infoArtista.textContent = `Artista: ${musica.artista}`;
        infoAno.textContent = `Lançamento: ${musica.ano}`;

        if (fixoTitulo) {
            fixoTitulo.textContent = musica.titulo;
        }

        if (fixoArtista) {
            fixoArtista.textContent = musica.artista;
        }

        disco.classList.add("tocando");
        atualizarIconePlay(true);
        const itens = listaMusicas.querySelectorAll("li");
        itens.forEach(li => li.classList.remove("tocando-agora"));
        const itemAtual = [...itens].find(li => li.textContent.includes(musica.titulo));
        if (itemAtual) itemAtual.classList.add("tocando-agora");
    }

    // ----- Troca o ícone do botão de play/pause -----
    function atualizarIconePlay(tocando){
        if (!btnPlay) return;
        const icone = btnPlay.querySelector(".material-symbols-outlined");
        if (icone) {
            icone.textContent = tocando ? "pause" : "play_arrow";
        }
    }

    // ----- Toca uma música pelo índice global (array completo "musicas") -----
    function tocarMusicaGlobal(indice, tempoInicial = 0){
        const musica = musicas[indice];


        console.log("Música:", musica);
        console.log("Arquivo:", musica.arquivo);

        if (!musica) return;

        audioPlayer.src = musica.arquivo;

        console.log("SRC FINAL:", audioPlayer.src);

        audioPlayer.currentTime = tempoInicial;

        audioPlayer.play()
            .then(() => {
                atualizarInterface(musica);
                atualizarIconePlay(true);
                disco?.classList.add("tocando");
            })
            .catch(() => {
                atualizarInterface(musica);
                atualizarIconePlay(false);
                disco?.classList.remove("tocando");
            });
        localStorage.setItem(CHAVE_INDICE, indice);

        atualizarInterface(musica);
    }

    // ----- Próxima música aleatória (usada no loop automático) -----
    function proximaMusicaAleatoria(){
        const indiceAtual = parseInt(localStorage.getItem(CHAVE_INDICE)) || 0;
        const novoIndice = sortearIndice(indiceAtual);
        tocarMusicaGlobal(novoIndice);
    }

    // ----- Loop infinito: ao acabar, toca outra aleatória -----
    audioPlayer.addEventListener("ended", () => {
        proximaMusicaAleatoria();
    });

    // ----- Salva o tempo para retomar entre páginas -----
    audioPlayer.addEventListener("timeupdate", () => {
        localStorage.setItem(CHAVE_TEMPO, audioPlayer.currentTime);

        if (temInterfaceRadio){
            progressBar.value = audioPlayer.currentTime;
            tempoAtual.textContent = formatarTempo(audioPlayer.currentTime);
        }
    });

    function formatarTempo(segundos){
        if (isNaN(segundos)) return "0:00";
        const min = Math.floor(segundos / 60);
        const sec = Math.floor(segundos % 60).toString().padStart(2, "0");
        return `${min}:${sec}`;
    }

    // ----- INICIALIZAÇÃO DO PLAYER: retoma de onde parou OU sorteia uma nova -----
    function iniciarRadio(){
        const indiceSalvo = localStorage.getItem(CHAVE_INDICE);
        const tempoSalvo = parseFloat(localStorage.getItem(CHAVE_TEMPO)) || 0;

        if (indiceSalvo !== null){
            tocarMusicaGlobal(parseInt(indiceSalvo), tempoSalvo);
        } else {
            const indiceInicial = Math.floor(Math.random() * musicas.length);
            tocarMusicaGlobal(indiceInicial);
        }
    }

    iniciarRadio();

    // ----- Autoplay com som só é permitido após interação do usuário -----
    document.addEventListener("click", function iniciarComInteracao(){
        if (audioPlayer.paused){
            audioPlayer.play().catch(() => {});
        }
        document.removeEventListener("click", iniciarComInteracao);
    }, { once: true });


    // ========== A PARTIR DE AQUI, SÓ RODA NA PÁGINA radio.html ==========
    if (!temInterfaceRadio) return;

    // ----- Renderiza a lista de músicas na tela -----
    function renderizarLista(lista){
        listaMusicas.innerHTML = "";

        lista.forEach((musica) => {
            const li = document.createElement("li");
            li.innerHTML = `
                <span>${musica.titulo} - ${musica.artista}</span>
                <span>${musica.ano}</span>
            `;
            li.addEventListener("click", () => {
                const indiceNoArrayGlobal = musicas.indexOf(musica);
                listaAtual = lista;
                tocarMusicaGlobal(indiceNoArrayGlobal);
            });
            listaMusicas.appendChild(li);
        });
    }

    // ----- Preenche os filtros de artista e ano -----
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

    // ----- Botão de play/pause -----
    btnPlay.addEventListener("click", () => {
        if (audioPlayer.paused){
            audioPlayer.play();
        } else {
            audioPlayer.pause();
        }
    });

    // ----- Próxima / Anterior manuais (dentro da lista atual filtrada) -----
    btnProximo.addEventListener("click", () => {
        const indiceAtualGlobal = parseInt(localStorage.getItem(CHAVE_INDICE)) || 0;
        const musicaAtual = musicas[indiceAtualGlobal];
        const posicaoNaLista = listaAtual.indexOf(musicaAtual);

        const proximaPosicao = (posicaoNaLista + 1) % listaAtual.length;
        const proximaMusica = listaAtual[proximaPosicao];
        const indiceNoArrayGlobal = musicas.indexOf(proximaMusica);

        tocarMusicaGlobal(indiceNoArrayGlobal);
    });

    btnAnterior.addEventListener("click", () => {
        const indiceAtualGlobal = parseInt(localStorage.getItem(CHAVE_INDICE)) || 0;
        const musicaAtual = musicas[indiceAtualGlobal];
        const posicaoNaLista = listaAtual.indexOf(musicaAtual);

        const posicaoAnterior = (posicaoNaLista - 1 + listaAtual.length) % listaAtual.length;
        const musicaAnterior = listaAtual[posicaoAnterior];
        const indiceNoArrayGlobal = musicas.indexOf(musicaAnterior);

        tocarMusicaGlobal(indiceNoArrayGlobal);
    });

    // ----- Barra de progresso -----
    audioPlayer.addEventListener("loadedmetadata", () => {
        progressBar.max = audioPlayer.duration;
        tempoTotal.textContent = formatarTempo(audioPlayer.duration);
    });

    progressBar.addEventListener("input", () => {
        audioPlayer.currentTime = progressBar.value;
    });

    // ----- Volume -----
    volumeSlider.addEventListener("input", () => {
        audioPlayer.volume = volumeSlider.value;
    });
    audioPlayer.volume = volumeSlider.value;

    // ----- Filtro por artista e ano -----
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

        listaAtual = filtradas;
        renderizarLista(filtradas);

        const indiceNoArrayGlobal = musicas.indexOf(filtradas[0]);
        tocarMusicaGlobal(indiceNoArrayGlobal);
    });

    // ----- Inicialização da interface -----
    preencherFiltros();
    renderizarLista(musicas);

    // Marca visualmente na lista a música que já está tocando (vinda de outra página)
    const indiceJaTocando = parseInt(localStorage.getItem(CHAVE_INDICE));
    if (!isNaN(indiceJaTocando)){
        atualizarInterface(musicas[indiceJaTocando]);
    }
});


/* ---------------------------- SCRIPT DAS NOTÍCIAS ---------------------------*/

document.addEventListener("DOMContentLoaded", () => {
    const grid = document.getElementById("noticias-grid");
    if (!grid) return; // só roda na página de notícias

    const loading = document.getElementById("noticias-loading");
    const erro = document.getElementById("noticias-erro");
    const botoesFiltro = document.querySelectorAll(".filtro-estado");

    // ATENÇÃO: troque pela sua chave da GNews (veja nota de segurança abaixo)
    const GNEWS_API_KEY = "eaa6e3c172e18829f1abfb442deef235";

    // Termos de busca por estado/região
    const termosBusca = {
        "centro-oeste": "Brasília OR Goiânia OR Cuiabá OR \"Campo Grande\" OR \"Centro-Oeste\"",
        "df": "Brasília OR \"Distrito Federal\"",
        "go": "Goiânia OR Goiás",
        "mt": "Cuiabá OR \"Mato Grosso\"",
        "ms": "\"Campo Grande\" OR \"Mato Grosso do Sul\""
    };

    async function buscarNoticias(estado = "centro-oeste") {
        loading.style.display = "block";
        erro.style.display = "none";
        grid.innerHTML = "";

        const query = encodeURIComponent(termosBusca[estado]);
        const url = `https://gnews.io/api/v4/search?q=${query}&lang=pt&country=br&max=12&apikey=${eaa6e3c172e18829f1abfb442deef235}`;

        try {
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error("Erro na resposta da API");
            }

            const data = await response.json();

            loading.style.display = "none";

            if (!data.articles || data.articles.length === 0) {
                erro.textContent = "Nenhuma notícia encontrada para essa região no momento.";
                erro.style.display = "block";
                return;
            }

            renderizarNoticias(data.articles);

        } catch (error) {
            console.error("Erro ao buscar notícias:", error);
            loading.style.display = "none";
            erro.textContent = "Não foi possível carregar as notícias no momento.";
            erro.style.display = "block";
        }
    }

    function renderizarNoticias(artigos) {
        grid.innerHTML = "";

        artigos.forEach((artigo) => {
            const card = document.createElement("a");
            card.classList.add("noticia-card");
            card.href = artigo.url;
            card.target = "_blank";
            card.rel = "noopener noreferrer";
            card.style.textDecoration = "none";
            card.style.color = "inherit";

            const dataFormatada = formatarData(artigo.publishedAt);

            card.innerHTML = `
                <img src="${artigo.image || ''}" alt="${artigo.title}" onerror="this.style.display='none'">
                <div class="noticia-conteudo">
                    <span class="noticia-fonte">${artigo.source?.name || "Fonte desconhecida"}</span>
                    <h3 class="noticia-titulo">${artigo.title}</h3>
                    <p class="noticia-resumo">${artigo.description || ""}</p>
                    <span class="noticia-data">${dataFormatada}</span>
                </div>
            `;

            grid.appendChild(card);
        });
    }

    function formatarData(dataISO) {
        if (!dataISO) return "";
        const data = new Date(dataISO);
        return data.toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "long",
            year: "numeric"
        });
    }

    // ----- Filtro por estado -----
    botoesFiltro.forEach((botao) => {
        botao.addEventListener("click", () => {
            botoesFiltro.forEach((b) => b.classList.remove("active"));
            botao.classList.add("active");

            const estado = botao.dataset.estado;
            buscarNoticias(estado);
        });
    });

    // ----- Carrega notícias da região inteira ao abrir a página -----
    buscarNoticias("centro-oeste");
});