const PAGE_JSON_BASE = `../project/record/${type}/${project}/documentation/`;

console.log(PAGE_JSON_BASE);

async function fileExists(path) {
    try {
        const res = await fetch(path, { method: "HEAD" });
        return res.ok;
    } catch {
        return false;
    }
}

async function initSidebar() {
    const navGroups = document.querySelectorAll(".nav-group");

    for (const group of navGroups) {
        const items = group.querySelectorAll(".nav-item[data-page]");
        let hasAny = false;

        for (const item of items) {
            const page = item.dataset.page;
            const jsonPath = `${PAGE_JSON_BASE}${page}.json`;
            const htmlPath = `${PAGE_JSON_BASE}${page}.html`;

            const hasJson = await fileExists(jsonPath);
            const hasHtml = hasJson ? false : await fileExists(htmlPath);

            if (hasJson || hasHtml) {
                item.classList.add("visible");
                hasAny = true;

                item.dataset.source = hasJson ? "json" : "html";
            }
        }

        if (hasAny) {
            group.classList.add("visible");
        }
    }

    // auto activate first visible tab
    const firstVisible = document.querySelector(".nav-item.visible");
    if (firstVisible) firstVisible.click();
}

initSidebar();