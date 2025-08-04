let produtos = [];
let produtosFiltrados = [];

document.addEventListener("DOMContentLoaded", async () => {
  await carregarProdutos();
  configurarFiltros();
  exibirProdutos(produtos);
});

async function carregarProdutos() {
  try {
    const resposta = await fetch("/produtos/florescer_chique_produtos.json");
    produtos = await resposta.json();
    produtosFiltrados = [...produtos];
  } catch (erro) {
    console.error("Erro ao carregar produtos:", erro);
  }
}

function configurarFiltros() {
  document.getElementById("filtro-categoria").addEventListener("change", filtrar);
  document.getElementById("filtro-ordem").addEventListener("change", filtrar);
}

function filtrar() {
  const categoria = document.getElementById("filtro-categoria").value;
  const ordem = document.getElementById("filtro-ordem").value;

  produtosFiltrados = produtos.filter(produto => {
    return categoria === "todos" || produto.categoria === categoria;
  });

  if (ordem === "maior_preco") {
    produtosFiltrados.sort((a, b) => b.preco - a.preco);
  } else if (ordem === "menor_preco") {
    produtosFiltrados.sort((a, b) => a.preco - b.preco);
  } else if (ordem === "destaques") {
    produtosFiltrados.sort((a, b) => Number(b.destaque) - Number(a.destaque));
  }

  exibirProdutos(produtosFiltrados);
}

function exibirProdutos(lista) {
  const container = document.getElementById("catalogo-lista");
  container.innerHTML = "";

  lista.forEach(produto => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <img src="${produto.imagem}" alt="${produto.nome}">
      <div class="card-body">
        <h3>${produto.nome}</h3>
        <p><strong>R$ ${produto.preco.toFixed(2)}</strong></p>
        <button onclick="abrirDetalhes('${produto.id}')">Ver detalhes</button>
      </div>
    `;

    container.appendChild(card);
  });
}

function abrirDetalhes(id) {
  window.location.href = `/produto.html?id=${id}`;
}