const RECORD_PATH = `../record/${type}/${project}/documentation/`;

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
            const jsonPath = `${RECORD_PATH}${page}.json`;
            const htmlPath = `${RECORD_PATH}${page}.html`;
            const ymdPath = `${RECORD_PATH}${page}.ymd`;

            const hasJson = await fileExists(jsonPath);
            const hasHtml = hasJson ? false : await fileExists(htmlPath);
            const hasYmd = hasJson || hasHtml ? false : await fileExists(ymdPath);

            if (hasJson || hasHtml || hasYmd) {
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