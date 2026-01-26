fetch(RECORD_PATH + "feature.json")
    .then(res => res.json())
    .then(data => {
        const section = document.querySelector("#feature");

        const html = data.feature.map(module => renderModule(module)).join("");
        section.insertAdjacentHTML("beforeend", html);
    });

function renderModule(module) {
    return `
    <div class="content-box" style="--accent:${module.accent}">
        <span class="label-header">${module.label}</span>
        <h2 class="main-title">${module.title}</h2>
        <p>${module.description}</p>

        ${module.features.map(feature => renderFeature(feature)).join("")}
    </div>
    `;
}

function renderFeature(feature) {
    // Grouped layout (Mesh / Texture Editor)
    if (feature.groups) {
        return `
    <div class="feature-sub-section">
        <h3 class="feature-sub-title">${feature.title}</h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px;">
            ${feature.groups.map(group => `
                    <div>
                        <span class="label-header">${group.label}</span>
                        <ul class="content-list star-bullet" style="margin-bottom: 0;">
                            ${group.items.map(item => `
                                <li>
                                    <strong>${item.title}:</strong> ${item.description}
                                </li>
                            `).join("")}
                        </ul>
                    </div>
                `).join("")}
        </div>
    </div>
    `;
    }

    // Normal list layout
    return `
    <div class="feature-sub-section">
        <h3 class="feature-sub-title">${feature.title}</h3>
        ${feature.description ? `
            <p style="margin-bottom:15px; font-size: 0.9rem; opacity: 0.8;">
                ${feature.description}
            </p>
        ` : ""}

        <ul class="content-list star-bullet" style="margin-bottom: 0;">
            ${feature.items.map(item => `
                <li>
                    ${item.title
            ? `<strong>${item.title}:</strong> ${item.description}`
            : item.description}
                </li>
            `).join("")}
        </ul>
    </div>
    `;
}
