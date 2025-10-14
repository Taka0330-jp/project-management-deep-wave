const questions = document.querySelectorAll(".question");


function accordionFaqs(event){
    const selected = event.currentTarget;
    const answer = selected.nextElementSibling;

    selected.classList.toggle('is-open')
    answer.classList.toggle('show')

    }

questions.forEach((question)=>{
    question.addEventListener('click', accordionFaqs)
});