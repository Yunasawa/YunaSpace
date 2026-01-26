async function loadEditors(jsonPath) {
    try {
        const res = await fetch(jsonPath);
        if (!res.ok) throw new Error("Failed to load editor JSON");

        const data = await res.json();
        if (!data.editors || !Array.isArray(data.editors)) return;

        const section = document.getElementById("editor");
        if (!section) return;

        const html = data.editors.map(editor => renderEditor(editor)).join("");
        section.insertAdjacentHTML("beforeend", html);

    } catch (err) {
        console.error("Editor Loader Error:", err);
    }
}

function renderEditor(editor) {
    return `
    <div class="content-box">
        <span class="label-header">${editor.subtitle || editor.label || ""}</span>
        <h2 class="main-title">${editor.title || ""}</h2>

        ${editor.type === "portrait"
            ? renderPortraitEditor(editor)
            : renderLandscapeEditor(editor)
        }
    </div>
    `;
}

function renderLandscapeEditor(editor) {
    return `
        <p>${editor.description || ""}</p>

        ${renderImage(editor.image)}

        ${renderSections(editor.sections)}
    `;
}

function renderPortraitEditor(editor) {
    return `
    <div style="display:grid;grid-template-columns:1.5fr 1fr;gap:40px;margin-top:25px;align-items:start;">
        <div>
            <p>${editor.description || ""}</p>
            ${renderSections(editor.sections)}
        </div>

        ${editor.image ? `
        <div style="width:100%;max-width:320px;justify-self:center;border-radius:8px;overflow:hidden;">
            <img src="${editor.image.src}" alt="${editor.image.alt || ""}" style="width:100%;display:block;">
        </div>
        ` : ""}
    </div>
    `;
}

function renderImage(image) {
    if (!image) return "";

    return `
    <div style="margin:25px 0;border-radius:8px;overflow:hidden;">
        <img src="${image.src}" alt="${image.alt || ""}" style="width:100%;display:block;">
    </div>
    `;
}

function renderSections(sections = []) {
    return sections.map(section => {
        if (section.type === "feature-grid") {
            return renderFeatureGrid(section);
        }
        return renderFeatureList(section);
    }).join("");
}

function renderFeatureGrid(section) {
    const features = section.features || [];
    const mid = Math.ceil(features.length / 2);

    const left = features.slice(0, mid);
    const right = features.slice(mid);

    return `
    <div class="card sub-card-flat last" style="border-top-color:var(--accent);">
        <span class="label-header">${section.label || ""}</span>

        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:20px;margin-top:15px;">
            ${renderFeatureColumn(left, "diamond-bullet")}
            ${renderFeatureColumn(right, "diamond-bullet")}
        </div>
    </div>
    `;
}

function renderFeatureList(section) {
    const features = section.features || [];

    return `
    <div class="card sub-card-flat last" style="margin-top:25px;border-top-color:var(--accent);">
        <span class="label-header">${section.label || ""}</span>

        <ul class="content-list star-bullet last">
            ${features.map(f => `
                <li><strong>${f.title}:</strong> ${f.description}</li>
            `).join("")}
        </ul>
    </div>
    `;
}

function renderFeatureColumn(items, bulletClass) {
    if (!items.length) return "";

    return `
    <ul class="content-list ${bulletClass} last">
        ${items.map(item => `
            <li><strong>${item.title}:</strong> ${item.description}</li>
        `).join("")}
    </ul>
    `;
}

loadEditors(RECORD_PATH + "editor.json");