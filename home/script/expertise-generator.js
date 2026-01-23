async function loadSkills() {
    const res = await fetch("record/expertise-record.json");
    const data = await res.json();

    document.getElementById("skills-title").textContent = data.title;

    const board = document.getElementById("skills-board");

    data.categories.forEach(category => {
        const details = document.createElement("details");

        const summary = document.createElement("summary");
        summary.textContent = category.title;
        details.appendChild(summary);

        const content = document.createElement("div");
        content.className = "foldout-content";

        if (category.description) {
            const desc = document.createElement("p");
            desc.className = "skill-category-desc";
            desc.textContent = category.description;
            content.appendChild(desc);
        }

        const ul = document.createElement("ul");
        ul.className = "skill-list";

        category.skills.forEach(skill => {
            const li = document.createElement("li");
            li.textContent = skill;
            ul.appendChild(li);
        });

        content.appendChild(ul);

        // Nested sections (e.g. UI Systems)
        if (category.nested) {
            category.nested.forEach(nested => {
                const nestedDiv = document.createElement("div");
                nestedDiv.className = "ui-nested";

                const title = document.createElement("h4");
                title.className = "nested-title";
                title.textContent = nested.title;

                const nestedUl = document.createElement("ul");
                nestedUl.className = "skill-list";

                nested.skills.forEach(skill => {
                    const li = document.createElement("li");
                    li.textContent = skill;
                    nestedUl.appendChild(li);
                });

                nestedDiv.appendChild(title);
                nestedDiv.appendChild(nestedUl);
                content.appendChild(nestedDiv);
            });
        }

        details.appendChild(content);
        board.appendChild(details);
    });
}

loadSkills();
