document.addEventListener("DOMContentLoaded", () => {
  const contentDisplay = document.getElementById("content-display");
  const sidebarNav = document.getElementById("sidebar-nav");
  const pagination = document.getElementById("doc-pagination");

  let documentationData = [];
  let currentSectionIdx = 0;
  let currentSubsectionIdx = 0;

  // Load documentation from JSON
  fetch("data/doc_content.json")
    .then((response) => response.json())
    .then((data) => {
      documentationData = data;
      renderSidebar();
      loadContent(0, 0);
    })
    .catch((error) => {
      console.error("Error loading documentation:", error);
      contentDisplay.innerHTML =
        "<p>Désolé, une erreur est survenue lors du chargement de la documentation.</p>";
    });

  function renderSidebar() {
    sidebarNav.innerHTML = "";
    documentationData.forEach((section, sIdx) => {
      const group = document.createElement("div");
      group.className = "doc__sidebar-group";

      const title = document.createElement("h3");
      title.className = "doc__sidebar-title";
      title.textContent = section.title;
      group.appendChild(title);

      const list = document.createElement("ul");
      list.className = "doc__sidebar-list";

      section.subsections.forEach((sub, subIdx) => {
        const item = document.createElement("li");
        const link = document.createElement("a");
        link.className = "doc__sidebar-link";
        link.textContent = sub.title;
        link.id = `link-${sIdx}-${subIdx}`;
        link.onclick = () => loadContent(sIdx, subIdx);
        item.appendChild(link);
        list.appendChild(item);
      });

      group.appendChild(list);
      sidebarNav.appendChild(group);
    });
  }

  function loadContent(sIdx, subIdx) {
    currentSectionIdx = sIdx;
    currentSubsectionIdx = subIdx;

    const section = documentationData[sIdx];
    const sub = section.subsections[subIdx];

    // Update URL hash without scrolling
    window.history.replaceState(null, null, `#${sub.id}`);

    // Update active sidebar link
    document
      .querySelectorAll(".doc__sidebar-link")
      .forEach((link) => link.classList.remove("active"));
    const activeLink = document.getElementById(`link-${sIdx}-${subIdx}`);
    if (activeLink) activeLink.classList.add("active");

    // Render content
    let mediaHtml = "";
    if (sub.media) {
      if (sub.media.type === "image") {
        mediaHtml = `<div class="doc__media-container"><img src="${sub.media.url}" alt="${sub.title}" class="doc__img"></div>`;
      } else if (sub.media.type === "video") {
        mediaHtml = `<div class="doc__media-container"><video src="${sub.media.url}" controls class="doc__video"></video></div>`;
      }
    }

    contentDisplay.classList.remove("fade-in");
    void contentDisplay.offsetWidth; // Trigger reflow
    contentDisplay.classList.add("fade-in");

    contentDisplay.innerHTML = `
            <h2 class="doc__section-title">${sub.title}</h2>
            <p class="doc__text">${sub.content}</p>
            ${mediaHtml}
        `;

    renderPagination();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function renderPagination() {
    pagination.innerHTML = "";

    // Find previous
    let prevS = currentSectionIdx;
    let prevSub = currentSubsectionIdx - 1;
    if (prevSub < 0) {
      prevS--;
      if (prevS >= 0) {
        prevSub = documentationData[prevS].subsections.length - 1;
      }
    }

    if (prevS >= 0) {
      const prevItem = documentationData[prevS].subsections[prevSub];
      pagination.innerHTML += `
                <div class="pagination__btn pagination__btn--prev" onclick="loadContent(${prevS}, ${prevSub})">
                    <span class="pagination__label">Précédent</span>
                    <a class="pagination__link pagination__link--prev"><i class='bx bx-chevron-left'></i> ${prevItem.title}</a>
                </div>
            `;
    } else {
      pagination.innerHTML += "<div></div>";
    }

    // Find next
    let nextS = currentSectionIdx;
    let nextSub = currentSubsectionIdx + 1;
    if (nextSub >= documentationData[nextS].subsections.length) {
      nextS++;
      nextSub = 0;
    }

    if (nextS < documentationData.length) {
      const nextItem = documentationData[nextS].subsections[nextSub];
      pagination.innerHTML += `
                <div class="pagination__btn pagination__btn--next" onclick="loadContent(${nextS}, ${nextSub})">
                    <span class="pagination__label">Suivant</span>
                    <a class="pagination__link pagination__link--next">${nextItem.title} <i class='bx bx-chevron-right'></i></a>
                </div>
            `;
    }
  }

  // Feedback logic
  const stars = document.querySelectorAll(".star");
  stars.forEach((star) => {
    star.addEventListener("click", () => {
      const val = star.getAttribute("data-value");
      stars.forEach((s, i) => {
        if (i < val) s.classList.add("bx-star", "bxs-star");
        else s.classList.remove("bxs-star");
      });
      // Show toast or save rating
      console.log("Rated:", val);
    });
  });

  document.getElementById("btn-useful").onclick = () =>
    alert("Merci pour votre retour !");
  document.getElementById("btn-not-useful").onclick = () =>
    alert(
      "Nous sommes désolés. N\\'hésitez pas à nous contacter pour nous aider à nous améliorer.",
    );
});
