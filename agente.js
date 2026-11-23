const MODELS = [
  {
    id: "epifania-auto",
    name: "Epifania Auto",
    provider: "Recomendado",
    logo: "E",
    description: "Elige el equilibrio adecuado entre calidad, velocidad y costo.",
    recommended: true
  },
  {
    id: "gpt-4.1-mini",
    name: "GPT-4.1 mini",
    provider: "OpenAI",
    logo: "O",
    description: "Rápido y versátil para idear, redactar y reorganizar contenido."
  },
  {
    id: "claude-haiku-4.5",
    name: "Claude Haiku 4.5",
    provider: "Anthropic",
    logo: "A",
    description: "Respuestas claras y cuidadosas, ideal para edición de textos."
  },
  {
    id: "gemini-2.5-flash",
    name: "Gemini 2.5 Flash",
    provider: "Google",
    logo: "G",
    description: "Contexto amplio y respuesta ágil para analizar información."
  },
  {
    id: "mai-code-2",
    name: "MAI Code 2",
    provider: "Microsoft AI",
    logo: "M",
    description: "Útil para proyectos que combinan estrategia con implementación."
  }
];

const AGENT_INSTRUCTIONS = [
  "Eres el Agente Epifania, especializado en estrategia de contenido para profesionales y negocios de servicios.",
  "Ayuda a convertir experiencia real, oferta, objeciones y hechos verificables en contenido útil que abra conversaciones comerciales.",
  "No inventes cifras, testimonios, resultados ni escasez.",
  "Haz preguntas concretas cuando falte contexto antes de redactar una pieza completa.",
  "Responde en el idioma de la persona y prioriza claridad, honestidad y un siguiente paso específico."
].join(" ");

const STORAGE = {
  chats: "epifaniaAgentChats",
  selectedModel: "epifaniaAgentModel",
  mode: "epifaniaAgentMode",
  endpoint: "epifaniaAgentEndpoint"
};

const chatForm = document.querySelector("[data-chat-form]");
const promptInput = document.querySelector("[data-prompt]");
const sendButton = document.querySelector("[data-send]");
const conversation = document.querySelector("[data-conversation]");
const messageList = document.querySelector("[data-message-list]");
const welcome = document.querySelector("[data-welcome]");
const chatTitle = document.querySelector("[data-chat-title]");
const history = document.querySelector("[data-chat-history]");
const modelDialog = document.querySelector("[data-model-dialog]");
const modelList = document.querySelector("[data-model-list]");
const settingsDialog = document.querySelector("[data-settings-dialog]");
const settingsForm = document.querySelector("[data-settings-form]");
const modeInput = document.querySelector("[data-connection-mode]");
const endpointInput = document.querySelector("[data-endpoint-url]");
const endpointField = document.querySelector("[data-endpoint-field]");
const connectionState = document.querySelector("[data-connection-state]");
const attachmentInput = document.querySelector("[data-attachment]");
const attachmentChip = document.querySelector("[data-attachment-chip]");
const attachmentName = document.querySelector("[data-attachment-name]");
const toast = document.querySelector("[data-toast]");

let chats = readStorage(STORAGE.chats, []);
let activeChatId = null;
let selectedModel = localStorage.getItem(STORAGE.selectedModel) || MODELS[0].id;
let connectionMode = localStorage.getItem(STORAGE.mode) || "demo";
let endpointUrl = localStorage.getItem(STORAGE.endpoint) || "/api/chat";
let pendingAttachment = null;
let isResponding = false;
let toastTimeout;

if (!MODELS.some((model) => model.id === selectedModel)) selectedModel = MODELS[0].id;
if (!["demo", "live"].includes(connectionMode)) connectionMode = "demo";

function readStorage(key, fallback) {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    return value ?? fallback;
  } catch {
    return fallback;
  }
}

