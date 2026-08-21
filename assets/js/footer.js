/**
 * Footer Loader
 * --------------------------------------------
 * Injects footer content into:
 * <footer id="site-footer"></footer>
 *
 * Requires global:
 * - tools
 * - categories
 * --------------------------------------------
 */

(() => {
    "use strict";

    const CURRENT_YEAR = new Date().getFullYear();

    const FOOTER = {

        brand: {
            name: "Toolzary",
            tagline: "Professional online tools for everyone."
        },

        social: {
            github: "https://github.com/toolzary",
            twitter: "https://x.com/toolzary",
            youtube: "https://youtube.com/@toolzary"
        },

        quickLinks: [
            ["Home", "/"],
            ["About", "/about"],
            ["Contact", "/contact"]
        ],

        legalLinks: [
            ["Privacy Policy", "/privacy"],
            ["Terms & Conditions", "/terms"],
            ["Disclaimer", "/disclaimer"],
            ["Cookie Policy", "/cookies"]
     ],

        footerText:
            "Built for safety and efficiency. All rights reserved."

    };



    function createLinks(items) {

        return items
            .map(([label, url]) =>
                `<a href="${url}">${label}</a>`
            )
            .join("");

    }



    function getFeaturedTools() {

        if (typeof tools === "undefined")
            return [];


        return tools
            .filter(tool => tool.featured === true)
            .slice(0, 6)
            .map(tool => [
                tool.name,
                tool.link
            ]);

    }



function getFeaturedCategories() {

    if (typeof categories === "undefined")
        return [];


    return Object.entries(categories)
        .filter(([id, category]) =>
            id !== "all" &&
            category.showOnHomepage === true
        )
        .slice(0, 6)
        .map(([id, category]) => [
            category.name,
            `/categories/${id}`
        ]);

}

    function socialIcon(type) {

        const icons = {

            github:
            `<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.15 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.62.24 2.85.12 3.15.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>`,

            twitter:
            `<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`,

            youtube:
            `<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>`

        };


        return FOOTER.social[type]
            ?
            `
            <a href="${FOOTER.social[type]}"
               target="_blank"
               rel="noopener noreferrer"
               aria-label="${type}">
                ${icons[type]}
            </a>
            `
            :
            "";

    }





    function buildFooter() {


        return `

        <div class="footer-grid">


            <section class="footer-section">

                <h3>${FOOTER.brand.name}</h3>

                <p>${FOOTER.brand.tagline}</p>


                <div class="footer-social">

                    ${socialIcon("github")}

                    ${socialIcon("twitter")}

                    ${socialIcon("youtube")}

                </div>


            </section>




            <section class="footer-section">

                <h4>Quick Links</h4>

                ${createLinks(
                    FOOTER.quickLinks
                )}

            </section>




            <section class="footer-section">

                <h4>Legal</h4>

                ${createLinks(
                    FOOTER.legalLinks
                )}

            </section>





            <section class="footer-section">

                <h4>Featured Tools</h4>

                ${createLinks(
                    getFeaturedTools()
                )}

            </section>





<section class="footer-section">

    <h4>Featured Categories</h4>

    ${createLinks(
        getFeaturedCategories()
    )}

</section>


        </div>



        <div class="footer-bottom">

            © ${CURRENT_YEAR}
            ${FOOTER.brand.name}.
            ${FOOTER.footerText}

        </div>

        `;

    }





    window.initFooter = function() {


        const footer =
            document.getElementById(
                "site-footer"
            );


        if (!footer)
            return;



        footer.classList.add(
            "site-footer"
        );


        footer.innerHTML =
            buildFooter();


    };

})();