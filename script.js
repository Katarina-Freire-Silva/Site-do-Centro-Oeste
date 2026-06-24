
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

/* ------------------------------ SCRIPT DA HOME -------------------------------*/

const video = document.getElementById("video-home");

if (video) {

    video.addEventListener("loadeddata", () => {
        video.currentTime = 5;
        video.play();
    });

    video.addEventListener("timeupdate", () => {
        if (video.currentTime >= 105) {
            video.currentTime = 5;
        }
    });

    window.addEventListener("scroll", () => {

        const scroll = window.scrollY;
        const scale = 1 + (scroll * 0.0004);

        video.style.transform = `scale(${scale})`;

    });

}

/* ------------------------- SCRIPT DA HOME - HISTÓRIA -------------------------*/

const slidesHistoria = document.querySelectorAll(".historia-slide");
const btnProximo = document.querySelector(".historia-proximo");
const btnAnterior = document.querySelector(".historia-anterior");
const indicadores = document.querySelector(".historia-indicadores");

if(slidesHistoria.length){

    let atual = 0;

    slidesHistoria.forEach((_, index) => {

        const ponto = document.createElement("div");

        ponto.classList.add("historia-ponto");

        if(index === 0){
            ponto.classList.add("ativo");
        }

        ponto.addEventListener("click", () => {
            mostrarSlide(index);
        });

        indicadores.appendChild(ponto);

    });

    const pontos = document.querySelectorAll(".historia-ponto");

    function mostrarSlide(indice){

        slidesHistoria[atual].classList.remove("ativo");
        pontos[atual].classList.remove("ativo");

        atual = indice;

        slidesHistoria[atual].classList.add("ativo");
        pontos[atual].classList.add("ativo");

    }

    btnProximo.addEventListener("click", () => {

        let proximo = atual + 1;

        if(proximo >= slidesHistoria.length){
            proximo = 0;
        }

        mostrarSlide(proximo);

    });

    btnAnterior.addEventListener("click", () => {

        let anterior = atual - 1;

        if(anterior < 0){
            anterior = slidesHistoria.length - 1;
        }

        mostrarSlide(anterior);

    });

}

/* ---------------------------- SCRIPT DO TURISMO -----------------------------*/

let localUsuario = null;

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

            let textoPopup = titulo;

            if(localUsuario){

                const distancia = calcularDistancia(
                    localUsuario.lat,
                    localUsuario.lng,
                    lat,
                    lng
                );

                textoPopup = `
                    <strong>${titulo}</strong><br>
                    Distância da sua região:<br>
                    ${distancia.toFixed(0)} km
                `;
            }

            irParaLocal(lat, lng, zoom, textoPopup);

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
            localUsuario = {
                lat,
                lng,
                nome: data[0].display_name
            };

            irParaLocal(lat, lng, 13, data[0].display_name);

            function calcularDistancia(lat1, lon1, lat2, lon2) {

                const R = 6371;

                const dLat = (lat2 - lat1) * Math.PI / 180;
                const dLon = (lon2 - lon1) * Math.PI / 180;

                const a =
                    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                    Math.cos(lat1 * Math.PI / 180) *
                    Math.cos(lat2 * Math.PI / 180) *
                    Math.sin(dLon / 2) *
                    Math.sin(dLon / 2);

                const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

                return R * c;
            }

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

const grid = document.querySelector(".destinos-grid");
const btnProximoDestino = document.querySelector(".destino-proximo");
const btnAnteriorDestino = document.querySelector(".destino-anterior");

if (grid && btnProximoDestino && btnAnteriorDestino) {

    btnProximoDestino.onclick = () => {
        grid.scrollBy({
            left: 340,
            behavior: "smooth"
        });
    };

    btnAnteriorDestino.onclick = () => {
        grid.scrollBy({
            left: -340,
            behavior: "smooth"
        });
    };

}

/* ---------------- HOSPEDAGEM INTERATIVA ---------------- */

