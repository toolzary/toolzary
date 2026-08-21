/* =====================================
   Toolzary Main JS
===================================== */


let tools = [];
let categories = {};



/* =====================================
LOAD DATA
===================================== */

async function loadToolsData() {

    try {

        const toolsResponse =
            await fetch("/data/tools.json");

        const categoriesResponse =
            await fetch("/data/categories.json");


        const toolsData =
            await toolsResponse.json();

        const categoriesData =
            await categoriesResponse.json();


        tools = Array.isArray(toolsData)
            ? toolsData
            : toolsData.tools || [];


        categories =
            categoriesData || {};


        window.ToolzaryData = {
            tools,
            categories
        };


        initializeSite();


    } catch(error) {

        console.error(
            "Failed loading tools/categories data:",
            error
        );

    }

}


/* =====================================
   INITIALIZE
===================================== */

function initializeSite() {

    updateStats();

    renderCategories();

    renderFeaturedCategories();
    
    renderNewCategories();

    renderFeaturedTools();

    renderNewTools();

    renderAllTools();

    renderCategoryTools();


    // Tool page
    renderRelatedTools();


    initRevealAnimations();


    if (typeof initFooter === "function") {
        initFooter();
    }

}





/* =====================================
   DYNAMIC STATS
===================================== */

function updateStats() {


    const toolCount =
        document.querySelectorAll(".toolCount");


    const categoryCount =
        document.querySelectorAll(".categoryCount");



    if(toolCount){

        toolCount.forEach(count => {
            count.textContent = tools.length;
        });

    }



    if(categoryCount){

        categoryCount.forEach(count => {
           count.textContent = Object.keys(categories).length;
        });

    }

}

/* ================================
       Categories renderar
================================ */
function renderCategories() {

    const container = document.querySelector(".categoryGrid");

    if (!container) return;

    let categoryList = Object.entries(categories);

    if (window.location.pathname === "/") {
        categoryList = categoryList
            .filter(([id, category]) => category.showOnHomepage)
            .slice(0, 6);
    }

    renderCategoryCards(container, categoryList);

}

/* ================================
       Featured Categories
================================ */

function renderFeaturedCategories() {

    const container = document.querySelector(".featuredCategories");

    if (!container) return;

    const featuredCategories = Object.entries(categories)
        .filter(([id, category]) =>
            category.featured === true
        );

    renderCategoryCards(container, featuredCategories);

}

/* ================================
       New categories
================================ */

function renderNewCategories() {

    const container = document.querySelector(".newCategories");

    if (!container) return;

    const newCategories = Object.entries(categories)
        .filter(([id, category]) =>
            category.new === true
        );

    renderCategoryCards(container, newCategories);

}

/* =====================================
   CATEGORY PAGE TOOLS
===================================== */

function renderCategoryTools() {

    const container =
        document.querySelector(".categoryTools");


    if (!container)
        return;


    const pathParts =
        window.location.pathname.split("/");


    const categoryId =
        pathParts[2];


    if (!categoryId)
        return;


    const categoryTools =
        tools.filter(tool =>
            tool.cat.includes(categoryId)
        );


    container.innerHTML =
        categoryTools
        .map(createToolCard)
        .join("");


    initToolCards(container);

}
/* =====================================
        Category Card Template
======================================*/

function createCategoryCard([id, category]) {

    const count = tools.filter(
        tool => tool.cat.includes(id)
    ).length;

    return `
        <a href="/categories/${id}" class="tool-card">

            ${category.new ? `
                <span class="new-badge">NEW</span>
            ` : ""}

            <div class="spotlight"></div>
            <div class="shimmer"></div>
            <div class="ripple"></div>

            <div class="tool-card-inner">

                <span class="tool-icon">
                    <img
                        src="${category.icon}"
                        alt="${category.name}"
                        width="40"
                        height="40"
                        loading="lazy"
                    >
                </span>

                <div class="tool-content">
                    <h3 class="tool-name">${category.name}</h3>

                    <p class="tool-desc">
                        ${category.desc || ""}
                    </p>

                    <span class="tool-badge">
                        ${count} Tools
                    </span>
                </div>

            </div>

        </a>
    `;
}

/* ===================================
           Category Card Renderer
===================================*/
function renderCategoryCards(container, categoryList) {

    container.innerHTML = categoryList
        .map(createCategoryCard)
        .join("");

    initToolCards(container);

}


/* =====================================
   TOOL CARD TEMPLATE
===================================== */

