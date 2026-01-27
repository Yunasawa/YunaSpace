export const autoClasses = (base, extra = []) => {
    const classes = [base, ...extra];

    // Auto-injection logic based on keywords
    if (base.includes('box')) classes.push('box');
    if (base.includes('button')) classes.push('button');
    if (base.endsWith('title')) classes.push('title');

    return classes;
};

export const LayoutComponent = {
    match: (line) => line.startsWith('$start-') || line.startsWith('$end-'),
    render: (line, stack) => {
        if (line.startsWith('$end-')) {
            stack.pop();
            return `</div>`;
        }

        const m = line.match(/^\$start-([\w-]+)(?:\[([^\]]+)\])?(?:\{(.+?)\})?$/);

        if (!m) return '';

        const baseClass = m[1];
        const extraClasses = m[2] ? m[2].split(',').map(c => c.trim()) : [];
        const style = m[3] || '';

        const classes = autoClasses(baseClass, extraClasses);
        stack.push('div');

        return `<div class="${classes.join(' ')}"${style ? ` style="${style}"` : ''}>`;
    }
};

export const SpaceComponent = {
    match: (line) => line.startsWith('@space('),

    render: (line) => {
        const m = line.match(/^\@space\(([^|)]+)\|([^|)]+)\)$/);

        if (!m) return '';

        const width = m[1].trim();
        const height = m[2].trim();

        const formatDim = (val) => isNaN(val) ? val : `${val}px`;

        return `<div class="flex-space" style="width: ${formatDim(width)}; height: ${formatDim(height)}"></div>`;
    }
};