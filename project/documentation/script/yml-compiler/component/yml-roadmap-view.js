export const RoadmapViewComponent =
{
    match: (line) => line.startsWith('@start-roadmap-view'),
    endTag: '@end-roadmap-view',
    render: (buffer, _, compileFunc) =>
    {
        let html = '<div class="roadmap-view">';
        let i = 0;
        while (i < buffer.length)
        {
            const line = buffer[i].trim();
            if (line.startsWith('@start-roadmap-step'))
            {
                const classes = line.match(/\[([^\]]+)\]/)?.[1]?.replace(',', ' ') || '';
                let stepBuffer = [];
                i++;

                while (i < buffer.length && buffer[i].trim() !== '@end-roadmap-step')
                {
                    stepBuffer.push(buffer[i]);
                    i++;
                }

                html += `<div class="roadmap-step ${classes}"><div class="roadmap-node"></div><div class="roadmap-card">
                    ${compileFunc(stepBuffer.join('\n'))}
                </div></div>`;
            }

            i++;
        }
        return html + '</div>';
    }
};