function createToolCard(tool) {

    const iconPath = tool.icon
        ? (tool.icon.startsWith("/") ? tool.icon : "/" + tool.icon)
        : "";

    const currentCategory =
       window.location.pathname.split("/")[2];


    const badgeCategory =
       currentCategory && tool.cat.includes(currentCategory)
           ? currentCategory
           : tool.cat[0];


    const categoryName =
       categories[badgeCategory]?.name || "";
    return `

    <a href="${tool.link}" class="tool-card">

        ${tool.new ? `
            <span class="new-badge">
                NEW
            </span>
        ` : ""}

        <div class="spotlight"></div>

        <div class="shimmer"></div>

        <div class="ripple"></div>

        <div class="tool-card-inner">

            <span class="tool-icon">
                <img
                    src="${iconPath}"
                    alt="${tool.name}"
                    width="40"
                    height="40"
                    loading="lazy"
                >
            </span>

            <div class="tool-content">

                <h3 class="tool-name">
                    ${tool.name}
                </h3>

                <p class="tool-desc">
                    ${tool.desc}
                </p>

                ${
                    categoryName
                    ? `
                        <span class="tool-badge">
                            ${categoryName}
                        </span>
                    `
                    : ""
                }

            </div>

        </div>

    </a>

    `;

}





/* =====================================
   TOOL CARD EFFECTS
===================================== */

function initToolCards(container = document) {


    const cards =
        container.querySelectorAll(".tool-card");



    cards.forEach((card,index)=>{


        // stagger animation

        card.style.setProperty(
            "--stagger-delay",
            `${index * 60}ms`
        );



        // spotlight effect

        card.addEventListener(
            "mousemove",
            (e)=>{


                const rect =
                    card.getBoundingClientRect();



                card.style.setProperty(
                    "--mouse-x",
                    `${e.clientX - rect.left}px`
                );


                card.style.setProperty(
                    "--mouse-y",
                    `${e.clientY - rect.top}px`
                );


            }
        );




        // ripple effect

        card.addEventListener(
            "click",
            (e)=>{


                const ripple =
                    card.querySelector(".ripple");


                if(!ripple)
                    return;



                const rect =
                    card.getBoundingClientRect();



                card.style.setProperty(
                    "--ripple-x",
                    `${e.clientX - rect.left}px`
                );


                card.style.setProperty(
                    "--ripple-y",
                    `${e.clientY - rect.top}px`
                );



                ripple.classList.remove(
                    "active"
                );


                void ripple.offsetWidth;


                ripple.classList.add(
                    "active"
                );


            }
        );



    });


}


/* ======================================
    FEATURED TOOLS
====================================== */


function renderFeaturedTools() {

    const container =
        document.querySelector(".featuredTools");


    if(!container)
        return;


    const featuredTools =
        tools.filter(tool => tool.featured === true);



    container.innerHTML =
        featuredTools
        .map(createToolCard)
        .join("");



    initToolCards(container);

}


/* ======================================
    New TOOLS
====================================== */


function renderNewTools() {

    const container =
        document.querySelector(".newTools");


    if(!container)
        return;


    const newTools =
        tools.filter(tool => tool.new === true);



    container.innerHTML =
        newTools
        .map(createToolCard)
        .join("");



    initToolCards(container);

}



/* ======================================
    All TOOLS
====================================== */


function renderAllTools() {

    const container =
        document.querySelector(".allTools");


    if(!container)
        return;


    const allTools = tools;



    container.innerHTML =
        allTools
        .map(createToolCard)
        .join("");



    initToolCards(container);

}

/* =====================================
   RELATED TOOLS FROM JSON
===================================== */

function renderRelatedTools() {

    const container =
        document.querySelector(".relatedTools");


    if (!container)
        return;



    const currentTool = tools.find(
    tool => tool.link === window.location.pathname
);



    if (!currentTool || !currentTool.related)
        return;



    const relatedTools =
        currentTool.related
        .map(id =>
            tools.find(tool =>
                tool.id === id
            )
        )
        .filter(Boolean);



    container.innerHTML =
        relatedTools
        .map(createToolCard)
        .join("");



    initToolCards(container);

}


/* =====================================
    Dark Mode Toggle
======================================*/

const darkModeToggleBtns =
    document.querySelectorAll("#darkToggle, .darkToggle");

const themeIcons =
    document.querySelectorAll(".themeIcon, .mobileThemeIcon");

let isDarkMode =
    localStorage.getItem("darkMode") === "true";



