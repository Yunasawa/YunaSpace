export const LinkComponent = {
    // This regex looks for @text-link[class](content|url){style} anywhere in a string
    // Matches: @text-link[extra](text|url){style}
    pattern: /@link(?:\[([^\]]+)\])?\(([^|)]+)\|([^|)]+)\)(?:\{([^}]+)\})?/g,

    process: (text) => {
        return text.replace(LinkComponent.pattern, (match, extraClasses, content, url, style) => {
            const classes = extraClasses ? extraClasses.split(',').map(c => c.trim()).join(' ') : '';
            const fullClasses = `text-link ${classes}`.trim();
            const inlineStyle = style ? ` style="${style}"` : '';

            return `<a href="${url}" class="${fullClasses}"${inlineStyle} target="_blank">${content.trim()}</a>`;
        });
    }
};