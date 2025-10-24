import { blogPosts } from "../scripts/data.js";

const tagList = document.querySelector(".tag-list");
const cardGrid = document.querySelector(".cards-grid");
const cardTpl = document.getElementById("cardTemplate");


let activeTag = "All";

const allTags = ["All", ...new Set(blogPosts.flatMap(p => p.tag))];

function renderTagBtn(){
    tagList.innerHTML = "";
    allTags.forEach(tag =>{
        const li = document.createElement("li");
        const btn = document.createElement("button");
        btn.className = "tag-btn" + (tag === activeTag ? " is-active": "");
        btn.textContent = tag;
        btn.dataset.tag = tag;
        btn.addEventListener('click', ()=>{
            activeTag = tag;
            renderTagBtn();
            renderList();
        });
        li.appendChild(btn);
        tagList.appendChild(li);
    });
};

function createCard(p){
    const node = cardTpl.content.cloneNode(true);

    node.querySelector(".data-title").textContent = p.title;
    node.querySelector(".data-img").src = p.image;
    node.querySelector(".data-img").alt = p.alt || p.title;
    node.querySelector(".data-excerpt").textContent = p.excerpt;
    node.querySelector(".data-date").textContent = p.date || "";
    node.querySelector(".data-url").href = p.url || "#";

    return node;
};


function renderList(){
    const filtered = blogPosts.filter(p =>{
        let tagOk;
         if(activeTag === "All"){
            tagOk = true;
         }else {
            tagOk = (p.tag ?? []).includes(activeTag)
         }
         return tagOk;
    })

    cardGrid.innerHTML = "";
    const frag = document.createDocumentFragment();
    filtered.forEach(post =>{
        frag.appendChild(createCard(post));
    });
            cardGrid.appendChild(frag)
}

renderTagBtn();
renderList();