const leadForm = document.querySelector(".lead-form");
const cards = document.querySelectorAll(".video-card");
const languageButtons = document.querySelectorAll("[data-lang]");
const currencyButtons = document.querySelectorAll("[data-currency]");
const priceElements = document.querySelectorAll("[data-price-plan]");
const interestSelect = document.querySelector('select[name="interest"]');
const interestChoiceLinks = document.querySelectorAll("[data-interest-choice]");

const prices = {
  usd: {
    founder: "US$29",
    regular: "US$49"
  },
  clp: {
    founder: "$29.990",
    regular: "$49.990"
  }
};

const translations = {
  es: {
    "meta.description": "Portal de epifania: prompts, guiones, respuestas y calendario para que pymes creen un mes de contenido para TikTok, Reels, Meta y WhatsApp en una tarde.",
    "nav.product": "Producto",
    "nav.audience": "Para quien",
    "nav.plans": "Planes",
    "nav.contact": "Contacto",
    "nav.cta": "Reservar preventa",
    "hero.eyebrow": "Prompts + estrategia + calendario para pymes",
    "hero.title": "Un mes de contenido para TikTok, Reels, Meta y WhatsApp en una tarde.",
    "hero.lead": "epifania convierte tu negocio, oferta y experiencia en ideas, guiones, captions, respuestas y llamadas a la accion listas para publicar o enviar. Sin partir de cero.",
    "hero.primary": "Reservar preventa",
    "hero.whatsapp": "Contactame por WhatsApp",
    "hero.secondary": "Ver ejemplo",
    "proof.days": "dias planificados",
    "proof.prompts": "prompts testeados",
    "proof.production": "de produccion guiada",
    "visual.card1.title": "El error que frena tus ventas en Instagram",
    "visual.card1.text": "Guion de 38 segundos con CTA a DM.",
    "visual.card2.title": "3 mitos sobre contratar una pyme local",
    "visual.card2.text": "Formato lista para Reels y Facebook.",
    "visual.save": "Guardar",
    "visual.comment": "Comentar",
    "visual.dm": "Enviar DM",
    "map.offer": "Oferta",
    "map.pain": "Dolor",
    "map.proof": "Prueba",
    "map.objection": "Objecion",
    "map.story": "Historia",
    "product.eyebrow": "La epifania del contenido",
    "product.title": "De \"no se que publicar\" a una maquina simple de contenidos.",
    "features.brand.title": "Diagnostico de marca",
    "features.brand.text": "Prompts para definir cliente ideal, tono, promesa, objeciones y temas que si conectan.",
    "features.ideas.title": "Ideas que venden",
    "features.ideas.text": "Tablas de contenido educativo, autoridad, historias, prueba social y venta suave.",
    "features.scripts.title": "Guiones cortos",
    "features.scripts.text": "Hooks, estructura, CTA y respuestas para videos, DMs y WhatsApp pensados para pymes.",
    "features.calendar.title": "Calendario mensual",
    "features.calendar.text": "Una plantilla para ordenar 30 piezas por objetivo, canal, formato y prioridad comercial.",
    "demo.eyebrow": "Ejemplo incluido",
    "demo.title": "Copias, pegas, ajustas tu negocio y la IA te devuelve un plan accionable.",
    "demo.text": "La guia no se queda en prompts sueltos: cada bloque tiene contexto, instrucciones y criterios para que el resultado salga usable.",
    "audience.eyebrow": "Hecho para vender con claridad",
    "audience.title": "Ideal para personas que tienen negocio, pero no tiempo para inventar contenido cada dia.",
    "audience.item1": "Emprendedores de servicios",
    "audience.item2": "Tiendas locales",
    "audience.item3": "Coaches y consultores",
    "audience.item4": "Profesionales independientes",
    "audience.item5": "Community managers",
    "audience.item6": "Infoproductores",
    "brand.eyebrow": "Imagen corporativa",
    "brand.title": "Una marca cercana, inteligente y comercial.",
    "brand.text": "epifania mezcla el momento de claridad de una epifania con el poder practico de la IA. El triskel representa movimiento, foco y expansion; un sistema que transforma claridad en contenido.",
    "swatches.night": "Noche",
    "swatches.clarity": "Claridad",
    "swatches.spark": "Destello",
    "swatches.paper": "Papel",
    "plans.eyebrow": "Preventa fundadores",
    "plans.title": "Entra hoy con precio fundador y crea 30 dias de contenido con un sistema guiado.",
    "plans.subtitle": "Buscamos a las primeras 20 pymes para implementar Epifania, recoger feedback y construir casos reales.",
    "plans.currency": "Moneda",
    "plans.founder.badge": "Solo 20 cupos",
    "plans.founder.title": "Epifania - Edicion Fundadores",
    "plans.regular": "Precio futuro",
    "plans.founder.item1": "Diagnostico guiado de negocio, cliente ideal, oferta y tono.",
    "plans.founder.item2": "Mas de 60 prompts explicados y biblioteca de hooks y CTA.",
    "plans.founder.item3": "Plantilla editable y calendario para 30 dias de contenido.",
    "plans.founder.item4": "Ejemplos completos para distintos tipos de negocio.",
    "plans.founder.item5": "Sesion grupal de implementacion y futuras actualizaciones.",
    "plans.founder.cta": "Reservar mi cupo fundador",
    "plans.founder.guarantee": "Garantia de devolucion durante 7 dias despues de recibir el material.",
    "plans.sample.badge": "Muestra gratuita",
    "plans.sample.title": "Prueba primero la metodologia",
    "plans.sample.text": "Recibe 5 prompts estrategicos para generar 7 dias de contenido y comprobar la calidad antes de comprar.",
    "plans.sample.cta": "Quiero la muestra gratuita",
    "plans.custom.title": "Necesitas que lo hagamos contigo?",
    "plans.custom.text": "La implementacion personalizada se cotiza por conversacion.",
    "plans.custom.cta": "Cotizar por WhatsApp",
    "contact.eyebrow": "Preventa",
    "contact.title": "Reserva uno de los 20 cupos fundadores.",
    "contact.text": "Deja tus datos para coordinar el pago y recibir la fecha de entrega. Tambien puedes pedir primero la muestra gratuita.",
    "contact.whatsapp": "Contactame por WhatsApp",
    "form.name": "Nombre",
    "form.namePlaceholder": "Tu nombre",
    "form.email": "Email",
    "form.business": "Tipo de negocio",
    "form.option1": "Servicios profesionales",
    "form.option2": "Tienda o pyme local",
    "form.option3": "Marca personal",
    "form.option4": "Community manager",
    "form.interest": "Me interesa",
    "form.interestFounder": "Reservar Edicion Fundadores",
    "form.interestSample": "Recibir muestra gratuita",
    "form.interestCustom": "Cotizar implementacion personalizada",
    "form.submit": "Solicitar mi cupo",
    "form.sent": "Solicitud recibida",
    "form.note": "No se realizara ningun cobro al enviar este formulario.",
    "footer.text": "Prompts con estrategia para pymes que necesitan publicar y vender."
  },
  en: {
    "meta.description": "epifania portal: prompts, scripts, and calendars so small businesses can create a month of TikTok, Reels, and Meta content in one afternoon.",
    "nav.product": "Product",
    "nav.audience": "For whom",
    "nav.plans": "Plans",
    "nav.contact": "Contact",
    "nav.cta": "Reserve presale",
    "hero.eyebrow": "Prompts + strategy + calendar for small businesses",
    "hero.title": "A month of TikTok, Reels, Meta, and WhatsApp content in one afternoon.",
    "hero.lead": "epifania turns your business, offer, and experience into ideas, scripts, captions, replies, and calls to action ready to publish or send. No blank page.",
    "hero.primary": "Reserve presale",
    "hero.whatsapp": "Contact me on WhatsApp",
    "hero.secondary": "See example",
    "proof.days": "planned days",
    "proof.prompts": "tested prompts",
    "proof.production": "of guided production",
    "visual.card1.title": "The mistake slowing down your Instagram sales",
    "visual.card1.text": "38-second script with a DM CTA.",
    "visual.card2.title": "3 myths about hiring a local business",
    "visual.card2.text": "List format for Reels and Facebook.",
    "visual.save": "Save",
    "visual.comment": "Comment",
    "visual.dm": "Send DM",
    "map.offer": "Offer",
    "map.pain": "Pain",
    "map.proof": "Proof",
    "map.objection": "Objection",
    "map.story": "Story",
    "product.eyebrow": "The content epiphany",
    "product.title": "From \"I do not know what to post\" to a simple content machine.",
    "features.brand.title": "Brand diagnosis",
    "features.brand.text": "Prompts to define your ideal customer, tone, promise, objections, and topics that actually connect.",
    "features.ideas.title": "Ideas that sell",
    "features.ideas.text": "Tables for educational content, authority, stories, social proof, and soft selling.",
    "features.scripts.title": "Short scripts",
    "features.scripts.text": "Hooks, structure, CTAs, and replies for videos, DMs, and WhatsApp designed for small businesses.",
    "features.calendar.title": "Monthly calendar",
    "features.calendar.text": "A template to organize 30 pieces by goal, channel, format, and commercial priority.",
    "demo.eyebrow": "Included example",
    "demo.title": "Copy, paste, adjust your business, and AI returns an actionable plan.",
    "demo.text": "The guide goes beyond loose prompts: every block includes context, instructions, and quality criteria so the output is actually usable.",
    "audience.eyebrow": "Built to sell with clarity",
    "audience.title": "Ideal for people with a business, but no time to invent content every day.",
    "audience.item1": "Service entrepreneurs",
    "audience.item2": "Local stores",
    "audience.item3": "Coaches and consultants",
    "audience.item4": "Independent professionals",
    "audience.item5": "Community managers",
    "audience.item6": "Infoproduct creators",
    "brand.eyebrow": "Corporate image",
    "brand.title": "A close, intelligent, commercial brand.",
    "brand.text": "epifania combines the clarity of an epiphany with the practical power of AI. The triskel represents motion, focus, and expansion: a system that turns clarity into content.",
    "swatches.night": "Night",
    "swatches.clarity": "Clarity",
    "swatches.spark": "Spark",
    "swatches.paper": "Paper",
    "plans.eyebrow": "Founders presale",
    "plans.title": "Join today at the founder price and create 30 days of content with a guided system.",
    "plans.subtitle": "We are looking for the first 20 small businesses to implement Epifania, share feedback, and build real cases.",
    "plans.currency": "Currency",
    "plans.founder.badge": "Only 20 spots",
    "plans.founder.title": "Epifania - Founders Edition",
    "plans.regular": "Future price",
    "plans.founder.item1": "Guided diagnosis of your business, ideal customer, offer, and tone.",
    "plans.founder.item2": "More than 60 explained prompts plus a hook and CTA library.",
    "plans.founder.item3": "Editable template and calendar for 30 days of content.",
    "plans.founder.item4": "Complete examples for different types of businesses.",
    "plans.founder.item5": "Group implementation session and future updates.",
    "plans.founder.cta": "Reserve my founder spot",
    "plans.founder.guarantee": "7-day refund guarantee after receiving the material.",
    "plans.sample.badge": "Free sample",
    "plans.sample.title": "Try the method first",
    "plans.sample.text": "Get 5 strategic prompts to generate 7 days of content and check the quality before buying.",
    "plans.sample.cta": "Get the free sample",
    "plans.custom.title": "Need us to do it with you?",
    "plans.custom.text": "Custom implementation is quoted through a conversation.",
    "plans.custom.cta": "Get a WhatsApp quote",
    "contact.eyebrow": "Presale",
    "contact.title": "Reserve one of the 20 founder spots.",
    "contact.text": "Leave your details to coordinate payment and receive the delivery date. You can also request the free sample first.",
    "contact.whatsapp": "Contact me on WhatsApp",
    "form.name": "Name",
    "form.namePlaceholder": "Your name",
    "form.email": "Email",
    "form.business": "Business type",
    "form.option1": "Professional services",
    "form.option2": "Local store or small business",
    "form.option3": "Personal brand",
    "form.option4": "Community manager",
    "form.interest": "I am interested in",
    "form.interestFounder": "Reserving the Founders Edition",
    "form.interestSample": "Receiving the free sample",
    "form.interestCustom": "Getting a custom implementation quote",
    "form.submit": "Request my spot",
    "form.sent": "Request received",
    "form.note": "You will not be charged when submitting this form.",
    "footer.text": "Strategic prompts for small businesses that need to publish and sell."
  }
};

