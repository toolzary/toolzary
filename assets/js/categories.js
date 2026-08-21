/* =====================================
   CATEGORIES SEARCH PAGE
===================================== */


document.addEventListener("DOMContentLoaded", () => {


    const searchInput =
        document.querySelector(".categoriesSearch");


    const categoryGrid =
        document.querySelector(".categoryGrid");


    const featuredSection =
        document.querySelector(".featuredCategories")
            ?.closest(".section");

    const newSection =
        document.querySelector(".newCategories")
            ?.closest(".section");            


    const form =
        document.querySelector(".main-search, .search-wrapper");



    if (!searchInput || !categoryGrid) {
        return;
    }





    // Read ?query=
    const params =
        new URLSearchParams(window.location.search);


    const query =
        (params.get("query") || "").trim();





    if (searchInput) {

        searchInput.value = query;

    }






    // No search query
    // keep normal categories page
    if (!query) {
        return;
    }







    // Wait for data
    const waitForData = setInterval(() => {



        if (
            window.ToolzaryData &&
            window.ToolzaryData.categories &&
            typeof createCategoryCard === "function"
        ) {



            clearInterval(waitForData);


            searchCategories(query);



        }



    }, 50);









    // Submit search

    if (form && searchInput) {


        form.addEventListener("submit", e => {


            e.preventDefault();



            const value =
                searchInput.value.trim();



            if (!value) {
                return;
            }



            window.location.href =
                `/categories/?query=${encodeURIComponent(value)}`;



        });


    }









    function searchCategories(query) {


        const categories =
            window.ToolzaryData.categories;



        const q =
            query.toLowerCase();




        const results =
            Object.entries(categories)

            .map(([id, category]) => {


                let score = 0;



                const name =
                    category.name.toLowerCase();



                const desc =
                    (category.desc || "")
                    .toLowerCase();





                if (name === q)
                    score += 100;



                if (name.startsWith(q))
                    score += 80;



                if (name.includes(q))
                    score += 60;



                if (desc.includes(q))
                    score += 30;





                return {

                    id,
                    category,
                    score

                };



            })


            .filter(item => item.score > 0)



            .sort((a, b) =>
                b.score - a.score
            )



            .map(item => [

                item.id,
                item.category

            ]);





        renderCategoryResults(results, query);



    }









function renderCategoryResults(results, query) {

    // Hide sections first
    if (featuredSection) {
        featuredSection.style.display = "none";
    }

    if (newSection) {
        newSection.style.display = "none";
    }

    // Render results
    if (!results.length) {

        categoryGrid.innerHTML = `
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

                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>

                </svg>

                <h2>
                    No categories found for
                    <span class="query">"${query}"</span>
                </h2>

                <p>
                    Try another keyword.
                </p>

            </div>
        `;

    } else {

        categoryGrid.innerHTML = results
            .map(createCategoryCard)
            .join("");

        initToolCards(categoryGrid);
    }

    // Wait until the browser updates the layout, then scroll
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            categoryGrid.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        });
    });

}

});