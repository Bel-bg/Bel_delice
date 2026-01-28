// Initialize i18next
async function initI18n() {
  const responseFr = await fetch("assets/locales/fr.json");
  const fr = await responseFr.json();
  const responseEn = await fetch("assets/locales/en.json");
  const en = await responseEn.json();

  i18next.init(
    {
      lng: localStorage.getItem("language") || "fr",
      debug: false,
      resources: {
        en: { translation: en },
        fr: { translation: fr },
      },
    },
    function (err, t) {
      if (err) return console.error("Error loading translations", err);
      updateContent();
    },
  );
}

// Update the DOM with translations
function updateContent() {
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    el.innerHTML = i18next.t(key);
  });
}

// Switch language
function changeLanguage(lng) {
  i18next.changeLanguage(lng, (err, t) => {
    if (err) return console.error("Error changing language", err);
    localStorage.setItem("language", lng);
    updateContent();
    updateActiveButton(lng);
  });
}

// Update the active state of buttons and main display
function updateActiveButton(lng) {
  const activeFlag = document.getElementById("active-flag");
  const activeLangText = document.getElementById("active-lang-text");

  if (activeFlag && activeLangText) {
    if (lng === "fr") {
      activeFlag.src = "https://flagcdn.com/w40/fr.png";
      activeLangText.innerText = "FR";
    } else {
      activeFlag.src = "https://flagcdn.com/w40/gb.png";
      activeLangText.innerText = "EN";
    }
  }

  document.querySelectorAll(".lang-option").forEach((btn) => {
    if (btn.getAttribute("onclick").includes(lng)) {
      btn.classList.add("active-lang");
    } else {
      btn.classList.remove("active-lang");
    }
  });
}

// Start the process
document.addEventListener("DOMContentLoaded", () => {
  // Inject i18next script if not present
  if (typeof i18next === "undefined") {
    const script = document.createElement("script");
    script.src = "https://unpkg.com/i18next@21.6.10/dist/umd/i18next.min.js";
    script.onload = initI18n;
    document.head.appendChild(script);
  } else {
    initI18n();
  }
});
