let autoCarouselInterval;
let isMoving = false;

async function carregarProdutos() {
  try {
    const resposta = await fetch("/produtos/florescer_chique_produtos.json");
    const produtos = await resposta.json();

    const produtosTrack = document.getElementById("produtos-track");
    produtosTrack.innerHTML = "";

    produtos
      .filter(p => p.destaque === true)
      .forEach(produto => {
        const card = document.createElement("div");
        card.className = "produtos-card";

        const emPromocao =
          produto.promocao === true &&
          typeof produto.desconto === "number" &&
          produto.desconto > 0;

        const precoFinal = emPromocao
          ? calcularPrecoComDesconto(produto.preco, produto.desconto)
          : produto.preco;

        card.innerHTML = `
          <div class="card-imagem">
            ${emPromocao
              ? `<span class="selo-promocao">-${produto.desconto}%</span>`
              : ""
            }
            <img src="${produto.imagem}" alt="${produto.nome}">
          </div>

          <div class="card-body">
            <h3>${produto.nome}</h3>

            ${emPromocao ? `
              <p class="preco-antigo">R$ ${produto.preco.toFixed(2)}</p>
              <p class="preco-novo">R$ ${precoFinal.toFixed(2)}</p>
            ` : `
              <p class="preco-novo">R$ ${produto.preco.toFixed(2)}</p>
            `}

            <button onclick="abrirDetalhes('${produto.id}')">
              Ver detalhes
            </button>
          </div>
        `;

        produtosTrack.appendChild(card);
      });

    iniciarCarrossel(produtosTrack);

  } catch (erro) {
    console.error("Erro ao carregar produtos:", erro);
  }
}

/* ===============================
   CARROSSEL COM BOTÕES
================================ */

function iniciarCarrossel(track) {
  const btnPrev = document.getElementById("btn-prev");
  const btnNext = document.getElementById("btn-next");

  const getCardWidth = () =>
    track.firstElementChild.offsetWidth + 20;

  function moverParaDireita() {
    if (isMoving) return;
    isMoving = true;

    const largura = getCardWidth();
    track.style.transition = "transform 0.5s ease";
    track.style.transform = `translateX(-${largura}px)`;

    setTimeout(() => {
      track.style.transition = "none";
      track.appendChild(track.firstElementChild);
      track.style.transform = "translateX(0)";
      isMoving = false;
    }, 500);
  }

  function moverParaEsquerda() {
    if (isMoving) return;
    isMoving = true;

    const largura = getCardWidth();
    track.style.transition = "none";
    track.insertBefore(track.lastElementChild, track.firstElementChild);
    track.style.transform = `translateX(-${largura}px)`;

    requestAnimationFrame(() => {
      track.style.transition = "transform 0.5s ease";
      track.style.transform = "translateX(0)";
    });

    setTimeout(() => {
      isMoving = false;
    }, 500);
  }

  btnNext.addEventListener("click", () => {
    resetAuto();
    moverParaDireita();
  });

  btnPrev.addEventListener("click", () => {
    resetAuto();
    moverParaEsquerda();
  });

  autoCarouselInterval = setInterval(moverParaDireita, 3000);

  function resetAuto() {
    clearInterval(autoCarouselInterval);
    autoCarouselInterval = setInterval(moverParaDireita, 3000);
  }
}

/* ===============================
   UTILIDADES
================================ */

function calcularPrecoComDesconto(preco, desconto) {
  return preco - (preco * desconto) / 100;
}

function abrirDetalhes(id) {
  window.location.href = `/html/produto.html?id=${id}`;
}

// Inicia tudo
carregarProdutos();
