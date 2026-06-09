if (sessionStorage.getItem("epifaniaSampleAccess") !== "granted") {
  window.location.replace("index.html?muestra=requerida#contacto");
}

const printButton = document.querySelector("[data-print]");
const copyButtons = document.querySelectorAll("[data-copy-target]");

printButton.addEventListener("click", () => window.print());

copyButtons.forEach((button) => {
  button.addEventListener("click", async () => {
    const prompt = document.getElementById(button.dataset.copyTarget);
    if (!prompt) return;

    try {
      await navigator.clipboard.writeText(prompt.innerText);
      const originalText = button.textContent;
      button.textContent = "Prompt copiado";
      button.classList.add("copied");

      window.setTimeout(() => {
        button.textContent = originalText;
        button.classList.remove("copied");
      }, 1800);
    } catch {
      window.getSelection().selectAllChildren(prompt);
    }
  });
});
