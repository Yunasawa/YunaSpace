import { LayoutComponent } from './component/yml-layout-component.js';
import { SpaceComponent } from './component/yml-layout-component.js';
import { TitleComponent } from './component/yml-title-component.js';
import { LinkComponent } from './component/yml-text-link.js';
import { IconComponent } from './component/yml-icon-component.js';
import { ImageComponent } from './component/yml-image-component.js';
import { BookmarkComponent } from './component/yml-bookmark-component.js';
import { CodeBlockComponent } from './component/yml-code-block.js';
import { DataStripComponent } from './component/yml-data-strip.js';
import { ProjectTreeComponent } from './component/yml-project-tree.js';
import { TableViewComponent } from './component/yml-table-view.js';
import { RoadmapViewComponent } from './component/yml-roadmap-view.js';

const blockComponents = [CodeBlockComponent, DataStripComponent, ProjectTreeComponent, TableViewComponent, RoadmapViewComponent];

export function ResetBookmark() {
    BookmarkComponent.bookmarks = [];
}

export function compileDSL(input, page) {
    const lines = input.split('\n');
    let html = '';
    const stack = [];

    for (let i = 0; i < lines.length; i++) {
        const rawLine = lines[i];
        const line = rawLine.trim();
        if (!line) continue;

        if (BookmarkComponent.match(line)) {
            html += BookmarkComponent.render(line, page);
            continue;
        }

        // 1. Block components (Code, Table, etc.) - Usually don't want links inside code
        const block = blockComponents.find(c => c.match(line));
        if (block) {
            let buffer = [];
            i++;
            while (i < lines.length && lines[i].trim() !== block.endTag) {
                buffer.push(lines[i]);
                i++;
            }
            // Pass compileDSL to handle recursive text inside blocks (like Roadmap)
            html += block.render(buffer, line, compileDSL);
            continue;
        }

        if (SpaceComponent.match(line)) {
            html += SpaceComponent.render(line);
            continue;
        }

        let processedLine = LinkComponent.process(line);
        processedLine = IconComponent.process(processedLine);

        // 2. Layout markers ($start / $end)
        if (LayoutComponent.match(line)) {
            html += LayoutComponent.render(line, stack);
            continue;
        }

        if (ImageComponent.match(line)) {
            html += ImageComponent.render(line);
            continue;
        }

        // 3. Line Items (#) - APPLY LINK REPLACER HERE
        if (TitleComponent.match(line)) {
            const renderedTitle = TitleComponent.render(line);
            html += LinkComponent.process(renderedTitle);
            continue;
        }

        html += `${processedLine}`;
    }

    return html;
}

export function updateNavigation() {
    document.querySelectorAll('.toc-section .toc-list').forEach(list => list.innerHTML = '');

    BookmarkComponent.bookmarks.forEach(bm => {
        const selector = `.toc-section[data-page="${bm.page}"] .toc-list`;
        const container = document.querySelector(selector);

        if (container) {
            const li = document.createElement('li');

            if (bm.type === 'spacer') {
                // Create an empty space item
                li.style.height = `${bm.height}px`;
                li.style.listStyle = 'none';
                li.className = 'toc-spacer';
            } else {
                // Create standard link item
                li.className = `toc-item ${bm.type}`;
                li.innerHTML = `<a href="#${bm.id}">${bm.text}</a>`;
            }

            container.appendChild(li);
        }
    });
}
