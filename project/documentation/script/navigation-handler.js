import { compileDSL } from './yml-compiler/yml-compiler.js';

async function FileExists(path)
{
    try
    {
        const res = await fetch(path, { method: "HEAD" });
        return res.ok;
    }
    catch
    {
        return false;
    }
}

async function InitializeSidebar() {
    const navGroups = document.querySelectorAll(".navigation-group");

    for (const group of navGroups) {
        const items = group.querySelectorAll(".navigation-item[data-page]");
        let hasAny = false;

        for (const item of items) {
            const page = item.dataset.page;
            const ymdPath = `${RECORD_PATH}${page}.txt`;

            const hasYmd = await FileExists(ymdPath);

            if (!hasYmd) continue;

            item.classList.add("visible");
            item.dataset.source = "txt";
            hasAny = true;

            // 🔽 LOAD + COMPILE CONTENT
            try {
                const res = await fetch(ymdPath);
                const content = await res.text();

                const target = document.getElementById(page);
                if (target) {
                    target.innerHTML = compileDSL(content);
                } else {
                    console.warn(`Missing container with id="${page}"`);
                }
            }
            catch (err) {
                console.error(`Failed to load ${ymdPath}`, err);
            }
        }

        if (hasAny) {
            group.classList.add("visible");
        }
    }

    const firstVisible = document.querySelector(".navigation-item.visible");
    if (firstVisible) firstVisible.click();
}


InitializeSidebar();

function enableProjectTreeToggle(root = document) {
    root.querySelectorAll('.tree-node.folder-node').forEach(folder => {
        folder.addEventListener('click', () => {
            const childTree = folder.nextElementSibling;

            if (!childTree || !childTree.classList.contains('tree-view')) return;

            childTree.classList.toggle('collapsed');

            const icon = folder.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-folder-open');
                icon.classList.toggle('fa-folder');
            }
        });
    });
}

enableProjectTreeToggle();