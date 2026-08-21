/* =====================================
   SEARCH PAGE
===================================== */

document.addEventListener("DOMContentLoaded", () => {

    const searchInput = document.querySelector("#toolSearch, #mobileToolSearch");
    const searchGrid = document.getElementById("searchGrid");
    const searchHeading = document.getElementById("searchHeading");
    const searchInfo = document.getElementById("searchInfo");
    const searchSection = document.getElementById("searchResults");
    const forms = document.querySelectorAll(".main-search, .search-wrapper");
    const searchTags = document.querySelector(".search-tags");


    // Read ?query=
    const params = new URLSearchParams(window.location.search);
    const query = (params.get("query") || "").trim();

    if (searchInput) {
        searchInput.value = query;
    }

    // No query? Keep results hidden.
    if (!query) {
        return;
    }

    // Wait until tools are loaded
    const waitForTools = setInterval(() => {

        if (
            window.ToolzaryData &&
            window.ToolzaryData.tools &&
            typeof createToolCard === "function"
        ) {

            clearInterval(waitForTools);

            searchSection.hidden = false;
            performSearch(query);

        }

    }, 50);

    // Search again
    if (forms.length) {
    forms.forEach(form => {
        form.addEventListener("submit", e => {
            e.preventDefault();

            const input = form.querySelector(".toolSearch");

            if (!input) return;

            const value = input.value.trim();

            if (!value) return;

            window.location.href =
                `/search/?query=${encodeURIComponent(value)}`;
        });
    });
}

    function performSearch(query) {

        const tools = window.ToolzaryData.tools;
        const categories = window.ToolzaryData.categories;

        const q = query.toLowerCase();

        const results = tools
            .map(tool => {

                let score = 0;

                const name = tool.name.toLowerCase();
                const desc = tool.desc.toLowerCase();

                const cats = tool.cat
                    .map(id => categories[id]?.name || "")
                    .join(" ")
                    .toLowerCase();

                if (name === q) score += 100;
                if (name.startsWith(q)) score += 80;
                if (name.includes(q)) score += 60;
                if (desc.includes(q)) score += 30;
                if (cats.includes(q)) score += 20;

                return {
                    tool,
                    score
                };

            })
            .filter(item => item.score > 0)
            .sort((a, b) => b.score - a.score)
            .map(item => item.tool);

        renderResults(results, query);

    }

    function escapeHTML(str) {

        return str.replace(/[&<>"']/g, char => ({

            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            "\"": "&quot;",
            "'": "&#39;"

        })[char]);

    }

    function renderResults(results, query) {

        document.title =
            `Search Results for ${query} | Toolzary - Free Online Tools`;
            searchTags.classList.add("hidden")

        if (!results.length) {

            const safeQuery = escapeHTML(query);
             searchHeading.textContent = ``;
        searchInfo.textContent =
            ``;

            searchGrid.innerHTML = `
                <div class="no-results">

                    <svg
                        class="no-results-icon"
                        width="80"
                        height="80"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2">

                        <circle cx="11" cy="11" r="8"></circle>

                        <line
                            x1="21"
                            y1="21"
                            x2="16.65"
                            y2="16.65">
                        </line>

                    </svg>

                    <h2>No tool found for <span class="query">"${safeQuery}"</span></h2>

                    <p>
                        Try a different keyword or explore these categories.
                    </p>

                    <div class="suggest-links">

                        <a class="first-btn-outline" href="/categories/pdf-tools">
                            PDF Tools
                        </a>

                        <a class="first-btn-outline" href="/categories/text-tools">
                            Text Tools
                        </a>

                        <a class="first-btn-outline" href="/categories/finance-tools">
                            Finance Tools
                        </a>

                        <a class="first-btn-outline" href="/categories/seo-tools">
                            SEO Tools
                        </a>

                        <a class="first-btn-outline" href="/categories/calculators">
                            Calculators
                        </a>

                    </div>

                </div>
            `;

        } else {
            searchHeading.innerHTML = `Results for <span class="query">"${query}"</span><br>
            ${results.length} tool${results.length === 1 ? "" : "s"} found`;

            searchGrid.innerHTML =
                results
                    .map(createToolCard)
                    .join("");

            initToolCards(searchGrid);

        }

        searchSection.scrollIntoView({

            behavior: "smooth",
            block: "start"

        });

    }

});