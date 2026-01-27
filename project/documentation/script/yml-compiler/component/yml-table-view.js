export const TableViewComponent =
{
    match: (line) => line.startsWith('@start-table-view'),
    endTag: '@end-table-view',
    render: (buffer, meta) =>
    {
        if (buffer.length < 2) return '';
        const style = meta.match(/\{(.+?)\}/)?.[1] || '';
        const headers = buffer[0].split('|').map(h => h.trim());
        const aligns = buffer[1].split('|').map(c =>
        {
            const cell = c.trim();
            if (cell.startsWith(':') && cell.endsWith(':')) return 'center';
            if (cell.endsWith(':')) return 'right';
            return 'left';
        });

        let html = `<table class="table-view"${style ? ` style="${style}"` : ''}><thead><tr>`;
        headers.forEach((h, i) => html += `<th style="text-align:${aligns[i]}">${h}</th>`);
        html += '</tr></thead><tbody>';

        buffer.slice(2).forEach(rowStr =>
        {
            html += '<tr>';
            rowStr.split('|').forEach((cell, i) =>
            {
                html += `<td style="text-align:${aligns[i]}">${cell.trim()}</td>`;
            });
            html += '</tr>';
        });

        return html + '</tbody></table>';
    }
};