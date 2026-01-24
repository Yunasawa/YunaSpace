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