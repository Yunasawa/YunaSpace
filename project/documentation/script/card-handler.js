const params = new URLSearchParams(window.location.search);
const type = params.get("t");
const project = params.get("p");

const unitName = document.getElementById("unit-name");
const iconImage = document.getElementById("icon-image");
const googlePlay = document.getElementById("google-play");
const githubRepo = document.getElementById("github-repo");

if (!type || !project)
{
    unitName.textContent = "DOCUMENTATION";
}

const jsonPath = `../record/${type}/${project}/card.json`;

fetch(jsonPath)
    .then(res =>
    {
        if (!res.ok) throw new Error("JSON not found");
        return res.json();
    })
    .then(data =>
    {
        unitName.textContent = data.name.toUpperCase();
        document.title = `${type.toUpperCase()}: ${data.name}`;
        iconImage.src = `../record/${type}/${project}/image/icon.png`;

        if (data.github === "") {
            githubRepo.lastChild.textContent = "PRIVATE";
            githubRepo.classList.add("private");
            githubRepo.classList.remove("primary");
        }
        else {
            githubRepo.lastChild.textContent = "PUBLIC";
            githubRepo.classList.remove("private");
            githubRepo.classList.add("primary");
            githubRepo.href = data.github;
        }

        if (data.play === "") googlePlay.style.display = "none";
        else googlePlay.href = data.play;

        console.log("Project data loaded:", data);
    })
    .catch(err =>
    {
        console.error(err);
        unitName.textContent = "NOT FOUND";
    });

const RECORD_PATH = `../record/${type}/${project}/documentation/`;