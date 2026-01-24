fetch("./overview.json")
    .then(res => res.json())
    .then(data => {
        const section = document.getElementById("overview");
        const { overview, design } = data;

        section.innerHTML = `
      <!-- OVERVIEW -->
      <div style="display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:20px;">
        <div>
          <p style="color:var(--accent);font-family:monospace;letter-spacing:2px;">
            > ${overview.module}
          </p>
          <h1>${overview.title}</h1>
        </div>
      </div>

      <div class="content-box">
        <span class="sub-label">Description</span>
        ${overview.description.map(p => `<p>${p}</p>`).join("<br>")}

        <div class="metadata-grid">
          ${Object.entries(overview.metadata).map(([key, value]) => `
            <div class="metadata-box">
              <span class="sub-label">${key}</span>
              <div style="font-weight:bold;">${value}</div>
            </div>
          `).join("")}
        </div>

        <span class="sub-label">Keywords</span>
        <div class="keyword-container">
          ${overview.keywords.map(k => `<span class="round-button">${k}</span>`).join("")}
        </div>
      </div>

      <!-- DESIGN -->
      <div style="margin-top:80px;">
        <p style="color:var(--accent);font-family:monospace;letter-spacing:2px;">
          > ${design.module}
        </p>
        <h1>${design.title}</h1>
      </div>

      <div class="content-box">
        ${renderList("Core Gameplay", design.coreGameplay)}
        ${renderList("Scoring System", design.scoringSystem)}

        <span class="sub-label">Logic Flow</span>
        <div class="flow-list">
          ${design.logicFlow.map((step, i) => `
            <div class="flow-step">
              <span class="step-number">${i + 1}</span> ${step}
            </div>
          `).join("")}
        </div>

        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:40px;">
          ${renderList("Difficulty & Progression", design.difficulty, true)}
          ${renderList("Visual Design", design.visualDesign, true)}
        </div>
      </div>
    `;
    });

function renderList(title, items, last = false) {
    return `
    <span class="sub-label">${title}</span>
    <ul class="content-list ${last ? "last" : "diamond-bullet"}">
      ${items.map(i => `<li>${i}</li>`).join("")}
    </ul>
  `;
}
