if (sessionStorage.getItem("signedIn") !== "true")
    window.location.href = "login.html";
else
    document.addEventListener("DOMContentLoaded", () => {
        let email = localStorage.getItem("email");
        let nav = document.querySelector("nav.navbar");
        let navItems = nav.getElementsByClassName("nav-item");
        let ultimoNav = navItems[navItems.length - 1];
        ultimoNav.innerHTML = `<a class="nav-link" href="my-profile.html">${email}</a>`;

        document.getElementById('commentForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const d = new Date();
            const longDateTime = d.toISOString();
            const newComment = {
                product: parseInt(localStorage.getItem('productID')),
                score: document.getElementById('commentScore').valueAsNumber,
                description: document.getElementById('commentDescription').value,
                user: localStorage.getItem('email'),
                dateTime: `${longDateTime.slice(0, 10)} ${longDateTime.slice(11, 19)}`
            }
            let additionalComments = JSON.parse(localStorage.getItem(localStorage.getItem('productID')));
            if (additionalComments === null)
                additionalComments = [];
            additionalComments.push(newComment);
            showComments(additionalComments);
            localStorage.setItem(localStorage.getItem('productID'), JSON.stringify(additionalComments));
        })
    });