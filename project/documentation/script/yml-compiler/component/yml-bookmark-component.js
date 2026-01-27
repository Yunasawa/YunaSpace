export const BookmarkComponent = {
    bookmarks: [], // The array lives here

    match: (line) => line.startsWith('@') && line.includes('-bookmark('),

    render: (line) => {
        const m = line.match(/^@([\w-]+)-bookmark\((.+?)\)$/);
        if (!m) return '';

        const type = m[1];
        const text = m[2].trim();
        const id = text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');

        BookmarkComponent.bookmarks.push({ id, text, type });

        return `<div id="${id}" class="bookmark"></div>`;
    }
};