function persistChats() {
  localStorage.setItem(STORAGE.chats, JSON.stringify(chats));
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatMessage(value) {
  const escaped = escapeHtml(value);
  const lines = escaped.split("\n");
  let html = "";
  let listType = null;
  let inCode = false;
  let codeLines = [];

  const closeList = () => {
    if (!listType) return;
    html += `</${listType}>`;
    listType = null;
  };

  lines.forEach((line) => {
    if (line.trim().startsWith("```")) {
      if (inCode) {
        html += `<pre><code>${codeLines.join("\n")}</code></pre>`;
        codeLines = [];
        inCode = false;
      } else {
        closeList();
        inCode = true;
      }
      return;
    }

    if (inCode) {
      codeLines.push(line);
      return;
    }

    const unordered = line.match(/^[-•]\s+(.+)/);
    const ordered = line.match(/^\d+\.\s+(.+)/);
    if (unordered || ordered) {
      const nextListType = unordered ? "ul" : "ol";
      if (listType !== nextListType) {
        closeList();
        listType = nextListType;
        html += `<${listType}>`;
      }
      html += `<li>${inlineFormat((unordered || ordered)[1])}</li>`;
      return;
    }

    closeList();
    if (!line.trim()) return;
    html += `<p>${inlineFormat(line)}</p>`;
  });

  closeList();
  if (inCode && codeLines.length) html += `<pre><code>${codeLines.join("\n")}</code></pre>`;
  return html;
}

function inlineFormat(value) {
  return value
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/`([^`]+)`/g, "<code>$1</code>");
}

function currentModel() {
  return MODELS.find((model) => model.id === selectedModel) || MODELS[0];
}

function activeChat() {
  return chats.find((chat) => chat.id === activeChatId) || null;
}

function newId() {
  return typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : `chat-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function createChat() {
  activeChatId = newId();
  const chat = {
    id: activeChatId,
    title: "Nueva estrategia",
    createdAt: Date.now(),
    updatedAt: Date.now(),
    messages: []
  };
  chats.unshift(chat);
  persistChats();
  render();
  closeSidebar();
  promptInput.focus();
}

function render() {
  renderModel();
  renderHistory();
  renderMessages();
  renderConnection();
}

function renderModel() {
  const model = currentModel();
  document.querySelectorAll("[data-current-model]").forEach((element) => {
    element.textContent = model.name;
  });
  document.querySelectorAll("[data-model-logo]").forEach((element) => {
    element.textContent = model.logo;
  });
  modelList.innerHTML = MODELS.map((item) => `
    <button class="model-option ${item.id === selectedModel ? "selected" : ""}" type="button" data-model-id="${item.id}">
      <span class="model-logo">${item.logo}</span>
      <span>
        <strong>${item.name} · ${item.provider}</strong>
        <small>${item.description}</small>
      </span>
      ${item.id === selectedModel
        ? '<iconify-icon icon="lucide:check" aria-hidden="true"></iconify-icon>'
        : item.recommended
          ? '<span class="recommended">Sugerido</span>'
          : ""}
    </button>
  `).join("");
}

function renderHistory() {
  if (!chats.length) {
    history.innerHTML = '<p class="history-empty">Tus conversaciones aparecerán aquí.</p>';
    return;
  }

  history.innerHTML = chats
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .map((chat) => `
      <button class="history-item ${chat.id === activeChatId ? "active" : ""}" type="button" data-chat-id="${chat.id}">
        <iconify-icon icon="lucide:message-square" aria-hidden="true"></iconify-icon>
        <span>${escapeHtml(chat.title)}</span>
      </button>
    `).join("");
}

