export const DataStripComponent =
{
    match: (line) => line.startsWith('@start-data-strip'),
    endTag: '@end-data-strip',
    render: (buffer, meta) =>
    {
        const style = meta.match(/\{(.+?)\}/)?.[1] || '';

        let itemsHtml = buffer.map(line =>
        {
            const m = line.trim().match(/^#(strip-item|strip-result)\((.+?)\)$/);
            if (!m) return '';
            return `<div class="strip-item${m[1] === 'strip-result' ? ' strip-result' : ''}">${m[2]}</div>`;
        }).join('');

        return `<div class="data-strip"${style ? ` style="${style}"` : ''}>${itemsHtml}</div>`;
    }
};