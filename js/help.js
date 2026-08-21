document.addEventListener("DOMContentLoaded", function () {

    const faqQuestions = document.querySelectorAll(".faq-question");

    faqQuestions.forEach(function (question) {

        question.addEventListener("click", function () {

            const answer = question.nextElementSibling;

            if (answer.style.display === "block") {
                answer.style.display = "none";
                question.querySelector("span").textContent = "+";
            } else {
                answer.style.display = "block";
                question.querySelector("span").textContent = "-";
            }

        });

    });

    const searchInput = document.getElementById("helpSearch");
    const searchButton = document.getElementById("searchBtn");
    const faqItems = document.querySelectorAll(".faq-item");

    searchButton.addEventListener("click", function () {
        const searchText = searchInput.value.toLowerCase();

        faqItems.forEach(function (item) {
            const question = item
                .querySelector(".faq-question")
                .textContent
                .toLowerCase();

            if (question.includes(searchText)) {
                item.style.display = "block";
            } else {
                item.style.display = "none";
            }
        });
    });

});

