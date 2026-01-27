const getFileIcon = (name) =>
{
    const lower = name.toLowerCase();

    if (lower.endsWith('.cs')) return ['fa-file-code', 'icon-blue'];
    if (lower.endsWith('.json') || lower.endsWith('.txt')) return ['fa-file-lines', 'icon-white'];
    if (lower.endsWith('.png') || lower.endsWith('.jpg')) return ['fa-file-image', 'icon-yellow'];
    if (lower.endsWith('.fbx') || lower.endsWith('.obj')) return ['fa-cube', 'icon-orange'];
    if (lower.endsWith('.shader')) return ['fa-fire', 'icon-teal'];
    if (lower.endsWith('.unity')) return ['fa-cubes', 'icon-red'];

    return ['fa-file', 'icon-white'];
};

const renderNodes = (nodes) =>
{
    let html = '<ul class="tree-view">';
    nodes.forEach(node =>
    {
        html += '<li>';

        if (node.type === 'folder')
        {
            html += `<div class="tree-node folder-node"><i class="fas fa-folder-open icon-purple"></i><span>${node.name}</span></div>`;
            html += renderNodes(node.children);
        }
        else
        {
            const [icon, color] = getFileIcon(node.name);
            html += `<div class="tree-node file-node"><i class="fas ${icon} ${color}"></i><span>${node.name}</span></div>`;
        }

        html += '</li>';
    });
    return html + '</ul>';
};

export const ProjectTreeComponent =
{
    match: (line) => line.startsWith('@start-project-tree'),
    endTag: '@end-project-tree',
    render: (buffer, meta) =>
    {
        const style = meta.match(/\{(.+?)\}/)?.[1] || '';
        const nodes = [];
        buffer.forEach(raw =>
        {
            if (!raw.trim()) return;
            const depth = (raw.match(/^(-*)/) || [''])[0].length;
            const nameRaw = raw.slice(depth).trim();
            const isFolder = nameRaw.endsWith('/');
            nodes.push({ name: isFolder ? nameRaw.slice(0, -1) : nameRaw, type: isFolder ? 'folder' : 'file', depth, children: [] });
        });

        const root = [];
        const stack = [];
        nodes.forEach(node =>
        {
            while (stack.length && stack[stack.length - 1].depth >= node.depth) stack.pop();
            (stack.length ? stack[stack.length - 1].children : root).push(node);
            stack.push(node);
        });

        return `<div class="project-tree"${style ? ` style="${style}"` : ''}>${renderNodes(root)}</div>`;
    }
};