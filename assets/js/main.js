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
  const definirMenu = (aberto) => {
    nav.classList.toggle("aberto", aberto);
    menuBtn.setAttribute("aria-expanded", aberto);
    menuBtn.setAttribute("aria-label", aberto ? "Fechar menu" : "Abrir menu");
    document.body.style.overflow = aberto ? "hidden" : "";
    document.body.classList.toggle("menu-aberto", aberto);
  };
  menuBtn.addEventListener("click", () => definirMenu(!nav.classList.contains("aberto")));
  nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => definirMenu(false)));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav.classList.contains("aberto")) {
      definirMenu(false);
      menuBtn.focus();
    }
  });
}

// Galeria: filtros e lightbox
const galeria = document.querySelector(".galeria");
if (galeria) {
  const figuras = [...galeria.querySelectorAll("figure")];

  document.querySelectorAll(".filtro").forEach((botao) => {
    botao.addEventListener("click", () => {
      document.querySelectorAll(".filtro").forEach((b) => {
        b.classList.toggle("ativo", b === botao);
        b.setAttribute("aria-pressed", b === botao);
      });
      const cat = botao.dataset.filtro;
      figuras.forEach((f) => {
        const ocultar = cat !== "todos" && f.dataset.cat !== cat;
        f.classList.toggle("oculto", ocultar);
        f.classList.remove("entrando");
        if (!ocultar) {
          void f.offsetWidth; // reinicia a animação
          f.classList.add("entrando");
        }
      });
    });
  });

  const lb = document.querySelector(".lightbox");
  const lbImg = lb.querySelector("img");
  const lbLegenda = lb.querySelector(".lb-legenda");
  let atual = 0;
  let origem = null;
  const visiveis = () => figuras.filter((f) => !f.classList.contains("oculto"));
  const mostrar = (i) => {
    const lista = visiveis();
    atual = (i + lista.length) % lista.length;
    const fig = lista[atual];
    const img = fig.querySelector("img");
    const trocar = () => {
      lbImg.src = img.currentSrc || img.src;
      lbImg.alt = img.alt;
      lbLegenda.textContent = fig.querySelector("figcaption")?.textContent || "";
      const contador = document.createElement("span");
      contador.textContent = atual + 1 + " de " + lista.length;
      lbLegenda.append(contador);
      lbImg.classList.remove("trocando");
    };
    if (lb.classList.contains("aberto")) {
      lbImg.classList.add("trocando");
      setTimeout(trocar, 180);
    } else {
      trocar();
    }
  };
  const abrir = (f) => {
    origem = f;
    mostrar(visiveis().indexOf(f));
    lb.classList.add("aberto");
    lb.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    lb.querySelector(".lb-fechar").focus();
  };
  const fechar = () => {
    lb.classList.remove("aberto");
    lb.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (origem) origem.focus();
  };

  figuras.forEach((f) => {
    f.tabIndex = 0;
    f.setAttribute("role", "button");
    f.setAttribute("aria-label", "Ampliar foto: " + (f.querySelector("figcaption")?.textContent || ""));
    f.addEventListener("click", () => abrir(f));
    f.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        abrir(f);
      }
    });
  });
  lb.querySelector(".lb-fechar").addEventListener("click", fechar);
  lb.querySelector(".lb-ant").addEventListener("click", (e) => { e.stopPropagation(); mostrar(atual - 1); });
  lb.querySelector(".lb-prox").addEventListener("click", (e) => { e.stopPropagation(); mostrar(atual + 1); });
  lb.addEventListener("click", (e) => { if (e.target === lb) fechar(); });
  document.addEventListener("keydown", (e) => {
    if (!lb.classList.contains("aberto")) return;
    if (e.key === "Escape") fechar();
    if (e.key === "ArrowLeft") mostrar(atual - 1);
    if (e.key === "ArrowRight") mostrar(atual + 1);
    // Mantém o foco dentro da foto ampliada
    if (e.key === "Tab") {
      const botoes = [...lb.querySelectorAll("button")];
      const i = botoes.indexOf(document.activeElement);
      e.preventDefault();
      botoes[(i + (e.shiftKey ? -1 : 1) + botoes.length) % botoes.length].focus();
    }
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
    const novo = real(ler().total);
    totais.forEach((t) => {
      if (t.textContent === novo) return;
      t.textContent = novo;
      t.classList.remove("mudou");
      void t.offsetWidth; // reinicia o realce
      t.classList.add("mudou");
    });
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
  const miniaturas = document.querySelectorAll(".miniaturas button");
  miniaturas.forEach((b) =>
    b.addEventListener("click", () => {
      if (b.classList.contains("ativo")) return;
      miniaturas.forEach((x) => {
        x.classList.toggle("ativo", x === b);
        x.setAttribute("aria-pressed", x === b);
      });
      principal.classList.add("trocando");
      setTimeout(() => {
        principal.src = b.dataset.src;
        principal.alt = b.querySelector("img").alt;
        principal.classList.remove("trocando");
      }, 180);
    })
  );

  // Barra fixa de compra no celular
  const barra = document.querySelector(".barra-compra");
  const botaoPrincipal = kit.querySelector("button[type=submit]");
  if (barra && botaoPrincipal) {
    new IntersectionObserver(([e]) => {
      const visivel = !e.isIntersecting && e.boundingClientRect.top < 0;
      barra.classList.toggle("visivel", visivel);
      barra.inert = !visivel;
      document.body.classList.toggle("barra-ativa", visivel);
    }).observe(botaoPrincipal);
  }
}

// Revelar ao rolar: blocos surgem com suavidade; os que entram juntos vêm em sequência
const reduzir = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const ALVOS = [
  ".cabeca", ".sobre > div:last-child", ".valores li", ".servico", ".destaque-kit-texto",
  ".material", ".filtros", ".galeria figure", ".passo", ".orcamento > div", ".form",
  ".ficha > div", ".comparativo > div", ".faq-wrap > h2", ".faq details", ".rodape-grade > div",
];
const FOTOS = [".sobre-fotos", ".destaque-kit-img"];
if (!reduzir && "IntersectionObserver" in window) {
  const observador = new IntersectionObserver(
    (entradas) =>
      entradas
        .filter((e) => e.isIntersecting)
        .forEach((e, i) => {
          e.target.style.setProperty("--atraso", Math.min(i, 5) * 0.08 + "s");
          e.target.classList.add("visivel");
          observador.unobserve(e.target);
        }),
    { rootMargin: "0px 0px -6% 0px", threshold: 0.05 }
  );
  document.querySelectorAll(ALVOS.join(",")).forEach((el) => {
    el.classList.add("revelar");
    observador.observe(el);
  });
  document.querySelectorAll(FOTOS.join(",")).forEach((el) => {
    el.classList.add("revelar-foto");
    observador.observe(el);
  });
  // Na impressão tudo precisa estar visível
  window.addEventListener("beforeprint", () =>
    document.querySelectorAll(".revelar, .revelar-foto").forEach((el) => el.classList.add("visivel"))
  );
  // Ao filtrar a galeria, as fotos já aparecem sem esperar a rolagem
  document.querySelectorAll(".filtro").forEach((b) =>
    b.addEventListener("click", () => document.querySelectorAll(".galeria figure").forEach((f) => f.classList.add("visivel")))
  );
}

// Ano no rodapé
document.querySelectorAll("[data-ano]").forEach((el) => (el.textContent = new Date().getFullYear()));
