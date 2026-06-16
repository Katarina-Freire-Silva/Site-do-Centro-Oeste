
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

// ===== BANCO DE MÚSICAS (compartilhado entre todas as páginas) =====
const musicas = [
    { titulo: "É o Amor", artista: "Zezé Di Camargo & Luciano", ano: 1991, arquivo: "/music/ZL---É-o-Amor.mp3" },
    { titulo: "Entre Ele e Eu", artista: "Zezé Di Camargo & Luciano", ano: 1991, arquivo: "/music/ZL---Entre-Ele-e-Eu.mp3" },
    { titulo: "Rédeas do Possante", artista: "Zezé Di Camargo & Luciano", ano: 1991, arquivo: "/music/ZL---Rédeas-do-Possante.mp3" },
    { titulo: "Deus", artista: "Zezé Di Camargo & Luciano", ano: 1991, arquivo: "/music/ZL---Deus.mp3" },
    { titulo: "A Estrela Só", artista: "Zezé Di Camargo & Luciano", ano: 1991, arquivo: "/music/ZL---A-Estrela-Só.mp3" },
    { titulo: "Pouco a Pouco", artista: "Zezé Di Camargo & Luciano", ano: 1991, arquivo: "/music/ZL---Pouco-a-Pouco.mp3" },
    { titulo: "Águas Passadas", artista: "Zezé Di Camargo & Luciano", ano: 1991, arquivo: "/music/ZL---Águas-Passadas.mp3" },
    { titulo: "Eu Te Amo", artista: "Zezé Di Camargo & Luciano", ano: 1991, arquivo: "/music/ZL---Eu-Te-Amo.mp3" },
    { titulo: "Quem Sou Eu Sem Ela", artista: "Zezé Di Camargo & Luciano", ano: 1991, arquivo: "/music/ZL---Quem-Sou-Eu-Sem-Ela.mp3" },
    { titulo: "Para Desbotar a Saudade", artista: "Zezé Di Camargo & Luciano", ano: 1991, arquivo: "/music/ZL---Para-Desbotar-a-Saudade.mp3" },

    { titulo: "Cade Você", artista: "Leandro e Leonardo", ano: 1990, arquivo: "/music/LL---Cade-Você.mp3" },
    { titulo: "Talvez Você Se Lembre", artista: "Leandro e Leonardo", ano: 1990, arquivo: "/music/LL---Talvez-Você-Se-Lembre.mp3" },
    { titulo: "O Cheiro da Maça", artista: "Leandro e Leonardo", ano: 1990, arquivo: "/music/LL---O-Cheiro-da-Maça.mp3" },
    { titulo: "Coração Quer Te Encontrar", artista: "Leandro e Leonardo", ano: 1990, arquivo: "/music/LL---Coração-Quer-Te-Encontrar.mp3" },
    { titulo: "Mais uma Vez Sozinho (Marcas do Amor)", artista: "Leandro e Leonardo", ano: 1990, arquivo: "/music/LL---Mais-uma-Vez-Sozinho-(Marcas-do-Amor).mp3" },
    { titulo: "Pra Nunca Dizer Adeus", artista: "Leandro e Leonardo", ano: 1990, arquivo: "/music/LL---Pra-Nunca-Dizer-Adeus.mp3" },
    { titulo: "Pense em Mim", artista: "Leandro e Leonardo", ano: 1990, arquivo: "/music/LL---Pense-em-Mim.mp3" },
    { titulo: "Só Fazendo Amor", artista: "Leandro e Leonardo", ano: 1990, arquivo: "/music/LL---Só-Fazendo-Amor.mp3" },
    { titulo: "Você Ainda Vai Voltar", artista: "Leandro e Leonardo", ano: 1990, arquivo: "/music/LL---Você-Ainda-Vai-Voltar.mp3" },
    { titulo: "Desculpe Mas Eu Vou Chorar", artista: "Leandro e Leonardo", ano: 1990, arquivo: "/music/LL---Desculpe-Mas-Eu-Vou-Chorar.mp3" },

    { titulo: "Logo Eu", artista: "Jorge e Mateus", ano: 2022, arquivo: "/music/JM---Logo-Eu.mp3" },
    { titulo: "Molhando o Volante", artista: "Jorge e Mateus", ano: 2022, arquivo: "/music/JM---Molhando-o-Volante.mp3" },
    { titulo: "Troca", artista: "Jorge e Mateus", ano: 2022, arquivo: "/music/JM---Troca.mp3" },
    { titulo: "Duas Metades", artista: "Jorge e Mateus", ano: 2022, arquivo: "/music/JM---Duas-Metades.mp3" },
    { titulo: "Tem Que Sorrir", artista: "Jorge e Mateus", ano: 2022, arquivo: "/music/JM---Tem-Que-Sorrir.mp3" },
    { titulo: "Namorando Com Saudade", artista: "Jorge e Mateus", ano: 2022, arquivo: "/music/JM---Namorando-Com-Saudade.mp3" },
    { titulo: "Paradigmas", artista: "Jorge e Mateus", ano: 2022, arquivo: "/music/JM---Paradigmas.mp3" },
    { titulo: "Namora Eu Aí", artista: "Jorge e Mateus", ano: 2022, arquivo: "/music/JM---Namora-Eu-Aí.mp3" },
    { titulo: "A Gente Nem Ficou", artista: "Jorge e Mateus", ano: 2022, arquivo: "/music/JM---A-Gente-Nem-Ficou.mp3" },
    { titulo: "Louca de Saudade", artista: "Jorge e Mateus", ano: 2022, arquivo: "/music/JM---Louca-de-Saudade.mp3" },

    { titulo: "Te Amo Demais", artista: "Marília Mendonça", ano: 2022, arquivo: "/music/MM---Te-amo-Demais.mp3" },
    { titulo: "Leão", artista: "Marília Mendonça", ano: 2022, arquivo: "/music/MM---Leão.mp3" },
    { titulo: "Me Ame Mais", artista: "Marília Mendonça", ano: 2022, arquivo: "/music/MM---Me-Ame-Mais.mp3" },
    { titulo: "Hackearam-me", artista: "Marília Mendonça", ano: 2022, arquivo: "/music/MM---Hackearam-me.mp3" },
    { titulo: "Não Era Pra Ser Assim", artista: "Marília Mendonça", ano: 2022, arquivo: "/music/MM---Não-Era-Pra-Ser-Assim.mp3" },
    { titulo: "Pra Falar a Verdade", artista: "Marília Mendonça", ano: 2022, arquivo: "/music/MM---Pra-Falar-a-Verdade.mp3" },
    { titulo: "Café da Manhã", artista: "Marília Mendonça", ano: 2022, arquivo: "/music/MM---Café-da-Manhã.mp3" },
    { titulo: "Morango do Nordeste", artista: "Marília Mendonça", ano: 2022, arquivo: "/music/MM---Morango-do-Nordeste.mp3" },
    { titulo: "O Que Falta Em Você Sou Eu", artista: "Marília Mendonça", ano: 2022, arquivo: "/music/MM---O-Que-Falta-Em-Você-Sou-Eu.mp3" },
    { titulo: "Troca de Calçada", artista: "Marília Mendonça", ano: 2022, arquivo: "/music/MM---Troca-de-Calçada.mp3" },

    { titulo: "Flor E O Beija-Flor", artista: "Henrique e Juliano", ano: 2015, arquivo: "/music/HJ---Flor-E-O-Beija-Flor.mp3" },
    { titulo: "Garçon Fecha o bar", artista: "Henrique e Juliano", ano: 2015, arquivo: "/music/HJ---Garçon-Fecha-o-bar.mp3" },
    { titulo: "Na Hora Da Raiva", artista: "Henrique e Juliano", ano: 2015, arquivo: "/music/HJ---Na-Hora-Da-Raiva.mp3" },
    { titulo: "Não To Valendo Nada", artista: "Henrique e Juliano", ano: 2015, arquivo: "/music/HJ---Não-To-Valendo-Nada.mp3" },
    { titulo: "Cuida Bem Dela", artista: "Henrique e Juliano", ano: 2015, arquivo: "/music/HJ---Cuida-Bem-Dela.mp3" },
    { titulo: "Até Você Voltar", artista: "Henrique e Juliano", ano: 2015, arquivo: "/music/HJ---Até-Você-Voltar.mp3" },
    { titulo: "As vezes", artista: "Henrique e Juliano", ano: 2015, arquivo: "/music/HJ---As-vezes.mp3" },
    { titulo: "Recaídas", artista: "Henrique e Juliano", ano: 2015, arquivo: "/music/HJ---Recaídas.mp3" },
    { titulo: "Mudando De Assunto", artista: "Henrique e Juliano", ano: 2015, arquivo: "/music/HJ---Mudando-De-Assunto.mp3" },
    { titulo: "Aquela Pessoa", artista: "Henrique e Juliano", ano: 2015, arquivo: "/music/HJ---Aquela-Pessoa.mp3" },

    { titulo: "Narcisista", artista: "Maiara e Maraisa", ano: 2024, arquivo: "/music/MM2---Narcisista.mp3" },
    { titulo: "Melhor Terminar", artista: "Maiara e Maraisa", ano: 2024, arquivo: "/music/MM2---Melhor-Terminar.mp3" },
    { titulo: "Saudade do Tipo", artista: "Maiara e Maraisa", ano: 2024, arquivo: "/music/MM2---Saudade-do-Tipo.mp3" },
    { titulo: "Todo Mundo Menos Você", artista: "Maiara e Maraisa", ano: 2024, arquivo: "/music/MM2---Todo-Mundo-Menos-Você.mp3" },
    { titulo: "Medo Bobo", artista: "Maiara e Maraisa", ano: 2024, arquivo: "/music/MM2---Medo-Bobo.mp3" },
    { titulo: "Amando o Inimigo", artista: "Maiara e Maraisa", ano: 2024, arquivo: "/music/MM2---Amando-o-Inimigo.mp3" },
    { titulo: "Surtos", artista: "Maiara e Maraisa", ano: 2024, arquivo: "/music/MM2---Surtos.mp3" },
    { titulo: "Esqueça-me Se For Capaz", artista: "Maiara e Maraisa", ano: 2024, arquivo: "/music/MM2---Esqueça-me-Se-For-Capaz.mp3" },
    { titulo: "Quero do Jeito Que Você Quiser", artista: "Maiara e Maraisa", ano: 2024, arquivo: "/music/MM2---Quero-do-Jeito-Que-Você-Quiser.mp3" },
    { titulo: "Eu Sou Ela", artista: "Maiara e Maraisa", ano: 2024, arquivo: "/music/MM2---Eu-Sou-Ela.mp3" },

    { titulo: "Um Rei", artista: "Ney Matogrosso", ano: 1987, arquivo: "/music/NM---Um-Rei.mp3" },
    { titulo: "Vereda Tropical", artista: "Ney Matogrosso", ano: 1987, arquivo: "/music/NM---Vereda-Tropical.mp3" },
    { titulo: "Tico-Tico No Fubá", artista: "Ney Matogrosso", ano: 1987, arquivo: "/music/NM---Tico-Tico-No-Fubá.mp3" },
    { titulo: "A Cor do Desejo", artista: "Ney Matogrosso", ano: 1987, arquivo: "/music/NM---A-Cor-do-Desejo.mp3" },
    { titulo: "Seu Tipo", artista: "Ney Matogrosso", ano: 1987, arquivo: "/music/NM---Seu-Tipo.mp3" },
    { titulo: "Belíssima", artista: "Ney Matogrosso", ano: 1987, arquivo: "/music/NM---Belíssima.mp3" },
    { titulo: "Sangue Latino", artista: "Ney Matogrosso", ano: 1987, arquivo: "/music/NM---Sangue-Latino.mp3" },
    { titulo: "Samba Rasgado", artista: "Ney Matogrosso", ano: 1987, arquivo: "/music/NM---Samba-Rasgado.mp3" },
    { titulo: "Viajante", artista: "Ney Matogrosso", ano: 1987, arquivo: "/music/NM---Viajante.mp3" },
    { titulo: "Homem Com H", artista: "Ney Matogrosso", ano: 1987, arquivo: "/music/NM---Homem-Com-H.mp3" },

    { titulo: "Amanheceu Peguei a Viola", artista: "Almir Sater", ano: 1990, arquivo: "/music/AS---Amanheceu-Peguei-a-Viola.mp3" },
    { titulo: "Ando Devagar", artista: "Almir Sater", ano: 1990, arquivo: "/music/AS---Ando-Devagar.mp3" },
    { titulo: "Brasil Poeira", artista: "Almir Sater", ano: 1990, arquivo: "/music/AS---Brasil-Poeira.mp3" },
    { titulo: "Boi de Piranha", artista: "Almir Sater", ano: 1990, arquivo: "/music/AS---Boi-de-Piranha.mp3" },
    { titulo: "Boiada", artista: "Almir Sater", ano: 1990, arquivo: "/music/AS---Boiada.mp3" },
    { titulo: "Caminhos Me Levem", artista: "Almir Sater", ano: 1990, arquivo: "/music/AS---Caminhos-Me-Levem.mp3" },
    { titulo: "Cavaleiro da Lua", artista: "Almir Sater", ano: 1990, arquivo: "/music/AS---Cavaleiro-da-Lua.mp3" },
    { titulo: "Corumba", artista: "Almir Sater", ano: 1990, arquivo: "/music/AS---Corumba.mp3" },
    { titulo: "Flor do Amor", artista: "Almir Sater", ano: 1990, arquivo: "/music/AS---Flor-do-Amor.mp3" },
    { titulo: "Lamento Sertanejo", artista: "Almir Sater", ano: 1990, arquivo: "/music/AS---Lamento-Sertanejo.mp3" },
    { titulo: "Luzeiro", artista: "Almir Sater", ano: 1990, arquivo: "/music/AS---Luzeiro.mp3" },
    { titulo: "Minas Gerais", artista: "Almir Sater", ano: 1990, arquivo: "/music/AS---Minas-Gerais.mp3" },
    { titulo: "Peão", artista: "Almir Sater", ano: 1990, arquivo: "/music/AS---Peão.mp3" },
    { titulo: "Rasta Bonito", artista: "Almir Sater", ano: 1990, arquivo: "/music/AS---Rasta-Bonito.mp3" },
    { titulo: "Sabor das Manhãs", artista: "Almir Sater", ano: 1990, arquivo: "/music/AS---Sabor-das-Manhãs.mp3" },
    { titulo: "Trem do Pantanal", artista: "Almir Sater", ano: 1990, arquivo: "/music/AS---Trem-do-Pantanal.mp3" },
    { titulo: "Senhores da Terra", artista: "Almir Sater", ano: 1990, arquivo: "/music/AS---Senhores-da-Terra.mp3" },
    { titulo: "Hora do Clarão", artista: "Almir Sater", ano: 1990, arquivo: "/music/AS---Hora-do-Clarão.mp3" },
    { titulo: "Missões Naturais", artista: "Almir Sater", ano: 1990, arquivo: "/music/AS---Missões-Naturais.mp3" },
    { titulo: "Travessia do Rio Araguaia", artista: "Almir Sater", ano: 1990, arquivo: "/music/AS---Travessia-do-Rio-Araguaia.mp3" }
];

