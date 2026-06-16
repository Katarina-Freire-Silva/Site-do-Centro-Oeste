
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


        {
            titulo: "Cade Você",
            artista: "Leandro e Leonardo",
            ano: 1990,
            arquivo: "../music/LL---Cade-Você.mp3"
        },
                {
            titulo: "Talvez Você Se Lembre",
            artista: "Leandro e Leonardo",
            ano: 1990,
            arquivo: "../music/LL---Talvez-Você-Se-Lembre.mp3"
        },
        {
            titulo: "O Cheiro da Maça",
            artista: "Leandro e Leonardo",
            ano: 1990,
            arquivo: "../music/LL---O-Cheiro-da-Maça.mp3"
        },
        {
            titulo: "Coração Quer Te Encontrar",
            artista: "Leandro e Leonardo",
            ano: 1990,
            arquivo: "../music/LL---Coração-Quer-Te-Encontrar.mp3"
        },
        {
            titulo: "Mais uma Vez Sozinho (Marcas do Amor)",
            artista: "Leandro e Leonardo",
            ano: 1990,
            arquivo: "../music/LL---Mais-uma-Vez-Sozinho-(Marcas-do-Amor).mp3"
        },
        {
            titulo: "Pra Nunca Dizer Adeus",
            artista: "Leandro e Leonardo",
            ano: 1990,
            arquivo: "../music/LL---Pra-Nunca-Dizer-Adeus.mp3"
        },
        {
            titulo: "Pense em Mim",
            artista: "Leandro e Leonardo",
            ano: 1990,
            arquivo: "../music/LL---Pense-em-Mim.mp3"
        },
        {
            titulo: "Só Fazendo Amor",
            artista: "Leandro e Leonardo",
            ano: 1990,
            arquivo: "../music/LL---Só-Fazendo-Amor.mp3"
        },
        {
            titulo: "Você Ainda Vai Voltar",
            artista: "Leandro e Leonardo",
            ano: 1990,
            arquivo: "../music/LL---Você-Ainda-Vai-Voltar.mp3"
        },
        {
            titulo: "Desculpe Mas Eu Vou Chorar",
            artista: "Leandro e Leonardo",
            ano: 1990,
            arquivo: "../music/LL---Desculpe-Mas-Eu-Vou-Chorar.mp3"
        },

        {
            titulo: "Logo Eu",
            artista: "Jorge e Mateus",
            ano: 2022,
            arquivo: "../music/JM---Logo-Eu.mp3"
        },
                {
            titulo: "Molhando o Volante",
            artista: "Jorge e Mateus",
            ano: 2022,
            arquivo: "../music/JM---Molhando-o-Volante.mp3"
        },
        {
            titulo: "Troca",
            artista: "Jorge e Mateus",
            ano: 2022,
            arquivo: "../music/JM---Troca.mp3"
        },
        {
            titulo: "Duas Metades",
            artista: "Jorge e Mateus",
            ano: 2022,
            arquivo: "../music/JM---Duas-Metades.mp3"
        },
        {
            titulo: "Tem Que Sorrir",
            artista: "Jorge e Mateus",
            ano: 2022,
            arquivo: "../music/JM---Tem-Que-Sorrir.mp3"
        },
        {
            titulo: "Namorando Com Saudade",
            artista: "Jorge e Mateus",
            ano: 2022,
            arquivo: "../music/JM---Namorando-Com-Saudade.mp3"
        },
        {
            titulo: "Paradigmas",
            artista: "Jorge e Mateus",
            ano: 2022,
            arquivo: "../music/JM---Paradigmas.mp3"
        },
        {
            titulo: "Namora Eu Aí",
            artista: "Jorge e Mateus",
            ano: 2022,
            arquivo: "../music/JM---Namora-Eu-Aí.mp3"
        },
        {
            titulo: "A Gente Nem Ficou",
            artista: "Jorge e Mateus",
            ano: 2022,
            arquivo: "../music/JM---A-Gente-Nem-Ficou.mp3"
        },
        {
            titulo: "Louca de Saudade",
            artista: "Jorge e Mateus",
            ano: 2022,
            arquivo: "../music/JM---Louca-de-Saudade.mp3"
        },

        {
            titulo: "Te Amo Demais",
            artista: "Marília Mendonça",
            ano: 2022,
            arquivo: "../music/MM---Te-amo-Demais.mp3"
        },
                {
            titulo: "Leão",
            artista: "Marília Mendonça",
            ano: 2022,
            arquivo: "../music/MM---Leão.mp3"
        },
        {
            titulo: "Me Ame Mais",
            artista: "Marília Mendonça",
            ano: 2022,
            arquivo: "../music/MM---Me-Ame-Mais.mp3"
        },
        {
            titulo: "Hackearam-me",
            artista: "Marília Mendonça",
            ano: 2022,
            arquivo: "../music/MM---Hackearam-me.mp3"
        },
        {
            titulo: "Não Era Pra Ser Assim",
            artista: "Marília Mendonça",
            ano: 2022,
            arquivo: "../music/MM---Não-Era-Pra-Ser-Assim.mp3"
        },
        {
            titulo: "Pra Falar a Verdade",
            artista: "Marília Mendonça",
            ano: 2022,
            arquivo: "../music/MM---Pra-Falar-a-Verdade.mp3"
        },
        {
            titulo: "Café da Manhã",
            artista: "Marília Mendonça",
            ano: 2022,
            arquivo: "../music/MM---Café-da-Manhã.mp3"
        },
        {
            titulo: "Morango do Nordeste",
            artista: "Marília Mendonça",
            ano: 2022,
            arquivo: "../music/MM---Morango-do-Nordeste.mp3"
        },
        {
            titulo: "O Que Falta Em Você Sou Eu",
            artista: "Marília Mendonça",
            ano: 2022,
            arquivo: "../music/MM---O-Que-Falta-Em-Você-Sou-Eu.mp3"
        },
        {
            titulo: "Troca de Calçada",
            artista: "Marília Mendonça",
            ano: 2022,
            arquivo: "../music/MM---Troca-de-Calçada.mp3"
        },

        {
            titulo: "Flor E O Beija-Flor",
            artista: "Henrique e Juliano",
            ano: 2015,
            arquivo: "../music/HJ---Flor-E-O-Beija-Flor.mp3"
        },
                {
            titulo: "Garçon Fecha o bar",
            artista: "Henrique e Juliano",
            ano: 2015,
            arquivo: "../music/HJ---Garçon-Fecha-o-bar.mp3"
        },
        {
            titulo: "Na Hora Da Raiva",
            artista: "Henrique e Juliano",
            ano: 2015,
            arquivo: "../music/HJ---Na-Hora-Da-Raiva.mp3"
        },
        {
            titulo: "Não To Valendo Nada",
            artista: "Henrique e Juliano",
            ano: 2015,
            arquivo: "../music/HJ---Não-To-Valendo-Nada.mp3"
        },
        {
            titulo: "Cuida Bem Dela",
            artista: "Henrique e Juliano",
            ano: 2015,
            arquivo: "../music/HJ---Cuida-Bem-Dela.mp3"
        },
        {
            titulo: "Até Você Voltar",
            artista: "Henrique e Juliano",
            ano: 2015,
            arquivo: "../music/HJ---Até-Você-Voltar.mp3"
        },
        {
            titulo: "As vezes",
            artista: "Henrique e Juliano",
            ano: 2015,
            arquivo: "../music/HJ---As-vezes.mp3"
        },
        {
            titulo: "Recaídas",
            artista: "Henrique e Juliano",
            ano: 2015,
            arquivo: "../music/HJ---Recaídas.mp3"
        },
        {
            titulo: "Mudando De Assunto",
            artista: "Henrique e Juliano",
            ano: 2015,
            arquivo: "../music/HJ---Mudando-De-Assunto.mp3"
        },
        {
            titulo: "Aquela Pessoa",
            artista: "Henrique e Juliano",
            ano: 2015,
            arquivo: "../music/HJ---Aquela-Pessoa.mp3"
        },

        {
            titulo: "Narcisista",
            artista: "Maiara e Maraisa",
            ano: 2024,
            arquivo: "../music/MM---Narcisista.mp3"
        },
                {
            titulo: "Melhor Terminar",
            artista: "Maiara e Maraisa",
            ano: 2024,
            arquivo: "../music/MM---Melhor-Terminar.mp3"
        },
        {
            titulo: "Saudade do Tipo",
            artista: "Maiara e Maraisa",
            ano: 2024,
            arquivo: "../music/MM---Saudade-do-Tipo.mp3"
        },
        {
            titulo: "Todo Mundo Menos Você",
            artista: "Maiara e Maraisa",
            ano: 2024,
            arquivo: "../music/MM---Todo-Mundo-Menos-Você.mp3"
        },
        {
            titulo: "Medo Bobo",
            artista: "Maiara e Maraisa",
            ano: 2024,
            arquivo: "../music/MM---Medo-Bobo.mp3"
        },
        {
            titulo: "Amando o Inimigo",
            artista: "Maiara e Maraisa",
            ano: 2024,
            arquivo: "../music/MM---Amando-o-Inimigo.mp3"
        },
        {
            titulo: "Surtos",
            artista: "Maiara e Maraisa",
            ano: 2024,
            arquivo: "../music/MM---Surtos.mp3"
        },
        {
            titulo: "Esqueça-me Se For Capaz",
            artista: "Maiara e Maraisa",
            ano: 2024,
            arquivo: "../music/MM---Esqueça-me-Se-For-Capaz.mp3"
        },
        {
            titulo: "Quero do Jeito Que Você Quiser",
            artista: "Maiara e Maraisa",
            ano: 2024,
            arquivo: "../music/MM---Quero-do-Jeito-Que-Você-Quiser.mp3"
        },
        {
            titulo: "Eu Sou Ela",
            artista: "Maiara e Maraisa",
            ano: 2024,
            arquivo: "../music/MM---Eu-Sou-Ela.mp3"
        },

        {
            titulo: "Um Rei",
            artista: "Ney Matogrosso",
            ano: 1987,
            arquivo: "../music/NM---Um-Rei.mp3"
        },
        {
            titulo: "Vereda Tropical",
            artista: "Ney Matogrosso",
            ano: 1987,
            arquivo: "../music/NM---Vereda-Tropical.mp3"
        },
        {
            titulo: "Tico-Tico No Fubá",
            artista: "Ney Matogrosso",
            ano: 1987,
            arquivo: "../music/NM---Tico-Tico-No-Fubá.mp3"
        },
        {
            titulo: "A Cor do Desejo",
            artista: "Ney Matogrosso",
            ano: 1987,
            arquivo: "../music/NM---A-Cor-do-Desejo.mp3"
        },
        {
            titulo: "Seu Tipo",
            artista: "Ney Matogrosso",
            ano: 1987,
            arquivo: "../music/NM---Seu-Tipo.mp3"
        },
        {
            titulo: "Belíssima",
            artista: "Ney Matogrosso",
            ano: 1987,
            arquivo: "../music/NM---Belíssima.mp3"
        },
        {
            titulo: "Sangue Latino",
            artista: "Ney Matogrosso",
            ano: 1987,
            arquivo: "../music/NM---Sangue-Latino.mp3"
        },
        {
            titulo: "Samba Rasgado",
            artista: "Ney Matogrosso",
            ano: 1987,
            arquivo: "../music/NM---Samba-Rasgado.mp3"
        },
        {
            titulo: "Viajante",
            artista: "Ney Matogrosso",
            ano: 1987,
            arquivo: "../music/NM---Viajante.mp3"
        },
        {
            titulo: "Homem Com H",
            artista: "Ney Matogrosso",
            ano: 1987,
            arquivo: "../music/NM---Homem-Com-H.mp3"
        },

        {
            titulo: "Amanheceu Peguei a Viola",
            artista: "Almir Sater",
            ano: 1990,
            arquivo: "../music/AS---Amanheceu-Peguei-a-Viola.mp3"
        },
        {
            titulo: "Ando Devagar",
            artista: "Almir Sater",
            ano: 1990,
            arquivo: "../music/AS---Ando-Devagar.mp3"
        },
        {
            titulo: "Brasil Poeira",
            artista: "Almir Sater",
            ano: 1990,
            arquivo: "../music/AS---Brasil-Poeira.mp3"
        },
        {
            titulo: "Boi de Piranha",
            artista: "Almir Sater",
            ano: 1990,
            arquivo: "../music/AS---Boi-de-Piranha.mp3"
        },
        {
            titulo: "Boiada",
            artista: "Almir Sater",
            ano: 1990,
            arquivo: "../music/AS---Boiada.mp3"
        },
        {
            titulo: "Caminhos Me Levem",
            artista: "Almir Sater",
            ano: 1990,
            arquivo: "../music/AS---Caminhos-Me-Levem.mp3"
        },
        {
            titulo: "Cavaleiro da Lua",
            artista: "Almir Sater",
            ano: 1990,
            arquivo: "../music/AS---Cavaleiro-da-Lua.mp3"
        },
        {
            titulo: "Corumba",
            artista: "Almir Sater",
            ano: 1990,
            arquivo: "../music/AS---Corumba.mp3"
        },
        {
            titulo: "Flor do Amor",
            artista: "Almir Sater",
            ano: 1990,
            arquivo: "../music/AS---Flor-do-Amor.mp3"
        },
        {
            titulo: "Lamento Sertanejo",
            artista: "Almir Sater",
            ano: 1990,
            arquivo: "../music/AS---Lamento-Sertanejo.mp3"
        },
        {
            titulo: "Luzeiro",
            artista: "Almir Sater",
            ano: 1990,
            arquivo: "../music/AS---Luzeiro.mp3"
        },
        {
            titulo: "Minas Gerais",
            artista: "Almir Sater",
            ano: 1990,
            arquivo: "../music/AS---Minas-Gerais.mp3"
        },
        {
            titulo: "Peão",
            artista: "Almir Sater",
            ano: 1990,
            arquivo: "../music/AS---Peão.mp3"
        },
        {
            titulo: "Rasta Bonito",
            artista: "Almir Sater",
            ano: 1990,
            arquivo: "../music/AS---Rasta-Bonito.mp3"
        },
        {
            titulo: "Sabor das Manhãs",
            artista: "Almir Sater",
            ano: 1990,
            arquivo: "../music/AS---Sabor-das-Manhãs.mp3"
        },
        {
            titulo: "Trem do Pantanal",
            artista: "Almir Sater",
            ano: 1990,
            arquivo: "../music/AS---Trem-do-Pantanal.mp3"
        },
        {
            titulo: "Senhores da Terra",
            artista: "Almir Sater",
            ano: 1990,
            arquivo: "../music/AS---Senhores-da-Terra.mp3"
        },
        {
            titulo: "Hora do Clarão",
            artista: "Almir Sater",
            ano: 1990,
            arquivo: "../music/AS---Hora-do-Clarão.mp3"
        },
        {
            titulo: "Missões Naturais",
            artista: "Almir Sater",
            ano: 1990,
            arquivo: "../music/AS---Missões-Naturais.mp3"
        },
        {
            titulo: "Travessia do Rio Araguaia",
            artista: "Almir Sater",
            ano: 1990,
            arquivo: "../music/AS---Travessia-do-Rio-Araguaia.mp3"
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