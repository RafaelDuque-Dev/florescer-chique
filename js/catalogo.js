let produtos = [];
let produtosFiltrados = [];

/* ===============================
   INICIALIZAÇÃO
================================ */
document.addEventListener("DOMContentLoaded", async () => {
  await carregarProdutos();
  configurarFiltros();
  exibirProdutos(produtos);
});

/* ===============================
   CARREGAR PRODUTOS
================================ */
async function carregarProdutos() {
  try {
    const resposta = await fetch("/produtos/florescer_chique_produtos.json");
    produtos = await resposta.json();
    produtosFiltrados = [...produtos];
  } catch (erro) {
    console.error("Erro ao carregar produtos:", erro);
  }
}

/* ===============================
   FILTROS
================================ */
function configurarFiltros() {
  document
    .getElementById("filtro-categoria")
    .addEventListener("change", filtrar);

  document
    .getElementById("filtro-ordem")
    .addEventListener("change", filtrar);
}

function filtrar() {
  const categoria = document
    .getElementById("filtro-categoria")
    .value
    .toLowerCase();

  const ordem = document.getElementById("filtro-ordem").value;

  produtosFiltrados = produtos.filter(produto => {
    return categoria === "todos"
      || produto.categoria?.toLowerCase() === categoria;
  });

  if (ordem === "maior_preco") {
    produtosFiltrados.sort((a, b) => b.preco - a.preco);
  }

  if (ordem === "menor_preco") {
    produtosFiltrados.sort((a, b) => a.preco - b.preco);
  }

  if (ordem === "destaques") {
    produtosFiltrados.sort(
      (a, b) => Number(b.destaque) - Number(a.destaque)
    );
  }

  exibirProdutos(produtosFiltrados);
}

/* ===============================
   DESCONTO
================================ */
function calcularPrecoComDesconto(preco, desconto) {
  if (!desconto || desconto <= 0) return preco;
  return preco - (preco * desconto / 100);
}

/* ===============================
   EXIBIÇÃO DOS PRODUTOS
================================ */
function exibirProdutos(lista) {
  const container = document.getElementById("catalogo-lista");
  container.innerHTML = "";

  lista.forEach(produto => {
    const card = document.createElement("div");
    card.className = "card";

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

    container.appendChild(card);
  });
}

/* ===============================
   DETALHES
================================ */
function abrirDetalhes(id) {
  window.location.href = `/html/produto.html?id=${id}`;
}