function renderMessages() {
  const chat = activeChat();
  if (!chat || chat.messages.length === 0) {
    welcome.hidden = false;
    messageList.innerHTML = "";
    chatTitle.textContent = chat?.title || "Nueva estrategia";
    return;
  }

  welcome.hidden = true;
  chatTitle.textContent = chat.title;
  messageList.innerHTML = chat.messages.map((message) => {
    if (message.role === "user") {
      return `
        <article class="message user">
          <div class="message-body">
            <div class="message-content">${formatMessage(message.content)}</div>
          </div>
        </article>
      `;
    }

    return `
      <article class="message assistant">
        <span class="message-avatar"><img src="assets/epifania-mark.svg" alt=""></span>
        <div class="message-body">
          <div class="message-meta">Agente Epifania <span>${escapeHtml(message.model || currentModel().name)}</span></div>
          <div class="message-content">${message.error ? `<div class="message-error"><iconify-icon icon="lucide:circle-alert" aria-hidden="true"></iconify-icon><span>${formatMessage(message.content)}</span></div>` : formatMessage(message.content)}</div>
        </div>
      </article>
    `;
  }).join("");
  scrollConversation();
}

function renderConnection() {
  const isLive = connectionMode === "live";
  connectionState.classList.toggle("live", isLive);
  connectionState.querySelector("strong").textContent = isLive ? "Endpoint configurado" : "Modo demostración";
  connectionState.querySelector("small").textContent = isLive ? endpointUrl : "Las respuestas se generan localmente";
  endpointField.hidden = !isLive;
}

function scrollConversation() {
  requestAnimationFrame(() => {
    conversation.scrollTop = conversation.scrollHeight;
  });
}

function addTypingMessage() {
  messageList.insertAdjacentHTML("beforeend", `
    <article class="message assistant" data-typing>
      <span class="message-avatar"><img src="assets/epifania-mark.svg" alt=""></span>
      <div class="message-body">
        <div class="message-meta">Agente Epifania <span>${escapeHtml(currentModel().name)}</span></div>
        <div class="typing-indicator" aria-label="Escribiendo"><span></span><span></span><span></span></div>
      </div>
    </article>
  `);
  scrollConversation();
}

function removeTypingMessage() {
  messageList.querySelector("[data-typing]")?.remove();
}

async function submitMessage(value) {
  const text = value.trim();
  if (!text || isResponding) return;

  if (!activeChat()) createChat();
  const chat = activeChat();
  const model = currentModel();
  const attachment = pendingAttachment;
  const displayText = attachment ? `${text}\n\n**Archivo adjunto:** ${attachment.name}` : text;
  const apiText = attachment
    ? `${text}\n\n[ARCHIVO: ${attachment.name}]\n${attachment.content}`
    : text;

  chat.messages.push({ role: "user", content: displayText, apiContent: apiText });
  if (chat.messages.filter((message) => message.role === "user").length === 1) {
    chat.title = text.replace(/\s+/g, " ").slice(0, 44);
  }
  chat.updatedAt = Date.now();
  pendingAttachment = null;
  attachmentChip.hidden = true;
  attachmentInput.value = "";
  promptInput.value = "";
  resizePrompt();
  isResponding = true;
  sendButton.disabled = true;
  renderMessages();
  renderHistory();
  addTypingMessage();

  try {
    const response = connectionMode === "live"
      ? await requestEndpoint(chat, model.id)
      : await demoResponse(text, model.name);
    chat.messages.push({ role: "assistant", content: response, model: model.name });
  } catch (error) {
    chat.messages.push({
      role: "assistant",
      model: model.name,
      error: true,
      content: `No pude obtener una respuesta del endpoint.\n\n${error.message}\n\nRevisa la URL en **Configurar conexión** o vuelve al modo de demostración.`
    });
  } finally {
    isResponding = false;
    sendButton.disabled = false;
    chat.updatedAt = Date.now();
    persistChats();
    removeTypingMessage();
    renderMessages();
    renderHistory();
  }
}

