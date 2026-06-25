const slides = document.querySelectorAll(".tirinha-slide");
const btnAnterior = document.querySelector(".tirinha-btn.anterior");
const btnProximo = document.querySelector(".tirinha-btn.proximo");

let slideAtual = 0;

function mostrarSlide(indice){
    slides.forEach(slide => slide.classList.remove("ativo"));

    slides[indice].classList.add("ativo");
}

btnProximo.addEventListener("click", () => {
    slideAtual++;

    if(slideAtual >= slides.length){
        slideAtual = 0;
    }

    mostrarSlide(slideAtual);
});

btnAnterior.addEventListener("click", () => {
    slideAtual--;

    if(slideAtual < 0){
        slideAtual = slides.length - 1;
    }

    mostrarSlide(slideAtual);
});