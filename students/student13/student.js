const text = "จบอาหารมาเรียนไอที (ทำไม)❔🥑";
let index = 0;

function typingEffect(){
  document.querySelector(".typing").innerHTML =
  text.slice(0,index);

  index++;

  if(index <= text.length){
    setTimeout(typingEffect,100);
  }
}

typingEffect();

function changeMode(){
  document.body.classList.toggle("dark");
}