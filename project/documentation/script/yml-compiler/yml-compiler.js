import { LayoutComponent } from './component/yml-layout-component.js';
import { TitleComponent } from './component/yml-title-component.js';
import { LinkComponent } from './component/yml-text-link.js';
import { IconComponent } from './component/yml-icon-component.js';
import { ImageComponent } from './component/yml-image-component.js';
import { CodeBlockComponent } from './component/yml-code-block.js';
import { DataStripComponent } from './component/yml-data-strip.js';
import { ProjectTreeComponent } from './component/yml-project-tree.js';
import { TableViewComponent } from './component/yml-table-view.js';
import { RoadmapViewComponent } from './component/yml-roadmap-view.js';

const blockComponents = [CodeBlockComponent, DataStripComponent, ProjectTreeComponent, TableViewComponent, RoadmapViewComponent];

export function compileDSL(input) {
    const lines = input.split('\n');
    let html = '';
    const stack = [];

    for (let i = 0; i < lines.length; i++) {
        const rawLine = lines[i];
        const line = rawLine.trim();
        if (!line) continue;

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

        let processedLine = LinkComponent.process(line);
        processedLine = IconComponent.process(processedLine);

        html += `<p>${processedLine}</p>`;
    }
    return html;
}

document.getElementById('overview').innerHTML = compileDSL(dslText);