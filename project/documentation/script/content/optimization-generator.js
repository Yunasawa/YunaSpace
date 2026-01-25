fetch(PAGE_JSON_BASE + "optimization.json")
    .then(res => res.json())
    .then(data => {
        const section = document.querySelector("#optimization");
        if (!section) return;

        const html = data.optimization.map(renderOptimizationModule).join("");
        section.insertAdjacentHTML("beforeend", html);
    })
    .catch(err => {
        console.error("Failed to load optimization.json", err);
    });

function renderOptimizationModule(module) {
    return `
        <div class="content-box perf-module">
            <span class="label-header">${module.label}</span>
            <h2 class="main-title">${module.title}</h2>

            <div class="data-strip">
                ${module.entries.map(renderEntry).join("")}
            </div>
        </div>
    `;
}

function renderEntry(entry) {
    return `
        <div class="sub-entry">
            <h4>${entry.title}</h4>

            ${entry.description.map(d => `<p>${parseMarkdown(d)}</p>`).join("")}

            ${entry.notes ? entry.notes.map(renderNote).join("") : ""}
        </div>
    `;
}

function renderNote(note) {
    if (note.type === "problem") {
        return `
            <div class="problem-box">
                <span class="problem-label">${note.label}:</span>
                ${note.title ? `<span class="problem-title">${note.title}</span>` : ""}

                ${note.description.map(d => `<p>${parseMarkdown(d)}</p>`).join("")}
            </div>
        `;
    }

    if (note.type === "result") {
        return `
            <div class="result-box">
                <span class="result-label">${note.label}:</span>
                <p class="result-text">
                    ${note.description.map(parseMarkdown).join(" ")}
                </p>
            </div>
        `;
    }

    if (note.type === "note") {
        return `
            <div class="result-box">
                <span class="result-label">${note.label}:</span>
                <p class="result-text">
                    ${note.description.map(parseMarkdown).join(" ")}
                </p>
            </div>
        `;
    }

    return "";
}

function parseMarkdown(text) {
    return text.replace(
        /\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g,
        `<a href="$2" target="_blank">$1</a>`
    );
}
