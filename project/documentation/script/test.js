async function loadBenchmarkData() {
    const container = document.querySelector("#benchmark");

    try {
        const response = await fetch(RECORD_PATH + "benchmark.json");
        const rawData = await response.text();

        // Parse the custom DSL structure
        container.innerHTML += parseBenchmarkDSL(rawData);
    } catch (err) {
        console.error("Failed to load benchmark:", err);
    }
}

function parseBenchmarkDSL(input) {
    let html = "";
    const lines = input.split('\n').map(l => l.trim()).filter(l => l !== "");

    let i = 0;
    while (i < lines.length) {
        const line = lines[i];

        if (line === "$start-list") {
            html += '<div class="benchmark-flex-list">';
        } else if (line === "$end-list" || line === "$end-grid") {
            html += '</div>';
        } else if (line === "$start-grid") {
            html += '<div class="benchmark-grid-2">';
        } else if (line === "$start-box") {
            // Start of a box - peek ahead for title and contents
            let boxContent = "";
            let title = "REPORTS";
            i++;

            while (i < lines.length && lines[i] !== "$end-box") {
                const bLine = lines[i];

                if (bLine.startsWith('#')) {
                    title = bLine.replace('#', '');
                } else if (bLine === "&data-box") {
                    boxContent += '<div class="benchmark-data-box benchmark-data-grid">';
                    i++;
                    while (lines[i] && lines[i].startsWith('-')) {
                        let [label, val] = lines[i].substring(1).split(':');
                        boxContent += `
                            <div class="benchmark-data-item">
                                <span class="benchmark-data-label">${label.trim()}</span>
                                <span class="benchmark-data-value">${val.trim()}</span>
                            </div>`;
                        i++;
                    }
                    boxContent += '</div>';
                    i--; // Step back to let the main loop handle increment
                } else if (bLine === "&data-list") {
                    boxContent += '<ul class="benchmark-observation-list">';
                    i++;
                    while (lines[i] && lines[i].startsWith('-')) {
                        boxContent += `<li>${lines[i].substring(1).trim()}</li>`;
                        i++;
                    }
                    boxContent += '</ul>';
                    i--;
                } else if (bLine === "&data-strip") {
                    boxContent += '<div class="benchmark-data-strip"><div class="benchmark-sub-entry">';
                    i++;
                    while (lines[i] && (lines[i].startsWith('-') || lines[i] === "---")) {
                        if (lines[i] === "---") {
                            // Divider handled by CSS or extra class
                        } else {
                            let [label, val] = lines[i].substring(1).split(':');
                            let isTotal = label.toLowerCase().includes('total') ? 'benchmark-data-total' : '';
                            boxContent += `<div class="benchmark-data-pill ${isTotal}"><span>${label.trim()}</span><span>${val.trim()}</span></div>`;
                        }
                        i++;
                    }
                    boxContent += '</div></div>';
                    i--;
                } else if (bLine === "&data-table") {
                    boxContent += '<div class="benchmark-data-table-wrapper"><table class="benchmark-data-table">';
                    i++;
                    // Skip header separator |---|
                    const rows = [];
                    while (lines[i] && lines[i].startsWith('|')) {
                        if (!lines[i].includes('---')) {
                            rows.push(lines[i].split('|').filter(c => c.trim() !== ""));
                        }
                        i++;
                    }

                    // Render Table
                    rows.forEach((row, index) => {
                        if (index === 0) {
                            boxContent += `<thead><tr>${row.map(c => `<th>${c.trim()}</th>`).join('')}</tr></thead><tbody>`;
                        } else {
                            let highlight = row[0].includes('Indirect') ? 'class="benchmark-highlight-row"' : '';
                            boxContent += `<tr ${highlight}>${row.map(c => `<td>${c.trim()}</td>`).join('')}</tr>`;
                        }
                    });
                    boxContent += '</tbody></table></div>';
                    i--;
                }
                i++;
            }

            html += `
                <div class="benchmark-content-box benchmark-module">
                    <h2 class="benchmark-main-title">${title}</h2>
                    ${boxContent}
                </div>`;
        }
        i++;
    }
    return html;
}

// Initial Call
loadBenchmarkData();