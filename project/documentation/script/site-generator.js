function compileDSL(input) {
    const lines = input.split('\n');
    let html = '';
    const stack = [];

    let inCodeBlock = false;
    let codeBuffer = [];
    let codeMeta = null;

    let inDataStrip = false;
    let dataStripStyle = '';
    let dataStripItems = [];

    let inProjectTree = false;
    let projectTreeStyle = '';
    let projectTreeBuffer = [];

    let inTableView = false;
    let tableStyle = '';
    let tableBuffer = [];

    let inRoadmapView = false;
    let roadmapSteps = [];

    let inRoadmapStep = false;
    let roadmapStepBuffer = [];
    let roadmapStepClasses = [];

    /* -------------------------
       CLASS RULES
    ------------------------- */
    function autoClasses(base, extra = []) {
        const classes = [base, ...extra];

        if (base.includes('box')) classes.push('box');
        if (base.includes('button')) classes.push('button');
        if (base.endsWith('title')) classes.push('title');

        return classes;
    }

    /* -------------------------
       DOM HELPERS
    ------------------------- */
    function openDiv(classes, style = '') {
        html += `<div class="${classes.join(' ')}"${style ? ` style="${style}"` : ''}>`;
        stack.push('div');
    }

    function closeDiv() {
        html += `</div>`;
        stack.pop();
    }

    /* -------------------------
       PARSERS
    ------------------------- */

    // $start-xxx{style}
    function parseStartBlock(line) {
        const m = line.match(/^\$start-([\w-]+)(?:\{(.+?)\})?$/);
        if (!m) return false;

        openDiv(autoClasses(m[1]), m[2] || '');
        return true;
    }

    // $end-xxx
    function parseEndBlock(line) {
        if (!line.startsWith('$end-')) return false;
        closeDiv();
        return true;
    }

    // #item[extra](content){style}
    function parseItem(line) {
        const m = line.match(
            /^#([\w-]+)(?:\[([^\]]+)\])?\((.+?)\)(?:\{(.+?)\})?$/
        );
        if (!m) return false;

        const base = m[1];
        const extras = m[2] ? m[2].split(',').map(v => v.trim()) : [];
        const content = m[3];
        const style = m[4] || '';

        const classes = autoClasses(base, extras);
        html += `<div class="${classes.join(' ')}"${style ? ` style="${style}"` : ''}>${content}</div>`;
        return true;
    }

    /* -------------------------
       DATA STRIP
    ------------------------- */
    function parseDataStripStart(line) {
        const m = line.match(/^@start-data-strip(?:\{(.+?)\})?$/);
        if (!m) return false;

        inDataStrip = true;
        dataStripStyle = m[1] || '';
        dataStripItems = [];
        return true;
    }

    function parseDataStripItem(line) {
        const m = line.match(/^#(strip-item|strip-result)\((.+?)\)$/);
        if (!m) return false;

        dataStripItems.push({
            content: m[2],
            isResult: m[1] === 'strip-result'
        });
        return true;
    }

    function flushDataStrip() {
        html += `<div class="data-strip"${dataStripStyle ? ` style="${dataStripStyle}"` : ''}>`;

        for (const item of dataStripItems) {
            html += `<div class="strip-item${item.isResult ? ' strip-result' : ''}">${item.content}</div>`;
        }

        html += `</div>`;
        inDataStrip = false;
        dataStripStyle = '';
        dataStripItems = [];
    }

    /* -------------------------
       CODE BLOCK (VERBATIM)
    ------------------------- */
    function parseCodeBlockStart(line) {
        const m = line.match(/^@start-code-block(?:\{(.+?)\})?$/);
        if (!m) return false;

        inCodeBlock = true;
        codeMeta = { style: m[1] || '' };
        codeBuffer = [];
        return true;
    }

    function flushCodeBlock() {
        html += `<div class="code-block"${codeMeta.style ? ` style="${codeMeta.style}"` : ''}>`;
        html += `<pre><code>${codeBuffer.join('\n')}</code></pre>`;
        html += `</div>`;

        inCodeBlock = false;
        codeMeta = null;
        codeBuffer = [];
    }

    /* -------------------------
       PROJECT TREE
    ------------------------- */
    function parseProjectTreeStart(line) {
        const m = line.match(/^@start-project-tree(?:\{(.+?)\})?$/);
        if (!m) return false;

        inProjectTree = true;
        projectTreeStyle = m[1] || '';
        projectTreeBuffer = [];
        return true;
    }

    function parseProjectTree(lines) {
        const nodes = [];

        for (const raw of lines) {
            if (!raw.trim()) continue;

            const depth = (raw.match(/^(-*)/) || [''])[0].length;
            const nameRaw = raw.slice(depth).trim();
            const isFolder = nameRaw.endsWith('/');
            const name = isFolder ? nameRaw.slice(0, -1) : nameRaw;

            nodes.push({ name, type: isFolder ? 'folder' : 'file', depth, children: [] });
        }

        return buildTree(nodes);
    }

    function buildTree(flat) {
        const root = [];
        const stack = [];

        for (const node of flat) {
            while (stack.length && stack[stack.length - 1].depth >= node.depth) {
                stack.pop();
            }

            (stack.length ? stack[stack.length - 1].children : root).push(node);
            stack.push(node);
        }

        return root;
    }

    function renderTree(nodes) {
        let html = '<ul class="tree-view">';

        for (const node of nodes) {
            html += '<li>';

            if (node.type === 'folder') {
                html += `
                <div class="tree-node folder-node">
                    <i class="fas fa-folder-open icon-purple"></i>
                    <span>${node.name}</span>
                </div>
            `;
                html += renderTree(node.children);
            } else {
                const [icon, color] = getFileIcon(node.name);
                html += `
                <div class="tree-node file-node">
                    <i class="fas ${icon} ${color}"></i>
                    <span>${node.name}</span>
                </div>
            `;
            }

            html += '</li>';
        }

        html += '</ul>';
        return html;
    }

    function getFileIcon(name) {
        const lower = name.toLowerCase();

        if (lower.endsWith('.cs')) {
            return ['fa-file-code', 'icon-blue'];
        }
        else if (lower.endsWith('.json') || lower.endsWith('.txt')) {
            return ['fa-file-lines', 'icon-white'];
        }
        else if (lower.endsWith('.png') || lower.endsWith('.jpg') || lower.endsWith('.jpeg')) {
            return ['fa-file-image', 'icon-yellow'];
        }
        else if (lower.endsWith('.mp3') || lower.endsWith('.wav')) {
            return ['fa-file-audio', 'icon-green'];
        }
        else if (lower.endsWith('.fbx') || lower.endsWith('.obj')) {
            return ['fa-cube', 'icon-orange'];
        }
        else if (lower.endsWith('.shader') || lower.endsWith('.hlsl')) {
            return ['fa-fire', 'icon-teal'];
        }
        else if (lower.endsWith('.unity')) {
            return ['fa-cubes', 'icon-red'];
        }

        return ['fa-file', 'icon-white'];
    }

    function flushProjectTree() {
        const tree = parseProjectTree(projectTreeBuffer);
        html += `<div class="project-tree"${projectTreeStyle ? ` style="${projectTreeStyle}"` : ''}>`;
        html += renderTree(tree);
        html += `</div>`;

        inProjectTree = false;
        projectTreeStyle = '';
        projectTreeBuffer = [];
    }

    function parseTableStart(line) {
        const m = line.match(/^@start-table-view(?:\{(.+?)\})?$/);
        if (!m) return false;

        inTableView = true;
        tableStyle = m[1] || '';
        tableBuffer = [];
        return true;
    }
    function flushTable() {
        if (tableBuffer.length < 2) return;

        // HEADERS
        const headers = tableBuffer[0]
            .split('|')
            .map(h => h.trim());

        // ALIGNMENT ROW
        const alignRow = tableBuffer[1]
            .split('|')
            .map(c => c.trim());

        const aligns = alignRow.map(cell => {
            if (cell.startsWith(':') && cell.endsWith(':')) return 'center';
            if (cell.startsWith(':')) return 'left';
            if (cell.endsWith(':')) return 'right';
            return 'left';
        });

        // DATA ROWS
        const rows = tableBuffer
            .slice(2)
            .map(row => row.split('|').map(c => c.trim()));

        html += `<table class="table-view"${tableStyle ? ` style="${tableStyle}"` : ''}>`;

        /* THEAD */
        html += '<thead><tr>';
        headers.forEach((h, i) => {
            html += `<th style="text-align:${aligns[i]}">${h}</th>`;
        });
        html += '</tr></thead>';

        /* TBODY */
        html += '<tbody>';
        rows.forEach(row => {
            html += '<tr>';
            row.forEach((cell, i) => {
                html += `<td style="text-align:${aligns[i]}">${cell}</td>`;
            });
            html += '</tr>';
        });
        html += '</tbody>';

        html += '</table>';

        inTableView = false;
        tableStyle = '';
        tableBuffer = [];
    }

    function parseRoadmapViewStart(line) {
        if (line !== '@start-roadmap-view') return false;
        inRoadmapView = true;
        roadmapSteps = [];
        return true;
    }

    function flushRoadmapView() {
        html += `<div class="roadmap-view">`;
        roadmapSteps.forEach(step => html += step);
        html += `</div>`;
        inRoadmapView = false;
    }

    function parseRoadmapStepStart(line) {
        const m = line.match(/^@start-roadmap-step(?:\[([^\]]+)\])?$/);
        if (!m) return false;

        inRoadmapStep = true;
        roadmapStepClasses = m[1]
            ? m[1].split(',').map(c => c.trim())
            : [];

        roadmapStepBuffer = [];
        return true;
    }

    function flushRoadmapStep() {
        // 🔥 compile inner DSL recursively
        const innerHTML = compileDSL(roadmapStepBuffer.join('\n'));

        roadmapSteps.push(`
        <div class="roadmap-step ${roadmapStepClasses.join(' ')}">
            <div class="roadmap-node"></div>
            <div class="roadmap-card">
                ${innerHTML}
            </div>
        </div>
    `);

        inRoadmapStep = false;
        roadmapStepBuffer = [];
        roadmapStepClasses = [];
    }

    /* -------------------------
       MAIN LOOP
    ------------------------- */
    for (const rawLine of lines) {
        const line = rawLine.trim();

        if (inRoadmapView) {

            if (parseRoadmapStepStart(line)) continue;

            if (inRoadmapStep) {
                if (line === '@end-roadmap-step') {
                    flushRoadmapStep();
                } else {
                    roadmapStepBuffer.push(rawLine);
                }
                continue;
            }

            if (line === '@end-roadmap-view') {
                flushRoadmapView();
                continue;
            }

            continue;
        }

        if (inTableView) {
            if (line === '@end-table-view') {
                flushTable();
            } else {
                tableBuffer.push(rawLine);
            }
            continue;
        }

        if (inCodeBlock) {
            if (line === '@end-code-block') flushCodeBlock();
            else codeBuffer.push(rawLine);
            continue;
        }

        if (inDataStrip) {
            if (line === '@end-data-strip') flushDataStrip();
            else parseDataStripItem(line);
            continue;
        }

        if (inProjectTree) {
            if (line === '@end-project-tree') flushProjectTree();
            else projectTreeBuffer.push(rawLine);
            continue;
        }

        if (!line) continue;

        if (parseRoadmapViewStart(line)) continue;
        if (parseTableStart(line)) continue;
        if (parseProjectTreeStart(line)) continue;
        if (parseDataStripStart(line)) continue;
        if (parseCodeBlockStart(line)) continue;
        if (parseStartBlock(line)) continue;
        if (parseEndBlock(line)) continue;
        if (parseItem(line)) continue;

        html += `<p>${line}</p>`;
    }

    return html;
}


document.getElementById('overview').innerHTML = compileDSL(dslText);

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

document.getElementById('overview').innerHTML = compileDSL(dslText);
enableProjectTreeToggle();
