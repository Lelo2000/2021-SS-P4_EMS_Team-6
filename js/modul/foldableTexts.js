let lastTextBoxOpen = "";

function toggleText(id) {
  console.log(id);
  if(lastTextBoxOpen){
    if(lastTextBoxOpen != id){
      if ($(`#${lastTextBoxOpen}`).hasClass("show")) {
        $(`#${lastTextBoxOpen}`).removeClass("show");
        $(`#${lastTextBoxOpen}`).addClass("hide");
      }
    }
  }
  if ($(`#${id}`).hasClass("hide")) {
    $(`#${id}`).removeClass("hide");
    $(`#${id}`).addClass("show");
  } else {
    $(`#${id}`).removeClass("show");
    $(`#${id}`).addClass("hide");
  }
  lastTextBoxOpen = id
}
