const WHATSAPP_NUMERO = "5511989065804";

document.addEventListener("DOMContentLoaded", renderizarSacola);

function obterSacola() {
  return JSON.parse(localStorage.getItem("sacola")) || [];
}

function salvarSacola(sacola) {
  localStorage.setItem("sacola", JSON.stringify(sacola));
  renderizarSacola();
}

function renderizarSacola() {
  const lista = document.getElementById("lista-sacola");
  const sacola = obterSacola();

  if (sacola.length === 0) {
    lista.innerHTML = "<p>Sua sacola está vazia 😕</p>";
    return;
  }

  lista.innerHTML = sacola.map((item, index) => `
    <div class="item-sacola">
      <div>
        <strong>${item.nome}</strong><br>
        R$ ${item.preco.toFixed(2)}
      </div>
      <button onclick="removerItem(${index})">Remover</button>
    </div>
  `).join("");
}

function removerItem(index) {
  const sacola = obterSacola();
  sacola.splice(index, 1);
  salvarSacola(sacola);
}

function enviarSacolaWhatsApp() {
  const sacola = obterSacola();

  if (!sacola.length) {
    alert("Sua sacola está vazia 😕");
    return;
  }

  let mensagem = "Olá! Tenho interesse nos seguintes produtos:%0A%0A";

  sacola.forEach(item => {
    mensagem += `- ${item.nome} – R$ ${item.preco.toFixed(2)}%0A`;
  });

  mensagem += "%0A Aguardo retorno 😊";

  window.open(
    `https://wa.me/${WHATSAPP_NUMERO}?text=${mensagem}`,
    "_blank"
  );
}