async function requestEndpoint(chat, model) {
  if (!endpointUrl) throw new Error("La URL del endpoint está vacía.");

  const response = await fetch(endpointUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      system: AGENT_INSTRUCTIONS,
      messages: chat.messages.map((message) => ({
        role: message.role,
        content: message.apiContent || message.content
      }))
    })
  });

  let payload = null;
  try {
    payload = await response.json();
  } catch {
    throw new Error(`El servidor respondió con HTTP ${response.status}, pero no devolvió JSON válido.`);
  }

  if (!response.ok) throw new Error(payload.error || `El servidor respondió con HTTP ${response.status}.`);
  const message = payload.message || payload.content;
  if (typeof message !== "string" || !message.trim()) {
    throw new Error("La respuesta debe incluir una propiedad `message` o `content` con texto.");
  }
  return message;
}

async function demoResponse(prompt, modelName) {
  await new Promise((resolve) => window.setTimeout(resolve, 650));
  const lowerPrompt = prompt.toLowerCase();

  if (lowerPrompt.includes("calendario") || lowerPrompt.includes("7 días") || lowerPrompt.includes("plan semanal")) {
    return `Sí. Para diseñar un calendario que realmente sirva a ventas, necesito partir de lo concreto.\n\n**Antes de crear las piezas, responde estas cuatro preguntas:**\n1. ¿Qué servicio ofreces y cuál es el resultado práctico que ayudas a conseguir?\n2. ¿Quién es el cliente ideal y qué suele preguntarte antes de comprar?\n3. ¿Qué prueba, experiencia o proceso puedes mostrar sin inventar resultados?\n4. ¿Cuál es tu tono y cuál es el siguiente paso comercial?\n\nCuando me compartas eso, te entregaré:\n- Una idea por cada día de la semana.\n- Objetivo comercial, formato, hook y CTA.\n- Tres piezas educativas, una historia, una prueba, una objeción y una oferta.\n- Un checklist de 60 segundos para revisar antes de publicar.\n\n**Modelo activo:** ${modelName}.`;
  }

  if (lowerPrompt.includes("objeción") || lowerPrompt.includes("precio")) {
    return `La forma más útil de responder una objeción es aclarar **para quién conviene** tu oferta, no intentar vencer a la persona.\n\n**Estructura recomendada**\n1. Repite la preocupación con palabras reales y sin minimizarla.\n2. Explica qué incluye el precio y qué no.\n3. Nombra cuándo tu alternativa sí es adecuada.\n4. Nombra con honestidad cuándo no lo es.\n5. Cierra con una pregunta que ayude a decidir.\n\n**Borrador adaptable**\n“Entiendo que el precio sea una parte importante de tu decisión. Si buscas solo una solución rápida, quizá hay alternativas más simples. Nuestro servicio está pensado para [CLIENTE IDEAL], especialmente cuando necesita [SITUACIÓN]. Antes de recomendarte nada, prefiero entender [PREGUNTA CLAVE]. ¿Te cuento qué incluye y comparamos si encaja contigo?”\n\nComparte la objeción exacta que recibes y completaré las variables con tu negocio.`;
  }

  if (lowerPrompt.includes("guion") || lowerPrompt.includes("video") || lowerPrompt.includes("historia")) {
    return `Podemos construir un guion desde una historia real sin convertirla en motivación genérica.\n\n**Guion de 45 segundos**\n**0–5 s · Hook:** “Este cambio empezó cuando dejamos de hacer lo obvio.”\n**5–16 s · Antes:** Describe una situación real y la frustración del cliente.\n**16–28 s · Momento de claridad:** Cuenta qué viste o entendiste.\n**28–39 s · Cambio:** Explica qué hiciste diferente y cómo funciona.\n**39–45 s · Cierre:** Ofrece una pregunta útil relacionada con la historia.\n\nPara personalizarlo, envíame:\n- La situación real.\n- Qué ocurrió antes.\n- Qué cambiaste.\n- Una conclusión que un cliente pueda aplicar.\n\nNo agregaré cifras ni resultados que no estén en los hechos que compartas.`;
  }

  if (lowerPrompt.includes("oferta") || lowerPrompt.includes("posicionamiento") || lowerPrompt.includes("público")) {
    return `Vamos a definir una oferta legible antes de producir contenido. Completa esta frase:\n\n> Ayudo a **[cliente específico]** que quiere **[resultado]**, pero hoy enfrenta **[problema real]**. Lo hacemos mediante **[método]**, con **[prueba o diferenciador]**, para que pueda **[cambio práctico]**.\n\nLuego comprobaremos cuatro criterios:\n1. ¿El cliente se reconoce en la situación?\n2. ¿El resultado depende de tu servicio?\n3. ¿Puedes demostrarlo con hechos?\n4. ¿El siguiente paso es claro y de bajo riesgo?\n\nDime qué vendes y a quién; te ayudaré a completar y revisar la frase.`;
  }

  return `Puedo ayudarte a convertir esa petición en una pieza clara y útil.\n\nPara evitar un resultado genérico, primero completaré una ficha breve:\n\n- **Negocio:** ¿qué vendes exactamente?\n- **Cliente ideal:** ¿quién necesita esta solución?\n- **Situación:** ¿qué problema, pregunta u objeción quieres resolver?\n- **Prueba:** ¿qué experiencia o proceso real puedes mostrar?\n- **Objetivo:** ¿quieres educar, generar confianza o abrir una conversación comercial?\n- **Formato:** publicación, guion, WhatsApp, historia o calendario.\n\nResponde con lo que ya tengas. Si falta algo, te haré una pregunta concreta antes de redactar.`;
}

