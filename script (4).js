document.documentElement.classList.add("carol-js");

const carolTituloOriginal = document.title;
document.addEventListener("visibilitychange", () => {
  document.title = document.hidden ? "Não vá embora! Volte aqui..." : carolTituloOriginal;
});

const carolGuardar = {
  ler: (k) => { try { return localStorage.getItem(k); } catch (e) { return null; } },
  gravar: (k, v) => { try { localStorage.setItem(k, v); } catch (e) {} }
};

document.addEventListener("DOMContentLoaded", () => {

  const carolChaveTema = document.getElementById("carolChaveTema");
  const carolBody = document.body;

  function carolAplicarTema(tema){
    carolBody.classList.toggle("carol-claro", tema === "light");
    carolChaveTema.setAttribute("aria-checked", String(tema !== "light"));
  }

  carolAplicarTema(carolGuardar.ler("carol-theme") || "dark");

  carolChaveTema.addEventListener("click", () => {
    const proximo = carolChaveTema.getAttribute("aria-checked") === "true" ? "light" : "dark";
    carolAplicarTema(proximo);
    carolGuardar.gravar("carol-theme", proximo);
  });

  const carolChaveEfeito = document.getElementById("carolChaveEfeito");
  const carolPainel = document.getElementById("carolPainel");
  const carolMarca = document.querySelector(".carol-marca");
  const carolHero = document.querySelector(".carol-hero");
  let carolEfeitoLigado = carolGuardar.ler("carol-fx") !== "off";
  carolChaveEfeito.setAttribute("aria-checked", String(carolEfeitoLigado));

  function carolLimparEfeito(){
    carolPainel.style.transform = "";
    carolMarca.style.transform = "";
  }

  carolChaveEfeito.addEventListener("click", () => {
    carolEfeitoLigado = !carolEfeitoLigado;
    carolChaveEfeito.setAttribute("aria-checked", String(carolEfeitoLigado));
    carolGuardar.gravar("carol-fx", carolEfeitoLigado ? "on" : "off");
    if (!carolEfeitoLigado) carolLimparEfeito();
  });

  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches){
    carolHero.addEventListener("mousemove", (e) => {
      if (!carolEfeitoLigado) return;
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      carolPainel.style.transform = `translate(${x * 10}px, ${y * 8}px)`;
      carolMarca.style.transform = `rotate(calc(var(--carol-giro) + ${x * 1.5}deg)) translate(${x * 6}px, ${y * 4}px)`;
    });
    carolHero.addEventListener("mouseleave", carolLimparEfeito);
  }

  const carolDigitado = document.getElementById("carolDigitado");
  const carolFrase = "explicando um pouco sobre quem eu sou, deixando minha experiência e fazendo design nas horas vagas.";
  let carolLetra = 0;

  (function carolDigitar(){
    if (carolLetra <= carolFrase.length){
      carolDigitado.textContent = carolFrase.slice(0, carolLetra++);
      setTimeout(carolDigitar, 28);
    }
  })();

  function carolModal(modal){
    return {
      abrir(){
        modal.classList.add("is-aberto");
        modal.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
      },
      fechar(){
        modal.classList.remove("is-aberto");
        modal.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
      }
    };
  }

  const carolBoasVindas = carolModal(document.getElementById("carolBoasVindas"));
  const affsacoModal = carolModal(document.getElementById("affsacoModal"));

  document.querySelectorAll(".carol-modal").forEach((m) => {
    m.addEventListener("click", (e) => {
      if (e.target === m || e.target.classList.contains("carol-modal__fechar")){
        m.classList.remove("is-aberto");
        m.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
      }
    });
  });

  document.getElementById("carolBoasVindasEntrar").addEventListener("click", carolBoasVindas.fechar);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape"){
      carolBoasVindas.fechar();
      affsacoModal.fechar();
    }
  });

  try {
    if (!sessionStorage.getItem("carol-modal-seen")){
      setTimeout(carolBoasVindas.abrir, 400);
      sessionStorage.setItem("carol-modal-seen", "1");
    }
  } catch (e) {
    setTimeout(carolBoasVindas.abrir, 400);
  }

  document.querySelectorAll(".seila-habilidade button").forEach((botao) => {
    botao.addEventListener("click", () => {
      const aberto = botao.parentElement.classList.toggle("is-aberto");
      botao.setAttribute("aria-expanded", String(aberto));
    });
  });

  document.querySelectorAll(".affsaco-quadrado").forEach((q) => {
    q.addEventListener("click", () => {
      document.getElementById("affsacoModalAno").textContent = q.dataset.ano;
      document.getElementById("affsacoModalTexto").textContent = q.dataset.texto;
      affsacoModal.abrir();
    });
  });

  const carolRevelar = document.querySelectorAll(".carol-revelar");
  if ("IntersectionObserver" in window){
    const observador = new IntersectionObserver((itens) => {
      itens.forEach((item) => {
        if (item.isIntersecting){
          item.target.classList.add("is-visivel");
          observador.unobserve(item.target);
        }
      });
    }, { threshold: 0.12 });
    carolRevelar.forEach((el) => observador.observe(el));
  } else {
    carolRevelar.forEach((el) => el.classList.add("is-visivel"));
  }

  const ENDPOINT_FORMULARIO = "";
  const EMAIL_DESTINO = "acarolaquinobicalho@gmail.com";
  const carolForm = document.getElementById("carolFormulario");
  const carolStatus = document.getElementById("carolStatus");

  const carolRegras = {
    nome: (v) => v.trim().length >= 2 || "Informe seu nome.",
    telefone: (v) => {
      const digitos = v.replace(/\D/g, "");
      return (digitos.length === 10 || digitos.length === 11) || "Informe um telefone com DDD.";
    },
    email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) || "Informe um e-mail válido.",
    mensagem: (v) => v.trim().length >= 5 || "Escreva sua mensagem."
  };

  function carolValidar(){
    let tudoCerto = true;
    Object.keys(carolRegras).forEach((campo) => {
      const input = carolForm.elements[campo];
      const resultado = carolRegras[campo](input.value);
      carolForm.querySelector(`[data-erro="${campo}"]`).textContent = resultado === true ? "" : resultado;
      input.classList.toggle("carol-invalido", resultado !== true);
      if (resultado !== true) tudoCerto = false;
    });
    return tudoCerto;
  }

  carolForm.elements.telefone.addEventListener("input", (e) => {
    const d = e.target.value.replace(/\D/g, "").slice(0, 11);
    let texto = d;
    if (d.length > 10) texto = `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
    else if (d.length > 6) texto = `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
    else if (d.length > 2) texto = `(${d.slice(0, 2)}) ${d.slice(2)}`;
    else if (d.length > 0) texto = `(${d}`;
    e.target.value = texto;
  });

  carolForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    carolStatus.textContent = "";
    if (!carolValidar()) return;

    const dados = {
      nome: carolForm.elements.nome.value.trim(),
      telefone: carolForm.elements.telefone.value.trim(),
      email: carolForm.elements.email.value.trim(),
      mensagem: carolForm.elements.mensagem.value.trim()
    };

    if (!ENDPOINT_FORMULARIO){
      const corpo = `Nome: ${dados.nome}\nTelefone: ${dados.telefone}\nE-mail: ${dados.email}\n\n${dados.mensagem}`;
      window.location.href = `mailto:${EMAIL_DESTINO}?subject=${encodeURIComponent("Contato pelo portfólio")}&body=${encodeURIComponent(corpo)}`;
      carolStatus.textContent = "Abrindo seu aplicativo de e-mail para enviar a mensagem 💌";
      return;
    }

    const botao = carolForm.querySelector(".carol-enviar");
    botao.disabled = true;
    try {
      const resposta = await fetch(ENDPOINT_FORMULARIO, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(dados)
      });
      if (!resposta.ok) throw new Error("falhou");
      carolForm.reset();
      carolStatus.textContent = "Mensagem enviada! Obrigada pelo contato 💌";
    } catch (err){
      carolStatus.textContent = "Não foi possível enviar agora. Tente de novo.";
    } finally {
      botao.disabled = false;
    }
  });

  carolForm.addEventListener("input", (e) => e.target.classList.remove("carol-invalido"));
});