document.addEventListener("DOMContentLoaded", () => {

    const imagens = {
        DF: document.getElementById("imagemDF"),
        GO: document.getElementById("imagemGO"),
        MT: document.getElementById("imagemMT"),
        MS: document.getElementById("imagemMS")
    };

    const cardsHotel = document.querySelectorAll(".hotel-card");

    cardsHotel.forEach(card => {

        card.addEventListener("click", () => {

            const estadoContainer = card.closest(".estado-hospedagem");
            const estado = estadoContainer.dataset.estado;

            const imagem = imagens[estado];

            /* -------- ACORDEÃO -------- */

            const estavaAberto = card.classList.contains("aberto");

            estadoContainer
                .querySelectorAll(".hotel-card")
                .forEach(c => c.classList.remove("aberto"));

            if (!estavaAberto) {
                card.classList.add("aberto");
                setTimeout(() => {
                    card.scrollIntoView({
                        behavior: "smooth",
                        block: "nearest"
                    });
                }, 200);
            }

            /* -------- TROCA DE IMAGEM -------- */

            if (!imagem) return;

            estadoContainer
                .querySelectorAll(".hotel-card")
                .forEach(c => c.classList.remove("ativo"));

            card.classList.add("ativo");

            imagem.style.opacity = "0";

            setTimeout(() => {

                imagem.src = card.dataset.img;

                imagem.style.opacity = "1";

            }, 250);

        });
    });

});

/* ---------------- VER MAIS DESTINOS ---------------- */