let activeCard = 0;
let currentLanguage = "es";
let currentCurrency = "clp";

function setText(selector, key) {
  const element = document.querySelector(selector);
  const value = translations[currentLanguage][key];
  if (element && value) element.textContent = value;
}

function applyLanguage(language) {
  currentLanguage = translations[language] ? language : "es";
  localStorage.setItem("epifaniaLanguage", currentLanguage);
  document.documentElement.lang = currentLanguage;
  document.title = currentLanguage === "es"
    ? "epifania | 30 dias de contenido con IA para pymes"
    : "epifania | 30 days of AI content for small businesses";

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.dataset.i18n;
    const value = translations[currentLanguage][key];
    if (!value) return;
    if (element.matches(".lead-form button") && element.disabled) {
      element.textContent = translations[currentLanguage]["form.sent"];
    } else {
      element.textContent = value;
    }
  });

  document.querySelectorAll("[data-i18n-attr]").forEach((element) => {
    const [attribute, key] = element.dataset.i18nAttr.split(":");
    const value = translations[currentLanguage][key];
    if (attribute && value) element.setAttribute(attribute, value);
  });

  languageButtons.forEach((button) => {
    const isActive = button.dataset.lang === currentLanguage;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  setText("#producto .eyebrow", "product.eyebrow");
  setText("#producto h2", "product.title");
  setText("#producto .feature-card:nth-child(1) h3", "features.brand.title");
  setText("#producto .feature-card:nth-child(1) p", "features.brand.text");
  setText("#producto .feature-card:nth-child(2) h3", "features.ideas.title");
  setText("#producto .feature-card:nth-child(2) p", "features.ideas.text");
  setText("#producto .feature-card:nth-child(3) h3", "features.scripts.title");
  setText("#producto .feature-card:nth-child(3) p", "features.scripts.text");
  setText("#producto .feature-card:nth-child(4) h3", "features.calendar.title");
  setText("#producto .feature-card:nth-child(4) p", "features.calendar.text");
  setText(".swatches span:nth-child(1)", "swatches.night");
  setText(".swatches span:nth-child(2)", "swatches.clarity");
  setText(".swatches span:nth-child(3)", "swatches.spark");
  setText(".swatches span:nth-child(4)", "swatches.paper");
}

function applyCurrency(currency) {
  currentCurrency = prices[currency] ? currency : "usd";

  priceElements.forEach((element) => {
    const plan = element.dataset.pricePlan;
    const value = prices[currentCurrency][plan];
    if (value) element.textContent = value;
  });

  currencyButtons.forEach((button) => {
    const isActive = button.dataset.currency === currentCurrency;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
}

setInterval(() => {
  cards[activeCard].classList.remove("active");
  activeCard = (activeCard + 1) % cards.length;
  cards[activeCard].classList.add("active");
}, 2600);

languageButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const language = button.dataset.lang;
    applyLanguage(language);
    applyCurrency(language === "en" ? "usd" : "clp");
  });
});

currencyButtons.forEach((button) => {
  button.addEventListener("click", () => applyCurrency(button.dataset.currency));
});

interestChoiceLinks.forEach((link) => {
  link.addEventListener("click", () => {
    interestSelect.value = link.dataset.interestChoice;
  });
});

leadForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const button = leadForm.querySelector("button");
  button.textContent = translations[currentLanguage]["form.sent"];
  button.disabled = true;

  if (interestSelect.value === "sample") {
    sessionStorage.setItem("epifaniaSampleAccess", "granted");
    window.setTimeout(() => {
      window.location.href = "muestra-gratuita.html";
    }, 450);
  }
});

applyLanguage(localStorage.getItem("epifaniaLanguage") || currentLanguage);
applyCurrency(currentLanguage === "en" ? "usd" : "clp");

if (new URLSearchParams(window.location.search).get("muestra") === "requerida") {
  interestSelect.value = "sample";
}
