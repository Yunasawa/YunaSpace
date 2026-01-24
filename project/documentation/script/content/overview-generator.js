fetch(PAGE_JSON_BASE + "overview.json")
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
        ${design.content.map((block, i, arr) => renderDesignBlock(block, i, arr)).join("")}
      </div>
    `;
    });

function renderDesignBlock(block, index, array) {
    // Find last content-list index
    const lastListIndex = [...array]
        .map((b, i) => (b.type === "content-list" ? i : -1))
        .filter(i => i !== -1)
        .pop();

    switch (block.type) {
        case "content-list":
            return renderList(block.label, block.item, index === lastListIndex);

        case "content-flow":
            return renderFlow(block.label, block.item);

        default:
            return "";
    }
}

function renderList(label, items, isLast = false) {
    return `
    <span class="sub-label">${label}</span>
    <ul class="content-list diamond-bullet ${isLast ? "last" : ""}">
      ${items.map(i => `<li>${i}</li>`).join("")}
    </ul>
  `;
}

function renderFlow(label, steps) {
    return `
    <span class="sub-label">${label}</span>
    <div class="flow-list">
      ${steps.map((step, i) => `
        <div class="flow-step">
          <span class="step-number">${i + 1}</span> ${step}
        </div>
      `).join("")}
    </div>
  `;
}
