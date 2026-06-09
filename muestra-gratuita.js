if (sessionStorage.getItem("epifaniaSampleAccess") !== "granted") {
  window.location.replace("index.html?muestra=requerida#contacto");
}

const printButton = document.querySelector("[data-print]");
const copyButtons = document.querySelectorAll("[data-copy-target]");
const languageButtons = document.querySelectorAll("[data-lang]");

const groups = [
  { selector: "[data-print]", en: ["Save as PDF"] },
  { selector: ".cover .eyebrow", en: ["Free sample"] },
  { selector: ".cover h1", en: ["5 strategic prompts to create 7 days of content"] },
  { selector: ".cover .lead", en: ["A mini guide to stop improvising, turn what you know into useful content, and bring your followers closer to a sales conversation."] },
  { selector: ".result-row span", html: true, en: ["<strong>5</strong> ready-to-use prompts", "<strong>7</strong> planned days", "<strong>1</strong> visible offer"] },
  { selector: ".cover-card > *", en: ["By the end you will have", "A weekly calendar with ideas, scripts, captions, and calls to action.", "Estimated time: 45 to 60 minutes."] },
  { selector: ".intro > div:first-child > *", html: true, en: ["Before you begin", "Complete one business brief", "Prompts work best when AI receives specific context. Complete this brief and paste it whenever you see <strong>[BUSINESS BRIEF]</strong>."] },
  { selector: ".business-sheet p", html: true, en: [
    "<strong>Business:</strong> What you sell and to whom.",
    "<strong>Ideal customer:</strong> Who buys, what they want, and what concerns them.",
    "<strong>Main offer:</strong> The service or product you want to promote this week.",
    "<strong>Differentiator:</strong> Why someone should choose you over another option.",
    "<strong>Proof:</strong> A result, experience, testimonial, or process that supports your work.",
    "<strong>Tone:</strong> Friendly, expert, direct, inspiring, or another style.",
    "<strong>Main channel:</strong> Instagram, TikTok, Facebook, LinkedIn, or WhatsApp."
  ] },
  { selector: ".prompts-section .section-heading > *", en: ["Your weekly system", "Use the prompts in this order", "The first prompt creates the map. The others turn the best ideas into content ready to publish."] },
  { selector: ".prompt-heading span", en: ["Strategy", "Authority", "Connection", "Trust", "Conversion"] },
  { selector: ".prompt-heading h3", en: [
    "Create your 7-day content map",
    "Turn an educational idea into memorable content",
    "Tell a story that makes your value visible",
    "Answer an objection without pressure",
    "Present your offer and open a conversation"
  ] },
  { selector: ".prompt-heading button", en: ["Copy prompt", "Copy prompt", "Copy prompt", "Copy prompt", "Copy prompt"] },
  { selector: ".prompt-purpose", en: [
    "You will get a week balanced across education, trust, proof, and sales.",
    "Use it to develop the educational days from your calendar.",
    "Turn a real experience into trust without sounding grandiose.",
    "Ideal for concerns about price, time, difficulty, or necessity.",
    "Close the week by clearly explaining what you sell and who it is for."
  ] },
  { selector: ".calendar-section .section-heading > *", en: ["Suggested plan", "Your publishing calendar"] },
  { selector: ".calendar div", html: true, en: [
    "<strong>Day 1</strong><span>Education</span><p>Develop one idea with prompt 02.</p>",
    "<strong>Day 2</strong><span>Common mistake</span><p>Use prompt 02 with a customer belief.</p>",
    "<strong>Day 3</strong><span>Story</span><p>Tell a real experience with prompt 03.</p>",
    "<strong>Day 4</strong><span>Education</span><p>Answer a specific question with prompt 02.</p>",
    "<strong>Day 5</strong><span>Proof or process</span><p>Show how you work using prompt 03.</p>",
    "<strong>Day 6</strong><span>Objection</span><p>Reduce uncertainty with prompt 04.</p>",
    "<strong>Day 7</strong><span>Offer</span><p>Invite a conversation using prompt 05.</p>"
  ] },
  { selector: ".checklist-section > div > *", en: ["Before publishing", "Review each piece in 60 seconds"] },
  { selector: ".checklist li", en: [
    "The first sentence addresses something that truly matters to the customer.",
    "The content communicates one main idea, not five different ideas.",
    "It includes an example, criterion, or detail that keeps it from sounding generic.",
    "The call to action matches the goal of the publication.",
    "All data, results, and stories are true.",
    "The text sounds like your brand after you edit it."
  ] },
  { selector: ".final-cta > div:first-child > *", en: ["The next step", "Turn a good week into a monthly system", "The Epifania Founders Edition includes more than 60 explained prompts, a guided diagnosis, editable templates, examples, a 30-day calendar, and a group implementation session."] },
  { selector: ".cta-box > *", en: ["Founder price", "$29.990 CLP", "Future price $49.990", "Reserve my founder spot"] },
  { selector: "footer p", en: ["Epifania turns clarity into content that helps you sell."] }
];

