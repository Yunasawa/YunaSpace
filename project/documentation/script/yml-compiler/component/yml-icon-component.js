export const IconComponent = {
    // Updated Regex:
    // (?:\{([\s\S]*?)\})? 
    // [\s\S]*? allows for multi-line styles and nested parentheses by being 
    // lazy and matching until the first closing '}' that follows a ']'
    pattern: /#([\w-]+-icon)\[([^\]]+)\](?:\{([\s\S]*?)\})?/g,

    process: (text) => {
        return text.replace(IconComponent.pattern, (match, type, name, style) => {
            const iconName = name.trim();
            const iconType = type.trim();

            // Clean up the style string: remove potential leading/trailing whitespace
            // and ensure no weird line breaks break the HTML attribute
            const inlineStyle = style ? ` style="${style.trim().replace(/\s+/g, ' ')}"` : '';

            return `<div class="${iconType} icon ${iconName}"${inlineStyle}></div>`;
        });
    }
};