document.addEventListener("DOMContentLoaded", () => {

    const btnVerMais = document.getElementById("btnVerMais");
    const destinosGrid = document.querySelector(".destinos-grid");
    const destinosContainer = document.querySelector(".destinos-container");

    if (!btnVerMais || !destinosGrid || !destinosContainer) return;

    let expandido = false;

    btnVerMais.addEventListener("click", () => {

        expandido = !expandido;

        destinosGrid.classList.toggle("expandido");
        destinosContainer.classList.toggle("expandido");

        btnVerMais.textContent = expandido
            ? "Ver menos destinos"
            : "Ver mais destinos";

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
    { titulo: "Coração Está em Pedaços", artista: "Zezé Di Camargo & Luciano", ano: 1991, arquivo: "../music/ZL---Coração-Está-em-Pedaços.mp3" },
    { titulo: "Dois Corações e uma História", artista: "Zezé Di Camargo & Luciano", ano: 1991, arquivo: "../music/ZL---Dois-Corações-e-uma-História.mp3" },
    { titulo: "Pra Não Pensar em Você", artista: "Zezé Di Camargo & Luciano", ano: 1991, arquivo: "../music/ZL---Pra-Não-Pensar-em-Você.mp3" },
    { titulo: "Pra Mudar a Minha Vida", artista: "Zezé Di Camargo & Luciano", ano: 1991, arquivo: "../music/ZL---Pra-Mudar-a-Minha-Vida.mp3" },
    { titulo: "Preciso Ser Amado", artista: "Zezé Di Camargo & Luciano", ano: 1991, arquivo: "../music/ZL---Preciso-Ser-Amado.mp3" },
    { titulo: "Saudade Bandida", artista: "Zezé Di Camargo & Luciano", ano: 1991, arquivo: "../music/ZL---Saudade-Bandida.mp3" },
    { titulo: "Você Vai Ver", artista: "Zezé Di Camargo & Luciano", ano: 1991, arquivo: "../music/ZL---Você-Vai-Ver.mp3" },
    { titulo: "Cada Volta é um Recomeço", artista: "Zezé Di Camargo & Luciano", ano: 1991, arquivo: "../music/ZL---Cada-Volta-é-um-Recomeço.mp3" },
    { titulo: "Irmão da Lua Amigo das Estrelas", artista: "Zezé Di Camargo & Luciano", ano: 1991, arquivo: "../music/ZL---Irmão-da-Lua-Amigo-das-Estrelas.mp3" },
    { titulo: "Antes de Voltar Pra Casa", artista: "Zezé Di Camargo & Luciano", ano: 1991, arquivo: "../music/ZL---Antes-de-Voltar-Pra-Casa.mp3" },

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
    { titulo: "É Por Você Que Canto", artista: "Leandro e Leonardo", ano: 1990, arquivo: "../music/LL---É-Por-Você-Que-Canto.mp3" },
    { titulo: "Entre Tapas e Beijos", artista: "Leandro e Leonardo", ano: 1990, arquivo: "../music/LL---Entre-Tapas-e-Beijos.mp3" },
    { titulo: "Talismã", artista: "Leandro e Leonardo", ano: 1990, arquivo: "../music/LL---Talismã.mp3" },
    { titulo: "Sonho Por Sonho", artista: "Leandro e Leonardo", ano: 1990, arquivo: "../music/LL---Sonho-Por-Sonho.mp3" },
    { titulo: "Não Aprendi a Dizer Adeus", artista: "Leandro e Leonardo", ano: 1990, arquivo: "../music/LL---Não-Aprendia-Dizer-Adeus.mp3" },
    { titulo: "Não Olhe Assim", artista: "Leandro e Leonardo", ano: 1990, arquivo: "../music/LL---Não-Olhe-Assim.mp3" },
    { titulo: "Paz Na Cama", artista: "Leandro e Leonardo", ano: 1990, arquivo: "../music/LL---Paz-Na-Cama.mp3" },
    { titulo: "O Que Eu Sinto é Amor", artista: "Leandro e Leonardo", ano: 1990, arquivo: "../music/LL---O Que-Eu-Sinto-é-Amor.mp3" },
    { titulo: "Temporal de Amor", artista: "Leandro e Leonardo", ano: 1990, arquivo: "../music/LL---Temporal-de-Amor.mp3" },
    { titulo: "Dor de Amor Não Tem Jeito", artista: "Leandro e Leonardo", ano: 1990, arquivo: "../music/LL---Dor-de-Amor-Não-Tem-Jeito.mp3" },


    { titulo: "Logo Eu", artista: "Jorge e Mateus", ano: 2021, arquivo: "../music/JM---Logo-Eu.mp3" },
    { titulo: "Molhando o Volante", artista: "Jorge e Mateus", ano: 2021, arquivo: "../music/JM---Molhando-o-Volante.mp3" },
    { titulo: "Troca", artista: "Jorge e Mateus", ano: 2021, arquivo: "../music/JM---Troca.mp3" },
    { titulo: "Duas Metades", artista: "Jorge e Mateus", ano: 2012, arquivo: "../music/JM---Duas-Metades.mp3" },
    { titulo: "Tem Que Sorrir", artista: "Jorge e Mateus", ano: 2021, arquivo: "../music/JM---Tem-Que-Sorrir.mp3" },
    { titulo: "Namorando Com Saudade", artista: "Jorge e Mateus", ano: 2021, arquivo: "../music/JM---Namorando-Com-Saudade.mp3" },
    { titulo: "Paradigmas", artista: "Jorge e Mateus", ano: 2021, arquivo: "../music/JM---Paradigmas.mp3" },
    { titulo: "Namora Eu Aí", artista: "Jorge e Mateus", ano: 2021, arquivo: "../music/JM---Namora-Eu-Aí.mp3" },
    { titulo: "A Gente Nem Ficou", artista: "Jorge e Mateus", ano: 2012, arquivo: "../music/JM---A-Gente-Nem-Ficou.mp3" },
    { titulo: "Louca de Saudade", artista: "Jorge e Mateus", ano: 2016, arquivo: "../music/JM---Louca-de-Saudade.mp3" },
    { titulo: "De Tanto Te Querer", artista: "Jorge e Mateus", ano: 2016, arquivo: "../music/JM---De-Tanto-Te-Querer.mp3" },
    { titulo: "Seu Astral", artista: "Jorge e Mateus", ano: 2016, arquivo: "../music/JM---Seu-Astral.mp3" },
    { titulo: "Se Eu Pedir Se Volta", artista: "Jorge e Mateus", ano: 2016, arquivo: "../music/JM---Se-Eu-Pedir-Se-Volta.mp3" },
    { titulo: "Pirraça", artista: "Jorge e Mateus", ano: 2016, arquivo: "../music/JM---Pirraça.mp3" },
    { titulo: "Vestígios", artista: "Jorge e Mateus", ano: 2016, arquivo: "../music/JM---Vestígios.mp3" },
    { titulo: "Um Dia Te Levo Comigo", artista: "Jorge e Mateus", ano: 2016, arquivo: "../music/JM---Um-Dia-Te-Levo-Comigo.mp3" },
    { titulo: "Pode Chorar", artista: "Jorge e Mateus", ano: 2016, arquivo: "../music/JM---Pode-Chorar.mp3" },
    { titulo: "Tempo a Tempo", artista: "Jorge e Mateus", ano: 2016, arquivo: "../music/JM---Tempo-a-Tempo.mp3" },
    { titulo: "Amo Noite e Dia", artista: "Jorge e Mateus", ano: 2016, arquivo: "../music/JM---Amo-Noite-e-Dia.mp3" },
    { titulo: "Se Eu Chorar", artista: "Jorge e Mateus", ano: 2016, arquivo: "../music/JM---Se-Eu-Chorar.mp3" },


    { titulo: "Te Amo Demais", artista: "Marília Mendonça", ano: 2023, arquivo: "../music/MM---Te-amo-Demais.mp3" },
    { titulo: "Leão", artista: "Marília Mendonça", ano: 2023, arquivo: "../music/MM---Leão.mp3" },
    { titulo: "Me Ame Mais", artista: "Marília Mendonça", ano: 2023, arquivo: "../music/MM---Me-Ame-Mais.mp3" },
    { titulo: "Hackearam-me", artista: "Marília Mendonça", ano: 2023, arquivo: "../music/MM---Hackearam-me.mp3" },
    { titulo: "Não Era Pra Ser Assim", artista: "Marília Mendonça", ano: 2023, arquivo: "../music/MM---Não-Era-Pra-Ser-Assim.mp3" },
    { titulo: "Pra Falar a Verdade", artista: "Marília Mendonça", ano: 2023, arquivo: "../music/MM---Pra-Falar-a-Verdade.mp3" },
    { titulo: "Café da Manhã", artista: "Marília Mendonça", ano: 2022, arquivo: "../music/MM---Café-da-Manhã.mp3" },
    { titulo: "Morango do Nordeste", artista: "Marília Mendonça", ano: 2023, arquivo: "../music/MM---Morango-do-Nordeste.mp3" },
    { titulo: "O Que Falta Em Você Sou Eu", artista: "Marília Mendonça", ano: 2023, arquivo: "../music/MM---O-Que-Falta-Em-Você-Sou-Eu.mp3" },
    { titulo: "Troca de Calçada", artista: "Marília Mendonça", ano: 2023, arquivo: "../music/MM---Troca-de-Calçada.mp3" },
    { titulo: "Essas Nossas Brigas", artista: "Marília Mendonça", ano: 2023, arquivo: "../music/MM---Essas-Nossas-Brigas.mp3" },
    { titulo: "Entre Quatro Paredes", artista: "Marília Mendonça", ano: 2023, arquivo: "../music/MM---Entre-Quatro-Paredes.mp3" },
    { titulo: "Quatro e Quinze", artista: "Marília Mendonça", ano: 2023, arquivo: "../music/MM---Quatro-e-Quinze.mp3" },
    { titulo: "Esse Cara Aqui Do Lado", artista: "Marília Mendonça", ano: 2023, arquivo: "../music/MM---Esse-Cara-Aqui-Do-Lado.mp3" },
    { titulo: "Me Desculpe Mas Eu Sou Fiel", artista: "Marília Mendonça", ano: 2023, arquivo: "../music/MM---Me-Desculpe-Mas-Eu-Sou-Fiel.mp3" },
    { titulo: "Sentimento Louco", artista: "Marília Mendonça", ano: 2023, arquivo: "../music/MM---Sentimento-Louco.mp3" },
    { titulo: "O Que é AMor Pra Você", artista: "Marília Mendonça", ano: 2023, arquivo: "../music/MM---O-Que-é-AMor-Pra-Você.mp3" },
    { titulo: "Silêncio", artista: "Marília Mendonça", ano: 2023, arquivo: "../music/MM---Silêncio.mp3" },
    { titulo: "Infiel", artista: "Marília Mendonça", ano: 2023, arquivo: "../music/MM---Infiel.mp3" },
    { titulo: "Bem Pior Que Eu", artista: "Marília Mendonça", ano: 2023, arquivo: "../music/MM---Bem-Pior-Que-Eu.mp3" },
    { titulo: "Bebi Liguei", artista: "Marília Mendonça", ano: 2023, arquivo: "../music/MM---Bebi-Liguei.mp3" },
    { titulo: "Você Não é Mais Assim", artista: "Marília Mendonça", ano: 2023, arquivo: "../music/MM---Você-Não-é-Mais-Assim.mp3" },
    { titulo: "Bebaça", artista: "Marília Mendonça", ano: 2023, arquivo: "../music/MM---Bebaça.mp3" },
    { titulo: "Muito Estranho", artista: "Marília Mendonça", ano: 2023, arquivo: "../music/MM---Muito-Estranho.mp3" },
    { titulo: "Todo Mundo Vai Sofrer", artista: "Marília Mendonça", ano: 2023, arquivo: "../music/MM---Todo-Mundo-Vai-Sofrer.mp3" },
    { titulo: "Eu Sei De Cor", artista: "Marília Mendonça", ano: 2023, arquivo: "../music/MM---Eu-Sei-De-Cor.mp3" },
    { titulo: "Supera", artista: "Marília Mendonça", ano: 2023, arquivo: "../music/MM---Supera.mp3" },
    { titulo: "Graveto", artista: "Marília Mendonça", ano: 2023, arquivo: "../music/MM---Graveto.mp3" },
    { titulo: "Ciumeira", artista: "Marília Mendonça", ano: 2023, arquivo: "../music/MM---Ciumeira.mp3" },
    { titulo: "Sem sal", artista: "Marília Mendonça", ano: 2023, arquivo: "../music/MM---Sem-Sal.mp3" },


    { titulo: "Flor E O Beija-Flor", artista: "Henrique e Juliano", ano: 2016, arquivo: "../music/HJ---Flor-E-O-Beija-Flor.mp3" },
    { titulo: "Garçon Fecha o bar", artista: "Henrique e Juliano", ano: 2014, arquivo: "../music/HJ---Garçon-Fecha-o-bar.mp3" },
    { titulo: "Na Hora Da Raiva", artista: "Henrique e Juliano", ano: 2017, arquivo: "../music/HJ---Na-Hora-Da-Raiva.mp3" },
    { titulo: "Não To Valendo Nada", artista: "Henrique e Juliano", ano: 2014, arquivo: "../music/HJ---Não-To-Valendo-Nada.mp3" },
    { titulo: "Cuida Bem Dela", artista: "Henrique e Juliano", ano: 2014, arquivo: "../music/HJ---Cuida-Bem-Dela.mp3" },
    { titulo: "Até Você Voltar", artista: "Henrique e Juliano", ano: 2014, arquivo: "../music/HJ---Até-Você-Voltar.mp3" },
    { titulo: "As vezes", artista: "Henrique e Juliano", ano: 2015, arquivo: "../music/HJ---As-vezes.mp3" },
    { titulo: "Recaídas", artista: "Henrique e Juliano", ano: 2013, arquivo: "../music/HJ---Recaídas.mp3" },
    { titulo: "Mudando De Assunto", artista: "Henrique e Juliano", ano: 2015, arquivo: "../music/HJ---Mudando-De-Assunto.mp3" },
    { titulo: "Aquela Pessoa", artista: "Henrique e Juliano", ano: 2017, arquivo: "../music/HJ---Aquela-Pessoa.mp3" },
    { titulo: "Cê Me Conhece Eu Me Conheço", artista: "Henrique e Juliano", ano: 2017, arquivo: "../music/HJ---Cê-Me-Conhece-Eu-Me-Conheço.mp3" },
    { titulo: "Vai Com Calma", artista: "Henrique e Juliano", ano: 2017, arquivo: "../music/HJ---Vai-Com-Calma.mp3" },
    { titulo: "Ainda Voltava", artista: "Henrique e Juliano", ano: 2017, arquivo: "../music/HJ---Ainda-Voltava.mp3" },
    { titulo: "Romântico", artista: "Henrique e Juliano", ano: 2017, arquivo: "../music/HJ---Romântico.mp3" },
    { titulo: "Última Saudade", artista: "Henrique e Juliano", ano: 2017, arquivo: "../music/HJ---Última-Saudade.mp3" },
    { titulo: "Seja Ex", artista: "Henrique e Juliano", ano: 2017, arquivo: "../music/HJ---Seja-Ex.mp3" },
    { titulo: "Alguma Coisa", artista: "Henrique e Juliano", ano: 2017, arquivo: "../music/HJ---Alguma-Coisa.mp3" },
    { titulo: "Meia Metade", artista: "Henrique e Juliano", ano: 2017, arquivo: "../music/HJ---Meia-Metade.mp3" },
    { titulo: "Arranhão", artista: "Henrique e Juliano", ano: 2017, arquivo: "../music/HJ---Arranhão.mp3" },
    { titulo: "Liberdade Provisória", artista: "Henrique e Juliano", ano: 2017, arquivo: "../music/HJ---Liberdade-Provisória.mp3" },


    { titulo: "Narcisista", artista: "Maiara e Maraisa", ano: 2023, arquivo: "../music/MM---Narcisista.mp3" },
    { titulo: "Melhor Terminar", artista: "Maiara e Maraisa", ano: 2023, arquivo: "../music/MM---Melhor-Terminar.mp3" },
    { titulo: "Saudade do Tipo", artista: "Maiara e Maraisa", ano: 2023, arquivo: "../music/MM---Saudade-do-Tipo.mp3" },
    { titulo: "Todo Mundo Menos Você", artista: "Maiara e Maraisa", ano: 2022, arquivo: "../music/MM---Todo-Mundo-Menos-Você.mp3" },
    { titulo: "Medo Bobo", artista: "Maiara e Maraisa", ano: 2015, arquivo: "../music/MM---Medo-Bobo.mp3" },
    { titulo: "Amando o Inimigo", artista: "Maiara e Maraisa", ano: 2023, arquivo: "../music/MM---Amando-o-Inimigo.mp3" },
    { titulo: "Surtos", artista: "Maiara e Maraisa", ano: 2023, arquivo: "../music/MM---Surtos.mp3" },
    { titulo: "Esqueça-me Se For Capaz", artista: "Maiara e Maraisa", ano: 2023, arquivo: "../music/MM---Esqueça-me-Se-For-Capaz.mp3" },
    { titulo: "Quero do Jeito Que Você Quiser", artista: "Maiara e Maraisa", ano: 2016, arquivo: "../music/MM---Quero-do-Jeito-Que-Você-Quiser.mp3" },
    { titulo: "Eu Sou Ela", artista: "Maiara e Maraisa", ano: 2018, arquivo: "../music/MM---Eu-Sou-Ela.mp3" },

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

    const disco = document.getElementById("disco");


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
        infoArtista.textContent = `- ${musica.artista}`;
        infoAno.textContent = `(${musica.ano})`;

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
    const CURRENT_API_KEY = "PtGMTJafHOvx3hGnKpM58Cr7aPODb0P1VPH4vw_HA1svii7H";

    // Termos de busca por estado/região
    const termosBusca = {

        "centro-oeste": "Centro-Oeste", 

        "df": "Brasília",

        "go": "Goiás", 

        "mt": "Mato Grosso", 

        "ms": "Mato Grosso do Sul", 

        "politica": "governo", 

        "economia": "economia", 

        "meioAmbiente": "Cerrado", 

        "agropecuaria": "agronegócio", 

    };
    async function buscarNoticias(estado = "centro-oeste") {
        loading.style.display = "block";
        erro.style.display = "none";
        grid.innerHTML = "";

        const query = encodeURIComponent(termosBusca[estado]);
        const url = `https://api.currentsapi.services/v1/search?keywords=${query}&language=pt&apiKey=${CURRENT_API_KEY}`;
        console.log("URL FINAL:");
        console.log(url);


        try {
            const response = await fetch(url);

            if (!response.ok) {
                const erroApi = await response.json();
            
                console.error("ERRO GNEWS:", erroApi);
            
                erro.textContent =
                    erroApi.errors?.[0] ||
                    "Erro ao carregar notícias.";
            
                erro.style.display = "block";
                loading.style.display = "none";
            
                return;
            }

            const data = await response.json();
            let noticiasFiltradas = data.news;

            loading.style.display = "none";

            if (!noticiasFiltradas || noticiasFiltradas.length === 0) {
                erro.textContent = "Nenhuma notícia encontrada para essa região no momento.";
                erro.style.display = "block";
                return;
            }

            noticiasFiltradas = filtrarNoticias(
                data.news,
                estado
            );

            renderizarNoticias(noticiasFiltradas);
            
        } catch (error) {
            console.error("Erro ao buscar notícias:", error);
            loading.style.display = "none";
            erro.textContent = "Não foi possível carregar as notícias no momento.";
            erro.style.display = "block";
        }
    }

    function filtrarNoticias(artigos, estado) {

        const filtros = {

            "df": [
                "brasília",
                "brasilia",
                "distrito federal",
                "taguatinga",
                "ceilândia",
                "ceilandia",
                "samambaia",
                "planaltina",
                "gama",
                "sobradinho",
                "paranoá",
                "paranoa",
                "recanto das emas",
                "riacho fundo",
                "guará",
                "guara",
                "núcleo bandeirante",
                "nucleo bandeirante",
                "cruzeiro",
                "lago sul",
                "lago norte",
                "santa maria",
                "são sebastião",
                "sao sebastiao",
                "brazlândia",
                "brazlandia",
                "itapoã",
                "itapoa",
                "jardim botânico",
                "jardim botanico",
                "estrutural",
                "candangolândia",
                "candangolandia"
            ],

            "go": [
                "goiás",
                "goias",
                "goiânia",
                "goiania",
                "anápolis",
                "anapolis",
                "rio verde",
                "aparecida de goiânia",
                "aparecida de goiania",
                "águas lindas",
                "aguas lindas",
                "luziânia",
                "luziania",
                "valparaíso",
                "valparaiso",
                "senador canedo",
                "trindade",
                "catalão",
                "catalao",
                "jataí",
                "jatai",
                "itumbiara",
                "formosa",
                "mineiros",
                "goianésia",
                "goianesia",
                "cristalina",
                "porangatu",
                "ipameri",
                "quirinópolis",
                "quirinopolis",
                "jaraguá",
                "jaragua",
                "morrinhos",
                "caldas novas"
            ],

            "mt": [
                "mato grosso",
                "cuiabá",
                "cuiaba",
                "várzea grande",
                "varzea grande",
                "rondonópolis",
                "rondonopolis",
                "sinop",
                "sorriso",
                "tangará da serra",
                "tangara da serra",
                "primavera do leste",
                "lucas do rio verde",
                "cáceres",
                "caceres",
                "barra do garças",
                "alta floresta",
                "juína",
                "juina",
                "colíder",
                "colider",
                "diamantino",
                "campo verde",
                "pontes e lacerda",
                "nova mutum",
                "peixoto de azevedo",
                "guarantã do norte",
                "guaranta do norte",
                "aripuanã",
                "aripuana"
            ],

            "ms": [
                "mato grosso do sul",
                "ms",
                "campo grande",
                "dourados",
                "três lagoas",
                "tres lagoas",
                "corumbá",
                "corumba",
                "ponta porã",
                "ponta pora",
                "naviraí",
                "navirai",
                "nova andradina",
                "sidrolândia",
                "sidrolandia",
                "aquidauana",
                "maracaju",
                "bonito",
                "coxim",
                "paranaíba",
                "paranaiba",
                "jardim",
                "mundo novo",
                "chapadão do sul",
                "chapadao do sul",
                "cassilândia",
                "cassilandia",
                "governo de ms"
            ],

            "politica": [
                "política",
                "governo",
                "governador",
                "vice-governador",
                "prefeito",
                "prefeitura",
                "câmara",
                "câmara municipal",
                "assembleia",
                "assembleia legislativa",
                "deputado",
                "deputada",
                "senador",
                "senadora",
                "senado",
                "vereador",
                "vereadora",
                "eleição",
                "eleitoral",
                "partido",
                "congresso",
                "ministério",
                "gestão pública",
                "licitação",
                "licitações",
                "orçamento",
                "orçamento público",
                "secretaria",
                "secretário",
                "secretária",
                "administração pública",
                "tribunal regional eleitoral",
                "TRE",
                "campanha eleitoral",
                "votação",
                "mandato",
                "plenário",
                "projeto de lei",
                "reforma administrativa"
            ],

            "economia": [
                "economia",
                "mercado",
                "emprego",
                "investimento",
                "investimentos",
                "negócio",
                "negócios",
                "empresa",
                "empresas",
                "comércio",
                "varejo",
                "indústria",
                "industrial",
                "exportação",
                "importação",
                "inflação",
                "juros",
                "banco",
                "crédito",
                "finanças",
                "financeiro",
                "empreendedor",
                "empreendedorismo",
                "startup",
                "microempresa",
                "MEI",
                "agronegócio",
                "PIB",
                "arrecadação",
                "tributação",
                "tributo",
                "imposto",
                "receita",
                "bolsa",
                "mercado financeiro",
                "desemprego",
                "renda",
                "salário",
                "salario",
                "franquia",
                "investidor"
            ],

            "meioAmbiente": [
                "pantanal",
                "cerrado",
                "amazônia",
                "amazonia",
                "meio ambiente",
                "ambiental",
                "clima",
                "mudanças climáticas",
                "aquecimento global",
                "biodiversidade",
                "fauna",
                "flora",
                "preservação",
                "conservação",
                "queimada",
                "incêndio florestal",
                "incendio florestal",
                "desmatamento",
                "sustentabilidade",
                "poluição",
                "rio",
                "nascente",
                "seca",
                "estiagem",
                "chuva",
                "temperatura",
                "unidade de conservação",
                "reserva ambiental",
                "parque nacional",
                "parque estadual",
                "recurso hídrico",
                "recurso hidrico",
                "crise hídrica",
                "crise hidrica",
                "ecologia",
                "animal silvestre",
                "espécie ameaçada",
                "especie ameacada"
            ],

            "agropecuaria": [
                "agronegócio",
                "agronegocio",
                "agro",
                "agricultura",
                "pecuária",
                "pecuaria",
                "pecuarista",
                "gado",
                "boi",
                "bovino",
                "soja",
                "milho",
                "algodão",
                "algodao",
                "safra",
                "colheita",
                "produtor rural",
                "fazenda",
                "frigorífico",
                "frigorifico",
                "exportação",
                "cooperativa",
                "plantio",
                "rebanho",
                "avicultura",
                "suinocultura",
                "cana-de-açúcar",
                "cana de açucar",
                "fertilizante",
                "insumo agrícola",
                "insumo agricola",
                "armazenagem",
                "logística agrícola",
                "logistica agricola",
                "confinamento",
                "arroba do boi",
                "agroindústria",
                "agroindustria",
                "produtividade rural",
                "colheita recorde"
            ]
        };

        if (!filtros[estado]) {
            return artigos;
        }

        return artigos.filter(artigo => {

            const texto = `
                ${artigo.title || ""}
                ${artigo.description || ""}
                ${(artigo.category || []).join(" ")}
            `.toLowerCase();

            return filtros[estado].some(
                palavra => texto.includes(palavra.toLowerCase())
            );

        });
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

            const dataFormatada = formatarData(artigo.published);

            card.innerHTML = `
                <img src="${artigo.image || ''}" alt="${artigo.title}" onerror="this.style.display='none'">
                <div class="noticia-conteudo">
                    <span class="noticia-fonte">${artigo.author || "Fonte desconhecida"}</span>
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