async function loadArticles() {
    const res = await fetch("record/typical-articles.json");
    const data = await res.json();

    const wrapper = document.getElementById("articleWrapper");

    data.articles.forEach(article => {
        const card = document.createElement("div");
        card.className = "article-card";

        const bg = document.createElement("div");
        bg.className = "project-bg";
        bg.style.backgroundImage = `url('${article.image}')`;

        const content = document.createElement("div");
        content.className = "article-content";

        const tag = document.createElement("span");
        tag.className = "tag";
        tag.style.fontSize = "0.5rem";
        tag.textContent = article.tag;

        const title = document.createElement("h4");
        title.textContent = article.title;

        // Preserve your mixed order (some tags first, some titles first)
        content.appendChild(title);
        content.appendChild(tag);

        card.appendChild(bg);
        card.appendChild(content);

        wrapper.appendChild(card);
    });
}

loadArticles();
