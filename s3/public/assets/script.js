// MOBILE HAMBURGER MENU

// Toggle the mobile menu and transform the bars to X
const menuToggle = document.getElementById("menuToggle");
const menu = document.getElementById("menu");

menuToggle.addEventListener("click", () => {
    menu.classList.toggle("active");
    menuToggle.classList.toggle("active");
});



// HOVER EFFECT ON MOBILE HOMEPAGE SINGLE TUTORIALS

function toggleTitle(element) {
    var title = element.querySelector('.title-overlay');
    title.style.opacity = (title.style.opacity === '1' ? '0' : '1');
}


// Get the button
let mybutton = document.getElementById("myBtn");

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function () { scrollFunction() };

function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        mybutton.style.display = "block";
    } else {
        mybutton.style.display = "none";
    }
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}


// GALLERY MODAL
function openModal(imgSrc) {
    document.getElementById("modalImg").src = imgSrc;
    document.querySelector('.modal').style.display = 'flex';
}

function closeModal() {
    document.querySelector('.modal').style.display = 'none';
}