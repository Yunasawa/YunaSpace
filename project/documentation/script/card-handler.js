const params = new URLSearchParams(window.location.search);
const type = params.get("t");
const project = params.get("p");

const unitName = document.getElementById("unit-name");

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

        console.log("Project data loaded:", data);
    })
    .catch(err =>
    {
        console.error(err);
        unitName.textContent = "NOT FOUND";
    });

const RECORD_PATH = `../record/${type}/${project}/documentation/`;