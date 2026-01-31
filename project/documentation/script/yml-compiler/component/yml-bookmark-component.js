export const BookmarkComponent = {
    bookmarks: [],

    // Matches @type-bookmark(...) OR @bookmark-space(...)
    match: (line) => line.startsWith('@') && (line.includes('-bookmark(') || line.includes('bookmark-space(')),

    render: (line, currentPage) => {
        // Handle the Space: @bookmark-space(20)
        if (line.startsWith('@bookmark-space')) {
            const m = line.match(/@bookmark-space\((\d+)\)/);
            if (m) {
                const height = m[1];
                BookmarkComponent.bookmarks.push({
                    type: 'spacer',
                    height: height,
                    page: currentPage
                });
            }
            return ''; // Spacers don't create visible content in the main body
        }

        // Handle standard bookmarks: @type-bookmark(TITLE|ID)
        const m = line.match(/^@([\w-]+)-bookmark\(([^|]+)\|([^)]+)\)$/);
        if (!m) return '';

        const type = m[1];
        const text = m[2].trim();
        const id = m[3].trim();

        BookmarkComponent.bookmarks.push({ id, text, type, page: currentPage });
        return `<div id="${id}" class="bookmark"></div>`;
    }
};