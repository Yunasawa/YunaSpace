export const CodeBlockComponent =
{
    match: (line) => line.startsWith('@start-code-block'),
    endTag: '@end-code-block',
    render: (buffer, meta) =>
    {
        const style = meta.match(/\{(.+?)\}/)?.[1] || '';

        return `<div class="code-block"${style ? ` style="${style}"` : ''}><pre><code>${buffer.join('\n')}</code></pre></div>`;
    }
};