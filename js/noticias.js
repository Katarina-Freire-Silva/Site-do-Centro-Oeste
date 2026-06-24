/* ---------------------------- SCRIPT DAS NOTÍCIAS ---------------------------*/

document.addEventListener("DOMContentLoaded", () => {
    const grid = document.getElementById("noticias-grid");
    if (!grid) return; // só roda na página de notícias

    const loading = document.getElementById("noticias-loading");
    const erro = document.getElementById("noticias-erro");
    const botoesFiltro = document.querySelectorAll(".filtro-estado");
    let paginaAtual = 0;
    let noticiasAtuais = [];

    const NOTICIAS_POR_PAGINA = 10;



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

    function renderizarNoticias(artigos){

        noticiasAtuais = artigos;
        paginaAtual = 0;

        renderizarPagina();
    }

    function renderizarPagina(){

        grid.innerHTML = "";

        const inicio =
            paginaAtual * NOTICIAS_POR_PAGINA;

        const fim =
            inicio + NOTICIAS_POR_PAGINA;

        const noticiasPagina =
            noticiasAtuais.slice(inicio, fim);

        noticiasPagina.forEach((artigo) => {

            const card = document.createElement("a");

            card.classList.add("noticia-card");

            card.href = artigo.url;
            card.target = "_blank";
            card.rel = "noopener noreferrer";

            card.style.textDecoration = "none";
            card.style.color = "inherit";

            const dataFormatada =
                formatarData(artigo.published);

            card.innerHTML = `
                <img
                    src="${artigo.image || ''}"
                    alt="${artigo.title}"
                    onerror="this.style.display='none'">

                <div class="noticia-conteudo">

                    <span class="noticia-fonte">
                        ${artigo.author || "Fonte desconhecida"}
                    </span>

                    <h3 class="noticia-titulo">
                        ${artigo.title}
                    </h3>

                    <p class="noticia-resumo">
                        ${artigo.description || ""}
                    </p>

                    <span class="noticia-data">
                        ${dataFormatada}
                    </span>

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

    const btnApiAnterior =
    document.querySelector(".api-anterior");

    const btnApiProximo =
        document.querySelector(".api-proximo");

    if(btnApiAnterior && btnApiProximo){

        btnApiProximo.addEventListener("click", () => {

            const totalPaginas =
                Math.ceil(
                    noticiasAtuais.length /
                    NOTICIAS_POR_PAGINA
                );

            paginaAtual++;

            if(paginaAtual >= totalPaginas){
                paginaAtual = 0;
            }

            renderizarPagina();
        });

        btnApiAnterior.addEventListener("click", () => {

            const totalPaginas =
                Math.ceil(
                    noticiasAtuais.length /
                    NOTICIAS_POR_PAGINA
                );

            paginaAtual--;

            if(paginaAtual < 0){
                paginaAtual = totalPaginas - 1;
            }

            renderizarPagina();
        });

    }

    // ----- Carrega notícias da região inteira ao abrir a página -----
    buscarNoticias("centro-oeste");
    carregarClima("Goiás", "Goiânia", -16.679915550000000, -49.255011680000000, "clima-goiania");
    carregarClima("Mato Grosso", "Cuiabá", -15.599227400000000, -56.095052600000000, "clima-cuiaba");
    carregarClima("Mato Grosso do Sul", "Campo Grande", -20.442813945200000, -54.646345672800000, "clima-campo-grande");
});

/* ---------------------- SLIDER REPORTAGENS ---------------------- */

const cardsJornal = document.querySelectorAll(".noticia-jornal-card");

const btnAnteriorJornal = document.querySelector(
    ".slider-noticias-jornal .historia-anterior"
);

const btnProximoJornal = document.querySelector(
    ".slider-noticias-jornal .historia-proximo"
);

const indicadoresJornal = document.querySelector(
    ".slider-noticias-jornal .historia-indicadores"
);

if (cardsJornal.length > 0) {

    let atualJornal = 0;

    cardsJornal.forEach((_, index) => {

        const ponto = document.createElement("div");

        ponto.classList.add("historia-ponto");

        if(index === 0){
            ponto.classList.add("ativo");
        }

        ponto.addEventListener("click", () => {
            mostrarNoticia(index);
        });

        indicadoresJornal.appendChild(ponto);

    });

    const pontosJornal =
        indicadoresJornal.querySelectorAll(".historia-ponto");

    function mostrarNoticia(indice){

        cardsJornal[atualJornal].classList.remove("ativo");
        pontosJornal[atualJornal].classList.remove("ativo");

        atualJornal = indice;

        cardsJornal[atualJornal].classList.add("ativo");
        pontosJornal[atualJornal].classList.add("ativo");

    }

    btnProximoJornal.addEventListener("click", () => {

        let proximo = atualJornal + 1;

        if(proximo >= cardsJornal.length){
            proximo = 0;
        }

        mostrarNoticia(proximo);

    });

    btnAnteriorJornal.addEventListener("click", () => {

        let anterior = atualJornal - 1;

        if(anterior < 0){
            anterior = cardsJornal.length - 1;
        }

        mostrarNoticia(anterior);

    });

}

/* ---------------------------- SCRIPT DO CLIMA ---------------------------*/

function obterEmojiClima(codigo) {
    if (codigo === 0) return "☀️";
    if ([1, 2, 3].includes(codigo)) return "⛅";
    if ([45, 48].includes(codigo)) return "🌫️";
    if ([51, 53, 55, 56, 57].includes(codigo)) return "🌦️";
    if ([61, 63, 65, 66, 67].includes(codigo)) return "🌧️";
    if ([71, 73, 75, 77].includes(codigo)) return "❄️";
    if ([80, 81, 82].includes(codigo)) return "🌦️";
    if ([95, 96, 99].includes(codigo)) return "⛈️";
    return "🌤️";
}

async function carregarClima(estado, cidade, lat, lon, elementoId) {
    try {
        const resposta = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=America/Sao_Paulo`
        );

        const dados = await resposta.json();

        const emojiAtual = obterEmojiClima(dados.current.weather_code);

        const diasSemana = ["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"];

        let previsaoHTML = "";

        for (let i = 1; i <= 3; i++) {
            const data = new Date(dados.daily.time[i] + "T12:00:00");
            const diaSemana = diasSemana[data.getDay()];
            const emojiDia = obterEmojiClima(dados.daily.weather_code[i]);

            previsaoHTML += `
                <div class="dia-previsao">
                    <span>${diaSemana}</span>
                    <span>${emojiDia}</span>
                    <span>↑ ${dados.daily.temperature_2m_max[i]}°</span>
                    <span>↓ ${dados.daily.temperature_2m_min[i]}°</span>
                </div>
            `;
        }

        document.getElementById(elementoId).innerHTML = `
            <h3>${estado}</h3>
            <h4>${cidade}</h4>

            <div class="temperatura-atual">
                ${emojiAtual} ${dados.current.temperature_2m}°
            </div>

            <div class="info-adicional-clima">
                <p>💧 ${dados.current.relative_humidity_2m}%</p>
                <p>💨 ${dados.current.wind_speed_10m} km/h</p>
            </div>

            <div class="linha"></div>

            <div class="previsao-3-dias">
                ${previsaoHTML}
            </div>
        `;
    } catch (error) {
        console.error("Erro clima:", error);
    }
}

/* ---------------------------- SCRIPT DA MOEDA ---------------------------*/

async function carregarCotacoes() {
    try {
        const resposta = await fetch(
            "https://economia.awesomeapi.com.br/json/last/USD-BRL,EUR-BRL,GBP-BRL"
        );

        const dados = await resposta.json();

        document.getElementById("dolar").innerHTML = `
            <span class="moeda">$</span>
            <p class="subtitulo-card">Dólar</p>
            <p class="cotacao-valor">R$ ${Number(dados.USDBRL.bid).toFixed(2)}</p>
        `

        document.getElementById("euro").innerHTML = `
            <span class="moeda">€</span>
            <p class="subtitulo-card">Euro</p>
            <p class="cotacao-valor">R$ ${Number(dados.EURBRL.bid).toFixed(2)}</p>
        `

        document.getElementById("libra").innerHTML = `
            <span class="moeda">£</span>
            <p class="subtitulo-card">Libra Esterlina</p>
            <p class="cotacao-valor">R$ ${Number(dados.GBPBRL.bid).toFixed(2)}</p>
        `

    } catch (error) {
        console.error("Erro ao carregar cotações:", error);
    }
}

carregarCotacoes();

