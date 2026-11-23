const WHATSAPP_NUMBER = "56993132750";

const cards = [...document.querySelectorAll(".video-card")];
const sampleLinks = document.querySelectorAll("[data-sample-access]");
const interestChoiceLinks = document.querySelectorAll("[data-interest-choice]");
const leadForm = document.querySelector(".lead-form");
const interestSelect = leadForm?.querySelector('select[name="interest"]');
const submitButton = leadForm?.querySelector('button[type="submit"]');
const formNote = leadForm?.querySelector(".form-note");

let activeCard = 0;

if (cards.length > 1) {
  window.setInterval(() => {
    cards[activeCard].classList.remove("active");
    activeCard = (activeCard + 1) % cards.length;
    cards[activeCard].classList.add("active");
  }, 3200);
}

sampleLinks.forEach((link) => {
  link.addEventListener("click", () => {
    sessionStorage.setItem("epifaniaSampleAccess", "granted");
  });
});

interestChoiceLinks.forEach((link) => {
  link.addEventListener("click", () => {
    if (!interestSelect) return;
    interestSelect.value = link.dataset.interestChoice;
    updateFormAction();
  });
});

function updateFormAction() {
  if (!interestSelect || !submitButton || !formNote) return;

  if (interestSelect.value === "sample") {
    submitButton.textContent = "Abrir muestra gratuita";
    formNote.textContent = "La muestra se abrirá inmediatamente en este navegador.";
    return;
  }

  submitButton.textContent = "Continuar por WhatsApp";
  formNote.textContent = "No guardamos estos datos en el sitio. Se usarán para preparar tu mensaje de WhatsApp.";
}

interestSelect?.addEventListener("change", updateFormAction);

leadForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!leadForm.checkValidity()) {
    leadForm.reportValidity();
    return;
  }

  if (interestSelect.value === "sample") {
    sessionStorage.setItem("epifaniaSampleAccess", "granted");
    window.location.href = "muestra-gratuita.html";
    return;
  }

  const data = new FormData(leadForm);
  const interestLabel = interestSelect.options[interestSelect.selectedIndex].text;
  const channel = String(data.get("channel") || "").trim() || "No indicado";
  const message = [
    "Hola, quiero conversar sobre Epifania.",
    "",
    `Nombre: ${String(data.get("name")).trim()}`,
    `Servicio: ${String(data.get("business")).trim()}`,
    `Instagram o web: ${channel}`,
    `Interés: ${interestLabel}`,
    `Desafío actual: ${String(data.get("challenge")).trim()}`
  ].join("\n");

  window.location.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
});

if (new URLSearchParams(window.location.search).get("muestra") === "requerida" && interestSelect) {
  interestSelect.value = "sample";
  updateFormAction();
}

updateFormAction();
