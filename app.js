async function carregarProdutos() {
  try {
    const resposta = await fetch("/produtos/florescer_chique_produtos.json");
    const produtos = await resposta.json();

    const produtosTrack = document.getElementById("produtos-track");
    produtosTrack.innerHTML = ""; // Limpa antes de inserir

    // Renderiza apenas os produtos destaque
    produtos.filter(p => p.destaque).forEach(produto => {
      const card = document.createElement("div");
      card.className = "produtos-card";
      card.innerHTML = `
        <img src="${produto.imagem}" alt="${produto.nome}">
        <div class="card-body">
          <h3>${produto.nome}</h3>
          <p><strong>R$ ${produto.preco.toFixed(2)}</strong></p>
          <p>${produto.categoria}</p>
        </div>
      `;
      produtosTrack.appendChild(card);
    });

    // Carrossel automático dos destaques
    const cards = document.querySelectorAll('.produtos-card');
    let destaqueIndex = 0;

    function showDestaqueSlide(i) {
      const cardWidth = cards[0]?.offsetWidth || 300;
      produtosTrack.style.transform = `translateX(-${i * (cardWidth + 20)}px)`;
    }

    setInterval(() => {
      destaqueIndex = (destaqueIndex + 1) % cards.length;
      showDestaqueSlide(destaqueIndex);
    }, 4000);

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


carregarProdutos();