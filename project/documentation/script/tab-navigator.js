const params = new URLSearchParams(window.location.search);

const type = params.get("t");
const project = params.get("p");

const unitName = document.getElementById("unit-name");

if (!type || !project) {
    unitName.textContent = "DOCUMENTATION";
}

const jsonPath = `../record/${type}/${project}/card.json`;

fetch(jsonPath)
    .then(res => {
        if (!res.ok) throw new Error("JSON not found");
        return res.json();
    })
    .then(data => {
        // ✅ Use name from JSON
        unitName.textContent = data.name.toUpperCase();

        console.log("Project data loaded:", data);
    })
    .catch(err => {
        console.error(err);
        unitName.textContent = "NOT FOUND";
    });

function autoResize(el) {
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
}

function showPage(pageId) {
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    event.currentTarget.classList.add('active');

    document.querySelectorAll('.page-section').forEach(section => section.classList.remove('active'));
    const target = document.getElementById(pageId);
    target.classList.add('active');

    // Resize textareas in the new section
    target.querySelectorAll('.code-view').forEach(autoResize);
    document.querySelector('.content-container').scrollTop = 0;
}