const WHATSAPP_NUMERO = "5511989065804";

document.addEventListener("DOMContentLoaded", renderizarSacola);

/* ===============================
   LOCAL STORAGE
================================ */

function obterSacola() {
  return JSON.parse(localStorage.getItem("sacola")) || [];
}

function salvarSacola(sacola) {
  localStorage.setItem("sacola", JSON.stringify(sacola));
  renderizarSacola();
}

/* ===============================
   ADICIONAR PRODUTO (USA IMAGEM PRINCIPAL)
================================ */

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
      imagem: produto.imagem, // 👈 imagem principal do JSON
      quantidade: 1
    });
  }

  salvarSacola(sacola);
}

/* ===============================
   RENDERIZAR SACOLA
================================ */

function renderizarSacola() {
  const lista = document.getElementById("lista-sacola");
  const sacola = obterSacola();

  if (!lista) return;

  if (!sacola.length) {
    lista.innerHTML = "<p>Sua sacola está vazia 😕</p>";
    return;
  }

  lista.innerHTML = sacola.map((item, index) => `
    <div class="item-sacola">
      <div style="display:flex; gap:12px; align-items:center;">
        <img src="${item.imagem}"
             alt="${item.nome}"
             style="width:70px; height:70px; object-fit:cover; border-radius:8px;">

        <div>
          <strong>${item.nome}</strong>
          <div>Qtd: ${item.quantidade}</div>
          <div>R$ ${(item.preco * item.quantidade).toFixed(2)}</div>
        </div>
      </div>

      <button onclick="removerItem(${index})">Remover</button>
    </div>
  `).join("");
}

/* ===============================
   REMOVER ITEM
================================ */

function removerItem(index) {
  const sacola = obterSacola();
  sacola.splice(index, 1);
  salvarSacola(sacola);
}

/* ===============================
   ENVIAR WHATSAPP + LIMPAR
================================ */

function enviarSacolaWhatsApp() {
  const sacola = obterSacola();

  if (!sacola.length) {
    alert("Sua sacola está vazia 😕");
    return;
  }

  let mensagem = "Olá! Tenho interesse nos seguintes produtos:%0A%0A";

  sacola.forEach(item => {
    mensagem += `- ${item.nome} (x${item.quantidade}) – R$ ${(item.preco * item.quantidade).toFixed(2)}%0A`;
  });

  mensagem += "%0A Aguardo retorno 😊";

  window.open(
    `https://wa.me/${WHATSAPP_NUMERO}?text=${mensagem}`,
    "_blank"
  );

  // 🧹 limpa sacola
  localStorage.removeItem("sacola");
  renderizarSacola();
}
