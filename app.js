async function carregarProdutos() {
  try {
    const resposta = await fetch("/produtos/florescer_chique_produtos.json");
    const produtos = await resposta.json();

    const produtosTrack = document.getElementById("produtos-track");
    produtosTrack.innerHTML = "";

    produtos
      .filter(p => p.destaque)
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
              : ''
            }
            <img src="${produto.imagem}" alt="${produto.nome}">
          </div>

          <div class="card-body">
            <h3>${produto.nome}</h3>

            ${emPromocao ? `
              <p class="preco-antigo">
                R$ ${produto.preco.toFixed(2)}
              </p>
              <p class="preco-novo">
                R$ ${precoFinal.toFixed(2)}
              </p>
            ` : `
              <p class="preco-novo">
                R$ ${produto.preco.toFixed(2)}
              </p>
            `}

            <button onclick="abrirDetalhes('${produto.id}')">
              Ver detalhes
            </button>
          </div>
        `;

        produtosTrack.appendChild(card);
      });

    iniciarCarrosselLoop(produtosTrack);

  } catch (erro) {
    console.error("Erro ao carregar produtos.json:", erro);
  }
}



// Carrossel principal (banner)
const track = document.querySelector('.carousel-track');
const items = document.querySelectorAll('.carousel-item');
let index = 0;

function showSlide(i) {
  track.style.transform = `translateX(-${i * 100}%)`;
}

setInterval(() => {
  index = (index + 1) % items.length;
  showSlide(index);
}, 4000);

// Função fora do async, recebe o track como parâmetro
function iniciarCarrosselLoop(produtosTrack) {
  setInterval(() => {
    const primeiro = produtosTrack.firstElementChild;
    const larguraCard = primeiro.offsetWidth + 20;

    produtosTrack.style.transition = 'transform 0.5s ease-in-out';
    produtosTrack.style.transform = `translateX(-${larguraCard}px)`;

    setTimeout(() => {
      produtosTrack.style.transition = 'none';
      produtosTrack.appendChild(primeiro);
      produtosTrack.style.transform = 'translateX(0)';
    }, 500);
  }, 2000);
}

function abrirDetalhes(id) {
  window.location.href = `/html/produto.html?id=${id}`;
}

// Inicia o carregamento
carregarProdutos();


