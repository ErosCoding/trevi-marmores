// Trevi Mármores & Granitos — comportamento do site

// Número que recebe os orçamentos (DDI + DDD + número, só dígitos)
const WHATSAPP = "553198466982";

function linkWhatsApp(mensagem) {
  return "https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(mensagem);
}

function abrirWhatsApp(mensagem) {
  window.open(linkWhatsApp(mensagem), "_blank", "noopener");
}

// Todo link com data-wa abre o WhatsApp com a mensagem do atributo
document.querySelectorAll("[data-wa]").forEach((el) => {
  el.href = linkWhatsApp(el.dataset.wa);
  el.target = "_blank";
  el.rel = "noopener";
});

// Cabeçalho sólido ao rolar
const topo = document.querySelector(".topo");
if (topo && !topo.classList.contains("sempre-solido")) {
  const atualizar = () => topo.classList.toggle("solido", window.scrollY > 40);
  atualizar();
  window.addEventListener("scroll", atualizar, { passive: true });
}

// Menu mobile
const menuBtn = document.querySelector(".menu-btn");
const nav = document.querySelector(".nav");
if (menuBtn && nav) {
  menuBtn.addEventListener("click", () => {
    const aberto = nav.classList.toggle("aberto");
    menuBtn.setAttribute("aria-expanded", aberto);
    document.body.style.overflow = aberto ? "hidden" : "";
  });
  nav.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      nav.classList.remove("aberto");
      menuBtn.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    })
  );
}

// Galeria: filtros e lightbox
const galeria = document.querySelector(".galeria");
if (galeria) {
  const figuras = [...galeria.querySelectorAll("figure")];

  document.querySelectorAll(".filtro").forEach((botao) => {
    botao.addEventListener("click", () => {
      document.querySelectorAll(".filtro").forEach((b) => b.classList.remove("ativo"));
      botao.classList.add("ativo");
      const cat = botao.dataset.filtro;
      figuras.forEach((f) => f.classList.toggle("oculto", cat !== "todos" && f.dataset.cat !== cat));
    });
  });

  const lb = document.querySelector(".lightbox");
  const lbImg = lb.querySelector("img");
  let atual = 0;
  const visiveis = () => figuras.filter((f) => !f.classList.contains("oculto"));
  const mostrar = (i) => {
    const lista = visiveis();
    atual = (i + lista.length) % lista.length;
    const img = lista[atual].querySelector("img");
    lbImg.src = img.src;
    lbImg.alt = img.alt;
  };
  const fechar = () => {
    lb.classList.remove("aberto");
    document.body.style.overflow = "";
  };

  figuras.forEach((f) =>
    f.addEventListener("click", () => {
      mostrar(visiveis().indexOf(f));
      lb.classList.add("aberto");
      document.body.style.overflow = "hidden";
    })
  );
  lb.querySelector(".lb-fechar").addEventListener("click", fechar);
  lb.querySelector(".lb-ant").addEventListener("click", (e) => { e.stopPropagation(); mostrar(atual - 1); });
  lb.querySelector(".lb-prox").addEventListener("click", (e) => { e.stopPropagation(); mostrar(atual + 1); });
  lb.addEventListener("click", (e) => { if (e.target === lb) fechar(); });
  document.addEventListener("keydown", (e) => {
    if (!lb.classList.contains("aberto")) return;
    if (e.key === "Escape") fechar();
    if (e.key === "ArrowLeft") mostrar(atual - 1);
    if (e.key === "ArrowRight") mostrar(atual + 1);
  });
}

// Formulário de orçamento → WhatsApp
const form = document.querySelector("#form-orcamento");
if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(form));
    const linhas = [
      "Olá, Trevi! Vim pelo site e gostaria de um orçamento.",
      "",
      "*Nome:* " + d.nome,
      "*Serviço:* " + d.servico,
    ];
    if (d.material) linhas.push("*Material:* " + d.material);
    if (d.medidas) linhas.push("*Medidas aproximadas:* " + d.medidas);
    if (d.cidade) linhas.push("*Cidade:* " + d.cidade);
    if (d.mensagem) linhas.push("", d.mensagem);
    abrirWhatsApp(linhas.join("\n"));
  });
}

// Página do Kit Lavabo
const kit = document.querySelector("#kit-form");
if (kit) {
  const PRECOS = { bandeja: 99, completo: 150 };
  const NOMES = {
    bandeja: "Só a bandeja",
    completo: "Kit completo (bandeja + porta-sabonete líquido + difusor)",
  };
  const qtd = kit.querySelector("#qtd");
  const totais = document.querySelectorAll("[data-total]");
  const real = (v) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const ler = () => {
    const opcao = kit.querySelector("input[name=opcao]:checked").value;
    const material = kit.querySelector("input[name=material]:checked").value;
    const n = Math.max(1, Math.min(50, parseInt(qtd.value, 10) || 1));
    return { opcao, material, n, total: PRECOS[opcao] * n };
  };
  const atualizar = () => {
    const s = ler();
    totais.forEach((t) => (t.textContent = real(s.total)));
  };

  kit.addEventListener("change", atualizar);
  qtd.addEventListener("input", atualizar);
  kit.querySelectorAll(".qtd button").forEach((b) =>
    b.addEventListener("click", () => {
      qtd.value = Math.max(1, Math.min(50, (parseInt(qtd.value, 10) || 1) + Number(b.dataset.passo)));
      atualizar();
    })
  );

  const pedir = (e) => {
    e.preventDefault();
    const s = ler();
    abrirWhatsApp(
      [
        "Olá, Trevi! Vim pelo site e quero o *Kit Lavabo* (bandeja 28 × 15 cm).",
        "",
        "*Opção:* " + NOMES[s.opcao],
        "*Material:* " + s.material,
        "*Quantidade:* " + s.n,
        "*Total:* " + real(s.total),
        "",
        "Pode me mostrar as pedras disponíveis e o prazo de entrega?",
      ].join("\n")
    );
  };
  kit.addEventListener("submit", pedir);
  document.querySelectorAll("[data-pedir]").forEach((b) => b.addEventListener("click", pedir));
  atualizar();

  // Galeria do produto
  const principal = document.querySelector(".produto-principal img");
  document.querySelectorAll(".miniaturas button").forEach((b) =>
    b.addEventListener("click", () => {
      document.querySelectorAll(".miniaturas button").forEach((x) => x.classList.remove("ativo"));
      b.classList.add("ativo");
      principal.src = b.dataset.src;
      principal.alt = b.querySelector("img").alt;
    })
  );

  // Barra fixa de compra no celular
  const barra = document.querySelector(".barra-compra");
  const botaoPrincipal = kit.querySelector("button[type=submit]");
  if (barra && botaoPrincipal) {
    new IntersectionObserver(([e]) => barra.classList.toggle("visivel", !e.isIntersecting && e.boundingClientRect.top < 0)).observe(botaoPrincipal);
  }
}

// Ano no rodapé
document.querySelectorAll("[data-ano]").forEach((el) => (el.textContent = new Date().getFullYear()));
