const hamburger = document.querySelector('.hamburger');
const mobileNav = document.querySelector('.mobile-nav');


function hamburgerNav(){
    hamburger.classList.toggle('open');
    mobileNav.classList.toggle('hide');
    
}

hamburger.addEventListener('click', hamburgerNav)