const promptsEn = [
`Act as a content strategist for a small business. Your goal is to create a week of content that attracts the right customers and naturally brings them closer to a sale.

[BUSINESS BRIEF]

Create a 7-day calendar. Distribute the posts as follows:
- 2 educational pieces about important customer problems.
- 1 piece that challenges a common mistake or belief.
- 1 story that shows the human side of the business.
- 1 piece featuring proof, process, or a result.
- 1 piece that answers a purchase objection.
- 1 direct but friendly sales piece.

For each day, provide a table with:
1. Business goal.
2. Specific topic.
3. Hook of no more than 12 words.
4. Recommended format.
5. Main idea.
6. Call to action.

Avoid generic advice. Do not invent results, testimonials, or data. If important information is missing, ask me up to 3 questions before creating the calendar.`,
`Act as an educational content scriptwriter for social media.

[BUSINESS BRIEF]

Chosen calendar idea: [PASTE THE IDEA HERE]

Turn this idea into a piece that helps the customer recognize a problem and understand a solution. Provide:
1. Three clear and specific hooks.
2. A 45-second video script with beginning, development, and closing.
3. A short caption that adds value without repeating the script.
4. A call to action that invites people to save or comment.
5. A summarized version for WhatsApp status.

Use simple language, concrete examples, and short sentences. Do not exaggerate results. Avoid starting with "did you know."`,
`Act as an editor of short stories for a friendly brand.

[BUSINESS BRIEF]

Real experience I want to share: [DESCRIBE A REAL SITUATION, LESSON, OR CHANGE]

Write a social media story using this structure:
- Before: what was happening or what we believed.
- Moment of clarity: what we discovered.
- Change: what we did differently.
- Useful lesson for the customer.
- Final invitation to start a conversation.

Provide a 60-second video script, a caption of no more than 120 words, and a sequence of 4 stories. Preserve the facts provided, do not invent details, and avoid turning the story into a generic motivational speech.`,
`Act as a consultative sales advisor. Help me answer a frequent objection honestly and clearly.

[BUSINESS BRIEF]

Objection I hear: [WRITE THE OBJECTION IN THE CUSTOMER'S WORDS]

Create:
1. A hook that makes the person feel understood.
2. A short response that validates the concern without automatically agreeing.
3. A practical explanation of when my offer is a good fit and when it is not.
4. An example or criterion for making a good decision.
5. A gentle CTA inviting them to ask a question by direct message.
6. A WhatsApp reply of no more than 80 words.

Do not use fear, fake urgency, or absolute promises. The response should help the person decide, even if they ultimately do not buy.`,
`Act as a clear and friendly sales copywriter for a small business.

[BUSINESS BRIEF]

Create a post to present my main offer. It must connect the customer's problem with the result they seek and explain how my solution works.

Provide:
1. Five sales hooks without exaggerated phrases.
2. A 45-second video script.
3. A caption with the problem, solution, who it is for, what it includes, and the next step.
4. Three calls to action: one direct, one conversational, and one for WhatsApp.
5. An automatic welcome message for anyone who asks.
6. Three questions to qualify the interested person before offering a meeting or purchase.

Do not invent scarcity, testimonials, or benefits that do not appear in the brief. Prioritize clarity over creativity.`
];

groups.forEach((group) => {
  group.elements = [...document.querySelectorAll(group.selector)];
  group.es = group.elements.map((element) => group.html ? element.innerHTML : element.textContent);
});

const promptElements = [...document.querySelectorAll(".prompt-card pre code")];
const promptsEs = promptElements.map((element) => element.textContent);

function applyLanguage(language) {
  const currentLanguage = language === "en" ? "en" : "es";
  const metaDescription = document.querySelector('meta[name="description"]');
  const logoLink = document.querySelector(".guide-header > a");
  const languageControl = document.querySelector(".guide-language");
  localStorage.setItem("epifaniaLanguage", currentLanguage);
  document.documentElement.lang = currentLanguage;
  document.title = currentLanguage === "en"
    ? "Epifania | 5 prompts to create 7 days of content"
    : "Epifania | 5 prompts para crear 7 dias de contenido";
  metaDescription.content = currentLanguage === "en"
    ? "A free Epifania mini guide to create seven days of strategic content with artificial intelligence."
    : "Mini guia gratuita de Epifania para crear siete dias de contenido estrategico con inteligencia artificial.";
  logoLink.setAttribute("aria-label", currentLanguage === "en" ? "Back to Epifania" : "Volver a Epifania");
  languageControl.setAttribute("aria-label", currentLanguage === "en" ? "Change language" : "Cambiar idioma");

  groups.forEach((group) => {
    const values = currentLanguage === "en" ? group.en : group.es;
    group.elements.forEach((element, index) => {
      if (group.html) element.innerHTML = values[index];
      else element.textContent = values[index];
    });
  });

  promptElements.forEach((element, index) => {
    element.textContent = currentLanguage === "en" ? promptsEn[index] : promptsEs[index];
  });

  languageButtons.forEach((button) => {
    const isActive = button.dataset.lang === currentLanguage;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
}

printButton.addEventListener("click", () => window.print());

languageButtons.forEach((button) => {
  button.addEventListener("click", () => applyLanguage(button.dataset.lang));
});

copyButtons.forEach((button) => {
  button.addEventListener("click", async () => {
    const prompt = document.getElementById(button.dataset.copyTarget);
    if (!prompt) return;

    try {
      await navigator.clipboard.writeText(prompt.innerText);
      const originalText = button.textContent;
      button.textContent = document.documentElement.lang === "en" ? "Prompt copied" : "Prompt copiado";
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

applyLanguage(localStorage.getItem("epifaniaLanguage") || "es");
