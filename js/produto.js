const WHATSAPP_NUMERO = "5511989065804";

/* ===============================
   INICIALIZAÇÃO
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
    console.error("Erro ao carregar produto:", erro);
    info.innerHTML = "<p>Erro ao carregar produto.</p>";
  }
});

/* ===============================
   UTILITÁRIOS
================================ */
function calcularPrecoComDesconto(preco, desconto = 0) {
  if (!desconto || desconto <= 0) return preco;
  return preco - (preco * desconto / 100);
}

/* ===============================
   EXIBIÇÃO DO PRODUTO
================================ */
function exibirDetalhesProduto(produto) {
  const imagensContainer = document.getElementById("imagens-produto");
  const infoContainer = document.getElementById("info-produto");

  const emPromocao =
    produto.promocao === true &&
    typeof produto.desconto === "number" &&
    produto.desconto > 0;

  const precoFinal = calcularPrecoComDesconto(produto.preco, produto.desconto);

  /* GALERIA */
  imagensContainer.innerHTML = `
    <div class="carrossel">
      ${emPromocao ? `<span class="selo-promocao-produto">🔥 Promoção</span>` : ""}

      <button class="anterior">&#10094;</button>

      <div class="imagens">
        ${produto.imagens.map((img, i) => `
          <img src="${img}"
               class="imagem-carrossel ${i === 0 ? "ativa" : ""}"
               alt="${produto.nome}">
        `).join("")}
      </div>

      <button class="proximo">&#10095;</button>
    </div>
  `;

  /* INFO */
  infoContainer.innerHTML = `
    <p class="produto-id">Código: ${produto.id}</p>
    <h2 class="produto-titulo">${produto.nome}</h2>
    <p class="produto-descricao">${produto.descricao}</p>

    <p class="produto-preco">
      ${emPromocao ? `
        <span class="preco-antigo">R$ ${produto.preco.toFixed(2)}</span>
        <strong class="preco-novo">R$ ${precoFinal.toFixed(2)}</strong>
        <span class="badge-desconto">${produto.desconto}% OFF</span>
      ` : `
        <strong class="preco-novo">R$ ${produto.preco.toFixed(2)}</strong>
      `}
    </p>

    <p class="produto-descricao">✔ Hipoalergênicas, leves e confortáveis.<br>✔ Alta durabilidade e brilho prolongado.</p>

    <p class="produto-descricao">Cuidados:<br>❗ Evite água, suor e produtos químicos. <br>❗ Retire ao se banhar ou se exercitar. <br>❗ Limpe com flanela macia. <br> ❗ Guarde em local seco.</p>

    <p class="produto-descricao">Garantia:<br>✅ 7 dias para troca por defeito de fabricação.</p>

    

    


    

    <div class="acoes-produto">
      <button class="botao-sacola">👜 Adicionar à sacola</button>
    </div>
  `;

  /* EVENTO BOTÃO SACOLA */
  const botaoSacola = infoContainer.querySelector(".botao-sacola");
  botaoSacola.addEventListener("click", () => {
    adicionarProduto(produto);
    alert("Produto adicionado à sacola 👜");
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

function adicionarProduto(produto) {
  const sacola = obterSacola();

  const existente = sacola.find(item => item.id === produto.id);

  if (existente) {
    existente.quantidade += 1;
  } else {
    sacola.push({
      id: produto.id,
      nome: produto.nome,
      preco: produto.preco,
      imagem: produto.imagem,
      quantidade: 1
    });
  }

  salvarSacola(sacola);
}

function atualizarContador() {
  const contador = document.getElementById("contador-sacola");
  if (!contador) return;

  const sacola = obterSacola();
  const totalItens = sacola.reduce((soma, item) => soma + item.quantidade, 0);

  contador.innerText = totalItens;
}
