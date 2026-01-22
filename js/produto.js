const WHATSAPP_NUMERO = "5511989065804";

/* ===============================
   CARREGAMENTO DO PRODUTO
================================ */
document.addEventListener("DOMContentLoaded", async () => {
  atualizarContador();

  const params = new URLSearchParams(window.location.search);
  const idProduto = params.get("id");

  const info = document.getElementById("info-produto");

  if (!idProduto) {
    info.innerHTML = "<p>Produto não encontrado.</p>";
    return;
  }

  try {
    const resposta = await fetch("/produtos/florescer_chique_produtos.json");
    const produtos = await resposta.json();

    const produto = produtos.find(p => String(p.id) === String(idProduto));

    if (!produto) {
      info.innerHTML = "<p>Produto não encontrado.</p>";
      return;
    }

    exibirDetalhesProduto(produto);

  } catch (erro) {
    console.error("Erro:", erro);
    info.innerHTML = "<p>Erro ao carregar produto.</p>";
  }
});

/* ===============================
   EXIBIÇÃO DO PRODUTO
================================ */
function exibirDetalhesProduto(produto) {
  const imagensContainer = document.getElementById("imagens-produto");
  const infoContainer = document.getElementById("info-produto");

  imagensContainer.innerHTML = `
    <div class="carrossel">
      <button class="anterior">&#10094;</button>
      <div class="imagens">
        ${produto.imagens.map((img, i) => `
          <img src="${img}" class="imagem-carrossel ${i === 0 ? "ativa" : ""}" alt="${produto.nome}">
        `).join("")}
      </div>
      <button class="proximo">&#10095;</button>
    </div>
  `;

  infoContainer.innerHTML = `
    <p class="produto-id">Código: ${produto.id}</p>
    <h2 class="produto-titulo">${produto.nome}</h2>
    <p class="produto-descricao">${produto.descricao}</p>
    <p class="produto-preco"><strong>R$ ${produto.preco.toFixed(2)}</strong></p>

    <div class="acoes-produto">
      <button 
        class="botao-sacola"
        data-nome="${produto.nome}"
        data-preco="${produto.preco}">
        👜 Adicionar à sacola
      </button>

      <a class="botao-whatsapp"
        href="https://wa.me/${WHATSAPP_NUMERO}?text=Olá!%20Gostaria%20do%20produto:%20${encodeURIComponent(produto.nome)}%20|%20Código:%20${encodeURIComponent(produto.id)}"
        target="_blank">
        Falar no WhatsApp
      </a>
    </div>
  `;

  document.querySelector(".botao-sacola").addEventListener("click", function () {
    adicionarSacola(this.dataset.nome, Number(this.dataset.preco));
  });

  configurarCarrossel();
}

/* ===============================
   CARROSSEL
================================ */
function configurarCarrossel() {
  let indice = 0;
  const imagens = document.querySelectorAll(".imagem-carrossel");

  function mostrar(i) {
    imagens.forEach((img, idx) =>
      img.classList.toggle("ativa", idx === i)
    );
  }

  document.querySelector(".anterior").onclick = () => {
    indice = (indice - 1 + imagens.length) % imagens.length;
    mostrar(indice);
  };

  document.querySelector(".proximo").onclick = () => {
    indice = (indice + 1) % imagens.length;
    mostrar(indice);
  };
}

/* ===============================
   SACOLA
================================ */
function obterSacola() {
  return JSON.parse(localStorage.getItem("sacola")) || [];
}

function salvarSacola(sacola) {
  localStorage.setItem("sacola", JSON.stringify(sacola));
  atualizarContador();
}

function adicionarSacola(nome, preco) {
  const sacola = obterSacola();
  sacola.push({ nome, preco });
  salvarSacola(sacola);
  alert("Produto adicionado à sacola 👜");
}

function atualizarContador() {
  const contador = document.getElementById("contador-sacola");
  if (contador) {
    contador.innerText = obterSacola().length;
  }
}

function enviarSacolaWhatsApp() {
  const sacola = obterSacola();

  if (!sacola.length) {
    alert("Sua sacola está vazia 😕");
    return;
  }

  let msg = "Olá! Tenho interesse nos seguintes produtos:%0A%0A";

  sacola.forEach(p => {
    msg += `- ${p.nome} – R$ ${p.preco.toFixed(2)}%0A`;
  });

  msg += "%0A Aguardo retorno 😊";

  window.open(`https://wa.me/${WHATSAPP_NUMERO}?text=${msg}`, "_blank");
}
