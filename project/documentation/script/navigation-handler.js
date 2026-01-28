import { compileDSL } from './yml-compiler/yml-compiler.js';

function EnableProjectTreeToggle(root = document) {
    const SPEED = 1.2;        // px per ms (tweak this)
    const MIN = 120;          // min duration (ms)
    const MAX = 320;          // max duration (ms)

    root.querySelectorAll('.tree-node.folder-node').forEach(folder => {
        folder.addEventListener('click', () => {
            const tree = folder.nextElementSibling;
            if (!tree || !tree.classList.contains('tree-view')) return;

            const icon = folder.querySelector('i');
            const height = tree.scrollHeight;

            const duration = Math.min(
                MAX,
                Math.max(MIN, height / SPEED)
            );

            tree.style.transitionDuration = duration + 'ms';

            if (tree.classList.contains('collapsed')) {
                // EXPAND
                tree.classList.remove('collapsed');
                tree.style.height = '0px';
                tree.offsetHeight; // force reflow
                tree.style.height = height + 'px';

                tree.addEventListener('transitionend', function handler(e) {
                    if (e.propertyName !== 'height') return;
                    tree.style.height = 'auto';
                    tree.removeEventListener('transitionend', handler);
                });
            }
            else {
                // COLLAPSE
                tree.style.height = height + 'px';
                tree.offsetHeight; // force reflow
                tree.style.height = '0px';
                tree.classList.add('collapsed');
            }

            if (icon) {
                icon.classList.toggle('fa-folder-open');
                icon.classList.toggle('fa-folder');
            }
        });
    });
}

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

    EnableProjectTreeToggle();
}

InitializeSidebar();