function AutoResize(el)
{
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
}

function ShowPage(pageId)
{
    document.querySelectorAll('.navigation-item').forEach(item => item.classList.remove('active'));
    event.currentTarget.classList.add('active');

    document.querySelectorAll('.page-section').forEach(section => section.classList.remove('active'));
    const target = document.getElementById(pageId);
    target.classList.add('active');

    target.querySelectorAll('.code-view').forEach(AutoResize);
    document.querySelector('.content-container').scrollTop = 0;
}

async function FileExists(path)
{
    try
    {
        const res = await fetch(path, { cache: "no-store" });
        return res.ok;
    }
    catch
    {
        return false;
    }
}

async function InitializeSidebar()
{
    const navGroups = document.querySelectorAll(".navigation-group");

    for (const group of navGroups)
    {
        const items = group.querySelectorAll(".navigation-item[data-page]");
        let hasAny = false;

        for (const item of items)
        {
            const page = item.dataset.page;
            const ymdPath = `${RECORD_PATH}${page}.txt`;

            const hasYmd = await FileExists(ymdPath);

            if (hasYmd)
            {
                item.classList.add("visible");
                hasAny = true;

                item.dataset.source = "txt";
            }
        }

        if (hasAny)
        {
            group.classList.add("visible");
        }
    }

    const firstVisible = document.querySelector(".navigation-item.visible");

    if (firstVisible)
    {
        firstVisible.click();
    }
}

InitializeSidebar();