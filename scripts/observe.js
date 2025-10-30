const items = document.querySelectorAll(".observe");

const observer = new IntersectionObserver((entries)=>{
    entries.forEach((entry) =>{
        entry.target.classList.toggle("action", entry.isIntersecting)
    });
},{
    threshold: 0.4
});

items.forEach((item) =>{
    observer.observe(item)
});