const themeLabels = document.querySelectorAll(".mobile-theme-label");

function applyDarkMode() {
    document.body.classList.toggle("dark", isDarkMode);

    themeIcons.forEach(icon => {
        icon.src = isDarkMode
            ? "/assets/icons/others/sun.svg"
            : "/assets/icons/others/moon.svg";

        icon.alt = isDarkMode ? "Light mode" : "Dark mode";
    });

    themeLabels.forEach(label => {
        label.textContent = isDarkMode
            ? "Light Mode"
            : "Dark Mode";
    });
}




function toggleDarkMode() {

    isDarkMode = !isDarkMode;


    localStorage.setItem(
        "darkMode",
        isDarkMode
    );


    applyDarkMode();

}





// Load saved mode when page opens

applyDarkMode();




// Buttons click

darkModeToggleBtns.forEach(button => {
    button.addEventListener(
        "click",
        toggleDarkMode
    );
});

/* =====================================
   SCROLL REVEAL ENGINE
===================================== */


function initRevealAnimations(){


const elements =
document.querySelectorAll(
`
.reveal,
.reveal-left,
.reveal-right,
.reveal-scale,
.reveal-fade,
.reveal-blur,
.reveal-rotate,
.stagger
`
);



if(!elements.length)
    return;



const observer =
new IntersectionObserver(
(entries)=>{


entries.forEach(entry=>{


if(entry.isIntersecting){


entry.target.classList.add(
"active"
);


observer.unobserve(
entry.target
);


}


});


},
{
threshold:.15
}
);



elements.forEach(el=>{


observer.observe(el);


});


}

/* ========================================
      FAQ Accordination
 ========================================*/     
document.addEventListener("DOMContentLoaded", () => {
  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach(item => {
    const button = item.querySelector(".faq-question");

    button.addEventListener("click", () => {
      const isActive = item.classList.contains("active");

      // Close all FAQs
      faqItems.forEach(faq => {
        faq.classList.remove("active");
      });

      // Open the clicked one if it wasn't already open
      if (!isActive) {
        item.classList.add("active");
      }
    });
  });
});

/* =========================================================
   TOOLZARY MOBILE MENU
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const header = document.getElementById("siteHeader");
    const menuToggle = document.getElementById("mobileMenuToggle");
    const mobileMenu = document.getElementById("mobileMenu");

    if (!header || !menuToggle || !mobileMenu) {
        return;
    }


    /* =====================================================
       OPEN / CLOSE MENU
    ===================================================== */

    function openMenu() {

        header.classList.add("menu-open");

        menuToggle.setAttribute(
            "aria-expanded",
            "true"
        );

        menuToggle.setAttribute(
            "aria-label",
            "Close menu"
        );

        mobileMenu.setAttribute(
            "aria-hidden",
            "false"
        );

        /*
         * Prevent the page behind the menu
         * from scrolling.
         */

        document.body.classList.add("menu-active");
    }


    function closeMenu() {

        header.classList.remove("menu-open");

        menuToggle.setAttribute(
            "aria-expanded",
            "false"
        );

        menuToggle.setAttribute(
            "aria-label",
            "Open menu"
        );

        mobileMenu.setAttribute(
            "aria-hidden",
            "true"
        );

        document.body.classList.remove("menu-active");
    }


    function toggleMenu() {

        const isOpen =
            header.classList.contains("menu-open");

        if (isOpen) {
            closeMenu();
        } else {
            openMenu();
        }

    }


    menuToggle.addEventListener(
        "click",
        toggleMenu
    );


    /* =====================================================
       CLOSE AFTER CLICKING A LINK
    ===================================================== */

    const mobileLinks =
        mobileMenu.querySelectorAll("a");

    mobileLinks.forEach(link => {

        link.addEventListener("click", () => {
            closeMenu();
        });

    });


    /* =====================================================
       ESC KEY
    ===================================================== */

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape" &&
                header.classList.contains("menu-open")
            ) {
                closeMenu();

                menuToggle.focus();
            }

        }
    );


    /* =====================================================
       RESIZE
       Close menu when returning to desktop.
    ===================================================== */

    window.addEventListener(
        "resize",
        () => {

            if (
                window.innerWidth > 768 &&
                header.classList.contains("menu-open")
            ) {
                closeMenu();
            }

        }
    );

});


/* =====================================
   START
===================================== */

document.addEventListener(
    "DOMContentLoaded",
    loadToolsData
);