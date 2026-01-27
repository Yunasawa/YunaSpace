export const IconComponent = {
    // Regex breakdown:
    // 1. #([\w-]+) -> Captures the type (e.g., solid-icon)
    // 2. \[([^\]]+)\] -> Captures the icon name (e.g., warning)
    pattern: /#([\w-]+-icon)\[([^\]]+)\]/g,

    process: (text) => {
        return text.replace(IconComponent.pattern, (match, type, name) => {
            const iconName = name.trim();
            const iconType = type.trim();

            // Result: <div class="solid-icon icon warning"></div>
            return `<div class="${iconType} icon ${iconName}"></div>`;
        });
    }
};