function resizePrompt() {
  promptInput.style.height = "auto";
  promptInput.style.height = `${Math.min(promptInput.scrollHeight, 180)}px`;
}

function selectModel(modelId) {
  if (!MODELS.some((model) => model.id === modelId)) return;
  selectedModel = modelId;
  localStorage.setItem(STORAGE.selectedModel, selectedModel);
  renderModel();
  closeModelDialog();
  showToast(`Modelo seleccionado: ${currentModel().name}`);
}

function openModelDialog(event) {
  const trigger = event.currentTarget;
  document.querySelectorAll("[data-model-trigger]").forEach((button) => {
    button.setAttribute("aria-expanded", String(button === trigger));
  });
  modelDialog.showModal();
}

function closeModelDialog() {
  modelDialog.close();
  document.querySelectorAll("[data-model-trigger]").forEach((button) => {
    button.setAttribute("aria-expanded", "false");
  });
}

function openSettings() {
  modeInput.value = connectionMode;
  endpointInput.value = endpointUrl;
  renderConnection();
  closeSidebar();
  settingsDialog.showModal();
}

function openSidebar() {
  document.querySelector(".sidebar").classList.add("open");
  document.querySelector("[data-sidebar-backdrop]").classList.add("visible");
}

function closeSidebar() {
  document.querySelector(".sidebar").classList.remove("open");
  document.querySelector("[data-sidebar-backdrop]").classList.remove("visible");
}

function showToast(message) {
  window.clearTimeout(toastTimeout);
  toast.textContent = message;
  toast.classList.add("visible");
  toastTimeout = window.setTimeout(() => toast.classList.remove("visible"), 2200);
}