// ===== PLAYER GLOBAL (roda em TODAS as páginas do site) =====
document.addEventListener("DOMContentLoaded", () => {
    const audioPlayer = document.getElementById("audio-player");
    if (!audioPlayer) return; // garante que existe o <audio> na página

    const CHAVE_INDICE = "radio_indiceAtual";
    const CHAVE_TEMPO = "radio_tempoAtual";
    const CHAVE_TOCANDO = "radio_tocando";

    // ----- Sorteia um índice diferente do atual (evita repetir a mesma música em seguida) -----
    function sortearIndice(indiceAtualEvitar){
        if (musicas.length === 1) return 0;
        let novoIndice;
        do {
            novoIndice = Math.floor(Math.random() * musicas.length);
        } while (novoIndice === indiceAtualEvitar);
        return novoIndice;
    }

    // ----- Toca uma música pelo índice, salvando o estado -----
    window.tocarMusicaGlobal = function(indice, tempoInicial = 0){
        const musica = musicas[indice];
        if (!musica) return;

        audioPlayer.src = musica.arquivo;
        audioPlayer.currentTime = tempoInicial;
        audioPlayer.play().catch(() => {
            // Navegadores bloqueiam autoplay com som até o usuário interagir.
            // Isso é tratado mais abaixo, no listener de clique no documento.
        });

        localStorage.setItem(CHAVE_INDICE, indice);
        localStorage.setItem(CHAVE_TOCANDO, "true");

        // Atualiza a interface visual, se existir nesta página (radio.html)
        if (typeof window.atualizarInterfaceRadio === "function"){
            window.atualizarInterfaceRadio(musica, indice);
        }
    };

    // ----- Próxima música aleatória -----
    window.proximaMusicaAleatoria = function(){
        const indiceAtual = parseInt(localStorage.getItem(CHAVE_INDICE)) || 0;
        const novoIndice = sortearIndice(indiceAtual);
        window.tocarMusicaGlobal(novoIndice);
    };

    // ----- Loop infinito: quando a música acaba, sorteia a próxima -----
    audioPlayer.addEventListener("ended", () => {
        window.proximaMusicaAleatoria();
    });

    // ----- Salva o tempo atual periodicamente, para continuar de onde parou ao trocar de página -----
    audioPlayer.addEventListener("timeupdate", () => {
        localStorage.setItem(CHAVE_TEMPO, audioPlayer.currentTime);
    });

    // ----- INICIALIZAÇÃO: retoma de onde parou OU começa nova música aleatória -----
    function iniciarRadio(){
        const indiceSalvo = localStorage.getItem(CHAVE_INDICE);
        const tempoSalvo = parseFloat(localStorage.getItem(CHAVE_TEMPO)) || 0;

        if (indiceSalvo !== null){
            // Já havia uma música tocando: continua de onde parou
            window.tocarMusicaGlobal(parseInt(indiceSalvo), tempoSalvo);
        } else {
            // Primeira vez no site: sorteia a primeira música
            const indiceInicial = Math.floor(Math.random() * musicas.length);
            window.tocarMusicaGlobal(indiceInicial);
        }
    }

    iniciarRadio();

    // ----- Navegadores modernos bloqueiam autoplay com som até haver interação do usuário -----
    // Esse listener garante que, no primeiro clique em QUALQUER lugar do site, a música começa a tocar.
    document.addEventListener("click", function iniciarComInteracao(){
        if (audioPlayer.paused){
            audioPlayer.play().catch(() => {});
        }
        document.removeEventListener("click", iniciarComInteracao);
    }, { once: true });
});