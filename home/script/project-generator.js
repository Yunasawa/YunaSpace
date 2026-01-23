const projectWrapper = document.getElementById("projectWrapper");
const sliderDots = document.getElementById("sliderDots");

function createDots(projectCount) {
    sliderDots.innerHTML = "";

    for (let i = 0; i < projectCount; i++) {
        const dot = document.createElement("div");
        dot.className = "project-dot";
        if (i === 0) dot.classList.add("active");

        dot.addEventListener("click", () => goToSlide(i));
        sliderDots.appendChild(dot);
    }
}

function updateDots(index) {
    document.querySelectorAll(".project-dot").forEach((dot, i) => {
        dot.classList.toggle("active", i === index);
    });
}

fetch("record/typical-projects.json")
    .then(response => {
        if (!response.ok) {
            throw new Error("Failed to load JSON");
        }
        return response.json();
    })
    .then(data => {
        renderProjects(data.projects);
        createDots(data.projects.length);
    })
    .catch(error => {
        console.error("Project load error:", error);
    });

function renderProjects(projects) {
    projects.forEach(project => {
        const thumbnail = project.thumbnail;
        const genres = project.genre.join(" / ");
        const classification =
            `${project.category.toUpperCase()} / ${project.dimension} / ${project.platform.toUpperCase()} / ${project.editor.toUpperCase()}`;

        const tagsHTML = project.keywords
            .map(tag => `<span class="tag">${tag}</span>`)
            .join("");

        const cardHTML = `
                            <div class="project-card-full">
                              <div class="project-bg"
                                style="background-image: url('${thumbnail}');">
                              </div>

                              <div class="project-info">
                                <h3>${project.name}</h3>

                                <div class="project-meta">
                                  <div class="meta-row">
                                    <span class="meta-label">CLASSIFICATION:</span>
                                    <span class="meta-value">${classification}</span>
                                  </div>
                                  <div class="meta-row">
                                    <span class="meta-label">GENRE:</span>
                                    <span class="meta-value">${genres}</span>
                                  </div>
                                </div>

                                <p class="project-description">${project.description}</p>

                                <div class="project-tags">
                                  ${tagsHTML}
                                </div>
                              </div>
                            </div>
                          `;

        projectWrapper.insertAdjacentHTML("beforeend", cardHTML);
    });

    totalSlides = projects.length;
    updateSlider();
}