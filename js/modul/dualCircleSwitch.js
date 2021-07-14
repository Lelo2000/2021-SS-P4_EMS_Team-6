let currentUnderSection = "solution_design";
function switchSolutionUnderSection(id) {
  $(`#${currentUnderSection}`).removeClass("show");
  $(`#${currentUnderSection}`).addClass("hide");
  $(`#${id}`).removeClass("hide");
  $(`#${id}`).addClass("show");

  switch (id) {
    case "solution_design":
      table.style.backgroundImage = "url(../assets/img/solution_design.png)";
      $("#solution_modell_dualCircleContainer1").addClass("active");
      $("#solution_modell_dualCircleContainer2").removeClass("active");
      break;
    case "solution_prototyp":
      table.style.backgroundImage = "url(../assets/img/solution_prototyp.png)";
      $("#solution_modell_dualCircleContainer2").addClass("active");
      $("#solution_modell_dualCircleContainer1").removeClass("active");
      break;
  }

  currentUnderSection = id;
}
