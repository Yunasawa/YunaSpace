async function loadAndBuildProjectTree() {
    const container = document.getElementById('project-tree-root');
    const pluginContainer = document.getElementById('project-plugin-container');
    container.innerHTML = '<div class="file-node" style="padding: 20px; opacity: 0.5;">Loading system structure...</div>';

    try {
        const response = await fetch(PAGE_JSON_BASE + "structure.json");
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const projectData = await response.json();
        const rootUl = document.createElement('ul');
        rootUl.className = 'tree';
        const levelMap = { [-1]: rootUl };

        projectData.structure.forEach(item => {
            const match = item.match(/^([-]+)/);
            const level = match ? match[1].length : 0;

            // 1. Detect if it's a folder FIRST
            const isFolder = item.endsWith('/');

            // 2. Clean the name: Remove dashes AND remove the trailing slash
            let cleanName = item.replace(/^[-]+\s*/, "");
            if (isFolder) {
                cleanName = cleanName.slice(0, -1);
            }

            const li = document.createElement('li');

            let icon = isFolder ? 'fa-folder-open' : 'fa-file-lines';
            let iconColor = isFolder ? 'icon-purple' : 'icon-white';

            if (cleanName.endsWith('.cs')) {
                icon = 'fa-file-code'; iconColor = 'icon-blue';
            }
            if (cleanName.endsWith('.png')) {
                icon = 'fa-file-image'; iconColor = 'icon-yellow';
            }
            if (cleanName.endsWith('.unity')) {
                icon = 'fa-cubes'; iconColor = 'icon-orange';
            }
            if (cleanName.endsWith('.shader') || cleanName.endsWith('.hlsl') || cleanName.endsWith('.shadergraph')) {
                icon = 'fa-fire'; iconColor = 'icon-teal';
            }

            li.innerHTML = `
                <div class="tree-node ${isFolder ? 'folder-node' : 'file-node'}">
                    <i class="fas ${icon} ${iconColor}"></i>
                    <span>${cleanName}</span>
                </div>
            `;

            const parentUl = levelMap[level - 1];
            if (parentUl) parentUl.appendChild(li);

            if (isFolder) {
                const newUl = document.createElement('ul');
                newUl.className = 'tree';
                li.appendChild(newUl);
                levelMap[level] = newUl;
            }
        });

        container.innerHTML = '';
        container.appendChild(rootUl);


        if (projectData.plugin) {
            let pluginHtml = '<div class="plugin-list">';

            projectData.plugin.forEach(p => {
                let pIcon = 'fa-plug'; // Default
                const name = p.name.toLowerCase();

                pluginHtml += `
            <div class="plugin-item">
                <div class="plugin-info">
                    <div class="plugin-icon-box">
                        <i class="fas ${pIcon}"></i>
                    </div>
                    <span class="plugin-name">${p.name}</span>
                </div>
                <a href="${p.url}" target="_blank" class="plugin-link">
                    See More <i class="fas fa-external-link-alt"></i>
                </a>
            </div>`;
            });

            pluginHtml += '</div>';
            pluginContainer.innerHTML = pluginHtml;
        }

    } catch (error) {
        container.innerHTML = `<div class="file-node" style="color: #ff5555; padding: 20px;">> ERROR: ${error.message}</div>`;
    }
}

document.addEventListener('DOMContentLoaded', loadAndBuildProjectTree);