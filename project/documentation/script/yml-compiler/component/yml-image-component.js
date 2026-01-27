export const ImageComponent = {
    // Matches #image[class](src|alt){style} or #image(src)
    match: (line) => line.startsWith('#image'),

    render: (line) => {
        // Regex breakdown:
        // 1. (?:\[([^\]]+)\])?         -> Group 1: Optional classes inside []
        // 2. \(([^)|]+)(?:\|([^)]+))?\) -> Group 2: Src, Group 3: Optional Alt inside ()
        // 3. (?:\{([^}]+)\})?          -> Group 4: Optional styles inside {}
        const m = line.match(/^#image(?:\[([^\]]+)\])?\(([^|)]+)(?:\|([^)]+))?\)(?:\{([^}]+)\})?$/);

        if (!m) return '';

        const extraClasses = m[1] ? m[1].split(',').map(c => c.trim()).join(' ') : '';
        const src = m[2].trim();
        const alt = m[3] ? m[3].trim() : ''; // Default to empty string if no alt provided
        const style = m[4] || '';

        const fullClasses = `image-item ${extraClasses}`.trim();
        const styleAttr = style ? ` style="${style}"` : '';
        const altAttr = alt ? ` alt="${alt}"` : '';

        return `<img src="${src}" class="${fullClasses}"${altAttr}${styleAttr}>`;
    }
};