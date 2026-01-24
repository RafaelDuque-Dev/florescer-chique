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
  const categoria = document.getElementById("filtro-categoria").value.toLowerCase(); // transforma o valor selecionado em minúsculo
  const ordem = document.getElementById("filtro-ordem").value;

  let produtosFiltrados = produtos.filter(p => {
    return categoria === "todos" || p.categoria.toLowerCase() === categoria;
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



function calcularPrecoComDesconto(preco, desconto) {
  return desconto ? preco - (preco * desconto / 100) : preco;
}


function exibirProdutos(lista) {
  const container = document.getElementById("catalogo-lista");
  container.innerHTML = "";

  lista.forEach(produto => {
    const card = document.createElement("div");
    card.className = "card";
  
  
  const precoFinal = calcularPrecoComDesconto(produto.preco, produto.desconto);

  const emPromocao = produto.promocao === true;

  card.innerHTML = `
    <div class="card-imagem">
      ${produto.promocao && produto.desconto
        ? `<span class="selo-promocao">-${produto.desconto}%</span>`
        : ''
      }
      <img src="${produto.imagem}" alt="${produto.nome}">
    </div>

    <div class="card-body">
      <h3>${produto.nome}</h3>

      ${produto.promocao
        ? `
          <p class="preco-antigo">R$ ${produto.preco.toFixed(2)}</p>
          <p class="preco-novo">R$ ${precoFinal.toFixed(2)}</p>
        `
        : `
          <p class="preco-novo">R$ ${produto.preco.toFixed(2)}</p>
        `
      }

      <button onclick="abrirDetalhes('${produto.id}')">
        Ver detalhes
      </button>
    </div>
  `;

    container.appendChild(card);
  });
}

function abrirDetalhes(id) {
  window.location.href = `/html/produto.html?id=${id}`;
}
