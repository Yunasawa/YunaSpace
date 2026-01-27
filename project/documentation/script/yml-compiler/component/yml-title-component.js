import { autoClasses } from './yml-layout-component.js';

export const TitleComponent =
{
    match: (line) => line.startsWith('#') && line.includes('('),
    render: (line) =>
    {
        const m = line.match(/^#([\w-]+)(?:\[([^\]]+)\])?\((.+?)\)(?:\{(.+?)\})?$/);
        if (!m) return '';
        const [_, base, extraStr, content, style] = m;
        const extras = extraStr ? extraStr.split(',').map(v => v.trim()) : [];
        const classes = autoClasses(base, extras);
        return `<div class="${classes.join(' ')}"${style ? ` style="${style}"` : ''}>${content}</div>`;
    }
};