function exportChat() {
  const chat = activeChat();
  if (!chat || !chat.messages.length) {
    showToast("Primero escribe un mensaje para exportar.");
    return;
  }

  const content = [
    `# ${chat.title}`,
    "",
    ...chat.messages.map((message) => `## ${message.role === "user" ? "Tú" : "Agente Epifania"}\n\n${message.content}`),
    "",
    `_Exportado desde Epifania el ${new Date().toLocaleString("es-CL")}._`
  ].join("\n");
  const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${chat.title.toLowerCase().replace(/[^a-z0-9áéíóúñ]+/gi, "-").replace(/^-|-$/g, "") || "conversacion"}.md`;
  link.click();
  URL.revokeObjectURL(url);
  showToast("Conversación exportada.");
}

document.querySelectorAll("[data-new-chat]").forEach((button) => {
  button.addEventListener("click", createChat);
});

document.querySelectorAll("[data-model-trigger]").forEach((button) => {
  button.addEventListener("click", openModelDialog);
});

document.querySelectorAll("[data-suggestion]").forEach((button) => {
  button.addEventListener("click", () => {
    promptInput.value = button.dataset.suggestion;
    resizePrompt();
    promptInput.focus();
  });
});

document.querySelector("[data-close-model]").addEventListener("click", closeModelDialog);
document.querySelector("[data-open-settings]").addEventListener("click", openSettings);
document.querySelectorAll("[data-close-settings]").forEach((button) => {
  button.addEventListener("click", () => settingsDialog.close());
});
document.querySelector("[data-sidebar-open]").addEventListener("click", openSidebar);
document.querySelector("[data-sidebar-close]").addEventListener("click", closeSidebar);
document.querySelector("[data-sidebar-backdrop]").addEventListener("click", closeSidebar);
document.querySelector("[data-export-chat]").addEventListener("click", exportChat);

document.querySelector("[data-clear-history]").addEventListener("click", () => {
  if (!chats.length) return;
  if (!window.confirm("¿Eliminar todas las conversaciones guardadas en este navegador?")) return;
  chats = [];
  persistChats();
  createChat();
  showToast("Historial eliminado.");
});

modelList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-model-id]");
  if (button) selectModel(button.dataset.modelId);
});

history.addEventListener("click", (event) => {
  const button = event.target.closest("[data-chat-id]");
  if (!button) return;
  activeChatId = button.dataset.chatId;
  render();
  closeSidebar();
});

modelDialog.addEventListener("click", (event) => {
  if (event.target === modelDialog) closeModelDialog();
});

modelDialog.addEventListener("close", () => {
  document.querySelectorAll("[data-model-trigger]").forEach((button) => {
    button.setAttribute("aria-expanded", "false");
  });
});

settingsDialog.addEventListener("click", (event) => {
  if (event.target === settingsDialog) settingsDialog.close();
});

modeInput.addEventListener("change", () => {
  endpointField.hidden = modeInput.value !== "live";
});

settingsForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const nextMode = modeInput.value;
  const nextEndpoint = endpointInput.value.trim();
  if (nextMode === "live" && !nextEndpoint) {
    endpointInput.focus();
    return;
  }

  if (nextEndpoint && !nextEndpoint.startsWith("/") && !/^https?:\/\//i.test(nextEndpoint)) {
    showToast("Usa una URL http, https o una ruta relativa.");
    endpointInput.focus();
    return;
  }

  connectionMode = nextMode;
  endpointUrl = nextEndpoint || "/api/chat";
  localStorage.setItem(STORAGE.mode, connectionMode);
  localStorage.setItem(STORAGE.endpoint, endpointUrl);
  renderConnection();
  settingsDialog.close();
  showToast(connectionMode === "live" ? "Endpoint configurado." : "Modo demostración activado.");
});

promptInput.addEventListener("input", resizePrompt);
promptInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    chatForm.requestSubmit();
  }
});

chatForm.addEventListener("submit", (event) => {
  event.preventDefault();
  submitMessage(promptInput.value);
});

attachmentInput.addEventListener("change", async () => {
  const [file] = attachmentInput.files;
  if (!file) return;
  if (file.size > 100000) {
    showToast("El archivo debe pesar menos de 100 KB.");
    attachmentInput.value = "";
    return;
  }

  try {
    pendingAttachment = { name: file.name, content: await file.text() };
    attachmentName.textContent = file.name;
    attachmentChip.hidden = false;
  } catch {
    showToast("No se pudo leer el archivo.");
    attachmentInput.value = "";
  }
});

document.querySelector("[data-remove-attachment]").addEventListener("click", () => {
  pendingAttachment = null;
  attachmentInput.value = "";
  attachmentChip.hidden = true;
});

if (chats.length) {
  activeChatId = chats[0].id;
} else {
  createChat();
}
render();
resizePrompt();
