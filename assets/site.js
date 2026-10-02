// whatsclip.app - the newest release, read from GitHub, and the feature strip on the start page.
(() => {
    const repo = "clafi-fw/cpp";
    const cacheKey = "whatsclip.releases";
    const cacheAge = 60 * 60 * 1000;

    // ---------- releases ----------

    // Every published release of the repository, newest first; kept for an hour per tab.
    async function releases() {
        try {
            const cached = JSON.parse(sessionStorage.getItem(cacheKey));
            if (cached && Date.now() - cached.at < cacheAge)
                return cached.list;
        } catch { }

        const response = await fetch(`https://api.github.com/repos/${repo}/releases?per_page=100`,
            { headers: { Accept: "application/vnd.github+json" } });
        if (!response.ok)
            throw new Error(`GitHub answered ${response.status}`);

        const list = (await response.json())
            .filter(release => !release.draft && !release.prerelease)
            .map(release => ({
                tag: release.tag_name,
                page: release.html_url,
                date: release.published_at,
                assets: release.assets.map(asset => ({
                    name: asset.name,
                    url: asset.browser_download_url,
                    size: asset.size,
                    digest: asset.digest || ""
                }))
            }));
        try {
            sessionStorage.setItem(cacheKey, JSON.stringify({ at: Date.now(), list }));
        } catch { }
        return list;
    }

    const versionOf = (release, app) => release.tag.slice(app.length + 2).split(".").map(Number);
    const newer = (a, b) => {
        for (let i = 0; i < 3; ++i)
            if ((a[i] || 0) !== (b[i] || 0))
                return (a[i] || 0) > (b[i] || 0);
        return false;
    };

    // The application's release with the highest version - five applications share the repository.
    function newest(list, app) {
        let best = null;
        for (const release of list) {
            if (!release.tag.startsWith(`${app}-v`))
                continue;
            if (!best || newer(versionOf(release, app), versionOf(best, app)))
                best = release;
        }
        return best;
    }

    const megabytes = bytes => `${(bytes / 1048576).toFixed(1)} MB`;
    const longDate = iso => new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
    const each = (selector, apply) => document.querySelectorAll(selector).forEach(apply);

    function showWhatsClip(release) {
        const version = versionOf(release, "WhatsClip").join(".");
        each("[data-version]", e => e.textContent = version);
        each("[data-date]", e => e.textContent = longDate(release.date));
        each("a[data-release-page]", e => e.href = release.page);

        const kinds = { windows: "-windows-x64.zip", linux: "-linux-x86_64.tar.gz" };
        for (const [kind, ending] of Object.entries(kinds)) {
            const asset = release.assets.find(a => a.name.endsWith(ending));
            if (!asset)
                continue;
            each(`a[data-asset="${kind}"]`, e => e.href = asset.url);
            each(`[data-asset-name="${kind}"]`, e => e.textContent = asset.name);
            each(`[data-asset-size="${kind}"]`, e => e.textContent = `- ${megabytes(asset.size)}`);
            if (asset.digest.startsWith("sha256:"))
                each(`[data-asset-digest="${kind}"]`, e => e.innerHTML = `<code>${asset.digest.slice(7)}</code>`);
        }
    }

    function showThemes(release) {
        each("a[data-themes]", e => e.href = release.page);
    }

    // The page as written names 0.1.0 and stays as it is when GitHub cannot be reached.
    releases().then(list => {
        const whatsClip = newest(list, "WhatsClip");
        if (whatsClip)
            showWhatsClip(whatsClip);
        const themes = newest(list, "Themes");
        if (themes)
            showThemes(themes);
    }).catch(() => { });

    // ---------- the feature strip ----------

    const strip = document.querySelector(".fb-strip");
    if (!strip)
        return;

    document.documentElement.classList.add("js");
    const tabs = [...strip.querySelectorAll('a[role="tab"]')];
    const panels = tabs.map(tab => document.getElementById(tab.hash.slice(1)));

    function select(index, focus) {
        tabs.forEach((tab, i) => {
            tab.setAttribute("aria-selected", i === index);
            tab.tabIndex = i === index ? 0 : -1;
        });
        panels.forEach((panel, i) => panel.hidden = i !== index);
        if (focus)
            tabs[index].focus();
    }

    const indexOfHash = () => tabs.findIndex(tab => tab.hash === location.hash);

    strip.addEventListener("click", event => {
        const tab = event.target.closest('a[role="tab"]');
        if (!tab)
            return;
        event.preventDefault();
        select(tabs.indexOf(tab), false);
        history.replaceState(null, "", tab.hash);
    });

    strip.addEventListener("keydown", event => {
        const current = tabs.indexOf(document.activeElement);
        if (current < 0)
            return;
        const moves = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
        let next = current;
        if (event.key in moves)
            next = Math.min(Math.max(current + moves[event.key], 0), tabs.length - 1);
        else if (event.key === "Home")
            next = 0;
        else if (event.key === "End")
            next = tabs.length - 1;
        else
            return;
        event.preventDefault();
        select(next, true);
        history.replaceState(null, "", tabs[next].hash);
    });

    addEventListener("hashchange", () => {
        const index = indexOfHash();
        if (index >= 0)
            select(index, false);
    });

    select(Math.max(indexOfHash(), 0), false);
})();
