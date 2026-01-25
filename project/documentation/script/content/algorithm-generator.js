function copyCode(id) {
    const text = document.getElementById(id).innerText;
    navigator.clipboard.writeText(text);
    // Visual feedback
    const btn = event.target;
    const originalText = btn.innerText;
    btn.innerText = "COPIED!";
    setTimeout(() => btn.innerText = originalText, 2000);
}

fetch(RECORD_PATH + "algorithm.html")
    .then(res => res.text())
    .then(html => {
        const container = document.querySelector("#algorithm-content");
        container.innerHTML = html;
    })
    .catch(err => {
        console.error("Failed to load algorithm HTML:", err);
    });