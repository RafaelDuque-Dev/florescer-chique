document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const idProduto = urlParams.get("id");

  if (!idProduto) {
    document.getElementById("info-produto").innerHTML = "<p>Produto não encontrado.</p>";
    return;
  }

  try {
    const resposta = await fetch("/produtos/florescer_chique_produtos.json");
    const produtos = await resposta.json();
    const produto = produtos.find(p => p.id == idProduto);

    if (!produto) {
      document.getElementById("info-produto").innerHTML = "<p>Produto não encontrado.</p>";
      return;
    }

    exibirDetalhesProduto(produto);

  } catch (erro) {
    console.error("Erro ao carregar produto:", erro);
    document.getElementById("info-produto").innerHTML = "<p>Erro ao carregar produto.</p>";
  }
});

function exibirDetalhesProduto(produto) {
  const imagensContainer = document.getElementById("imagens-produto");
  const infoContainer = document.getElementById("info-produto");

  // Carrossel de imagens
  imagensContainer.innerHTML = `
    <div class="carrossel">
      <button class="anterior">&#10094;</button>
      <div class="imagens">
        ${produto.imagens.map((img, index) => `
          <img src="${img}" class="imagem-carrossel ${index === 0 ? 'ativa' : ''}" alt="${produto.nome}">
        `).join("")}
      </div>
      <button class="proximo">&#10095;</button>
    </div>
  `;

  // Informações
  infoContainer.innerHTML = `
    <p class="produto-id">Codigo: ${produto.id}</p>
    <h2 class="produto-titulo">${produto.nome}</h2>
    <p class="produto-descricao">${produto.descricao}</p>
    <p class="produto-preco"><strong>R$ ${produto.preco.toFixed(2)}</strong></p>
    <a class="botao-whatsapp" href="https://wa.me/5599999999999?text=Olá!%20Gostaria%20de%20saber%20mais%20sobre%20o%20produto:%20${encodeURIComponent(produto.nome)}" target="_blank">
      Falar no WhatsApp
    </a>
  `;

  configurarCarrossel();
}

function configurarCarrossel() {
  let indice = 0;
  const imagens = document.querySelectorAll(".imagem-carrossel");

  function mostrarImagem(i) {
    imagens.forEach((img, idx) => {
      img.classList.remove("ativa");
      if (idx === i) {
        img.classList.add("ativa");
      }
    });
  }

  document.querySelector(".anterior").addEventListener("click", () => {
    indice = (indice - 1 + imagens.length) % imagens.length;
    mostrarImagem(indice);
  });

  document.querySelector(".proximo").addEventListener("click", () => {
    indice = (indice + 1) % imagens.length;
    mostrarImagem(indice);
  });
}
