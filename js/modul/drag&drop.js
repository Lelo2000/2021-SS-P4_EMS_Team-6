// Die Funktion wurde mit Hilfe dieses Tutorials von selfhtml.org erstellt:
// https://wiki.selfhtml.org/wiki/JavaScript/Tutorials/Drag_and_Drop
let textBoxPositions = [
  "textContainerTopLeft",
  "textContainerTopRight",
  "textContainerBottomRight",
  "textContainerBottomLeft",
];

let oldTextBoxPosition = new Map();
let tableInformation;
let modellHeight;
let modellWidth;
let hitBoxes;

// drag_n_drop.js
// 6. 1. 2021
// Alle Elemente mit der Klasse "draggable" werden verschiebbar gemacht
document.addEventListener(
  "DOMContentLoaded",
  function () {
    ("use strict");

    document
      .getElementById("tutorial")
      .addEventListener("click", changeOverlayText);

    document.getElementById("skip").addEventListener("click", skipOverlay);

    function skipOverlay() {
      $(`#teamExplanation`).removeClass("showFlex");
      $(`#teamExplanation`).addClass("hide");

      $(`#navExplanation`).removeClass("showFlex");
      $(`#navExplanation`).addClass("hide");

      $(`#trailerExplanation`).removeClass("showFlex");
      $(`#trailerExplanation`).addClass("hide");

      $(`#explanationOverlay`).removeClass("showFlex");
      $(`#explanationOverlay`).addClass("hide");

      $(`#tutorialButton`).removeClass("showFlex");
      $(`#tutorialButton`).addClass("hide");
    }

    function changeOverlayText() {
      if (countTut === 0) {
        countTut++;
        $(`#teamExplanation`).removeClass("showFlex");
        $(`#teamExplanation`).addClass("hide");

        $(`#navExplanation`).removeClass("hide");
        $(`#navExplanation`).addClass("showFlex");
      } else if (countTut === 1) {
        countTut++;
        $(`#navExplanation`).removeClass("showFlex");
        $(`#navExplanation`).addClass("hide");

        $(`#trailerExplanation`).removeClass("hide");
        $(`#trailerExplanation`).addClass("showFlex");
      } else if (countTut === 2) {
        $(`#trailerExplanation`).removeClass("showFlex");
        $(`#trailerExplanation`).addClass("hide");

        $(`#explanationOverlay`).removeClass("showFlex");
        $(`#explanationOverlay`).addClass("hide");

        $(`#tutorialButton`).removeClass("showFlex");
        $(`#tutorialButton`).addClass("hide");
      }
    }

    let student = document.getElementById("student_modell");
    let teacher = document.getElementById("teacher_modell");
    let solution = document.getElementById("solution_modell");
    let currentElement = "";
    let currentElementMode = "";

    const table = document.getElementById("table");
    modellHeight = $(".draggable").height();
    modellWidth = $(".draggable").width();

    tableInformation = table.getBoundingClientRect();

    hitBoxes = [
      {
        x: 0,
        y: 0,
        width: (tableInformation.left + tableInformation.right) / 2,
        height: (tableInformation.top + tableInformation.bottom) / 2,
      },
      {
        x: (tableInformation.left + tableInformation.right) / 2,
        y: 0,
        width: tableInformation.left + tableInformation.right,
        height: (tableInformation.top + tableInformation.bottom) / 2,
      },
      {
        x: (tableInformation.left + tableInformation.right) / 2,
        y: (tableInformation.top + tableInformation.bottom) / 2,
        width: tableInformation.left + tableInformation.right,
        height: tableInformation.top + tableInformation.bottom,
      },
      {
        x: 0,
        y: (tableInformation.top + tableInformation.bottom) / 2,
        width: (tableInformation.left + tableInformation.right) / 2,
        height: tableInformation.top + tableInformation.bottom,
      },
    ];

    student.setAttribute("mode", "false");
    teacher.setAttribute("mode", "false");
    solution.setAttribute("mode", "false");

    // Klasse für verschiebbare Elemente
    const drag_class = "draggable";
    // Prüfen, welche Eventmodelle unterstützt werden und welches verwendet werden soll
    const pointer_event = "PointerEvent" in window;
    const touch_event = "TouchEvent" in window && !pointer_event;
    // Einige Variablen
    let pos0; // Pointerposition bei down
    let start; // Position des Dragobjekts bei down
    let zmax = 1000; // Start z-Index für die Dragelemente, muss evtl. angepasst werden
    let dragele = null; // Das aktuelle Dragelement

    let targetText = [];

    // Bestimmen der Pointerposition
    function get_pointer_pos(e) {
      let posx = 0,
        posy = 0;
      if (
        touch_event &&
        e.targetTouches &&
        e.targetTouches[0] &&
        e.targetTouches[0].clientX
      ) {
        posx = e.targetTouches[0].clientX;
        posy = e.targetTouches[0].clientY;
      } else if (e.clientX) {
        posx = e.clientX;
        posy = e.clientY;
      }
      return {
        x: posx,
        y: posy,
      };
    } // get_pointer_pos
    //Eventhandler für pointerdown, touchstart oder mousedown
    function handle_down(e) {
      const pos = get_pointer_pos(e);
      down(e, pos);

      if (e.target.id === "student_modell") {
        currentElement = student;
        currentElementMode = currentElement.getAttribute("mode");
      } else if (e.target.id === "teacher_modell") {
        currentElement = teacher;
        currentElementMode = currentElement.getAttribute("mode");
      } else if (e.target.id === "solution_modell") {
        currentElement = solution;
        currentElementMode = currentElement.getAttribute("mode");
      }
    } // handle_down
    //Eventhandler für pointermove, touchmove oder mousemove
    function handle_move(e) {
      const pos = get_pointer_pos(e);
      move(e, pos);
    } // handle_move
    //Eventhandler für pointerup, touchend oder mouseup
    function handle_up(e) {
      const table = document.getElementById("table");
      const modellHeight = $(".draggable").height();
      const modellWidth = $(".draggable").width();

      const tableInformation = table.getBoundingClientRect();

      const pos = get_pointer_pos(e);

      if (
        e.target.id === "solution_modell" ||
        e.target.id === "teacher_modell" ||
        e.target.id === "student_modell"
      ) {
        if (
          pos.x <= tableInformation.right - modellWidth / 2 &&
          pos.x >= tableInformation.left + modellWidth / 2 &&
          pos.y <= tableInformation.bottom - modellHeight / 2 &&
          pos.y >= tableInformation.top + modellHeight / 2 &&
          currentElementMode === "false"
        ) {
          targetText.push(e.target.id);
          currentElement.setAttribute("mode", "true");
          $(`#${e.target.id}_circleContainer`).removeClass("hide");
          $(`#${e.target.id}_circleContainer`).addClass("show");
          if (targetText.includes("solution_modell")) {
            $(`#solution_modell_dualCircleContainer1`).removeClass("show");
            $(`#solution_modell_dualCircleContainer1`).addClass("hide");
            $(`#solution_modell_dualCircleContainer2`).removeClass("show");
            $(`#solution_modell_dualCircleContainer2`).addClass("hide");
            $(`#solution_modell_circleContainer`).addClass("show");
            $(`#solution_modell_circleContainer`).removeClass("hide");
          }
          // currentElement.style.border = "25px solid rgba(255, 255, 255, 0.5)";
        } else if (
          pos.x <= tableInformation.right - modellWidth / 2 &&
          pos.x >= tableInformation.left + modellWidth / 2 &&
          pos.y <= tableInformation.bottom - modellHeight / 2 &&
          pos.y >= tableInformation.top + modellHeight / 2 &&
          currentElementMode === "true"
        ) {
          // Leere Funktion, um zu verhindern, dass es andauernt switched
        } else {
          $(`#${e.target.id}_circleContainer`).removeClass("show");
          $(`#${e.target.id}_circleContainer`).addClass("hide");
          $(`#solution_modell_dualCircleContainer1`).removeClass("show");
          $(`#solution_modell_dualCircleContainer1`).addClass("hide");
          $(`#solution_modell_dualCircleContainer2`).removeClass("show");
          $(`#solution_modell_dualCircleContainer2`).addClass("hide");
          if (targetText.includes(e.target.id)) {
            targetText.splice(targetText.indexOf(e.target.id), 1);
            currentElement.setAttribute("mode", "false");
          }
        }
      }

      up(e);
      showActiveSection();
    } // handle_up

    function conflictCheck() {
      let student_text = document.getElementById("student_text");
      let teacher_text = document.getElementById("teacher_text");
      let teacher_student_text = document.getElementById(
        "teacher_student_text"
      );
      let teacher_solution_text = document.getElementById(
        "teacher_solution_text"
      );
      let teacher_student_solution_text = document.getElementById(
        "teacher_student_solution_text"
      );

      let student_text_information = student_text.getBoundingClientRect();
      let teacher_text_information = teacher_text.getBoundingClientRect();
      let teacher_student_text_information =
        teacher_student_text.getBoundingClientRect();
      let teacher_solution_text_information =
        teacher_solution_text.getBoundingClientRect();
      let teacher_student_solution_text_information =
        teacher_student_solution_text.getBoundingClientRect();

      let teacher_modell_information = teacher_modell.getBoundingClientRect();
      let solution_modell_information = solution_modell.getBoundingClientRect();
      let student_modell_information = student_modell.getBoundingClientRect();

      //lehrer text
      if (
        teacher_modell_information.left <= teacher_text_information.right &&
        teacher_modell_information.left + modellWidth >=
          teacher_text_information.left &&
        teacher_modell_information.bottom >= teacher_text_information.top &&
        teacher_modell_information.top <= teacher_text_information.bottom
      ) {
      }
      //student text
      if (
        student_modell_information.left <= student_text_information.right &&
        student_modell_information.left + modellWidth >=
          student_text_information.left &&
        student_modell_information.bottom >= student_text_information.top &&
        student_modell_information.top <= student_text_information.bottom
      ) {
      }
      //solution text

      //teacher student
      if (
        (teacher_modell_information.left <=
          teacher_student_text_information.right &&
          teacher_modell_information.left + modellWidth >=
            teacher_student_text_information.left &&
          teacher_modell_information.bottom >=
            teacher_student_text_information.top &&
          teacher_modell_information.top <=
            teacher_student_text_information.bottom) ||
        (student_modell_information.left <=
          teacher_student_text_information.right &&
          student_modell_information.left + modellWidth >=
            teacher_student_text_information.left &&
          student_modell_information.bottom >=
            teacher_student_text_information.top &&
          student_modell_information.top <=
            teacher_student_text_information.bottom)
      ) {
      }

      if (targetText.includes("teacher_modell") && targetText.length === 1) {
        newPositionTextBox("teacher_text", [teacher_modell_information]);
      }
      if (targetText.includes("student_modell") && targetText.length === 1) {
        newPositionTextBox("student_text", [student_modell_information]);
      }

      if (targetText.includes("solution_modell") && targetText.length === 1) {
        newPositionTextBox("solution_text", [solution_modell_information]);
      }

      if (
        targetText.includes("teacher_modell") &&
        targetText.includes("student_modell") &&
        targetText.length === 2
      ) {
        newPositionTextBox("teacher_student_text", [
          student_modell_information,
          teacher_modell_information,
        ]);
      }

      if (
        targetText.includes("solution_modell") &&
        targetText.includes("student_modell") &&
        targetText.length === 2
      ) {
        newPositionTextBox("student_solution_text", [
          student_modell_information,
          solution_modell_information,
        ]);
      }

      if (
        targetText.includes("solution_modell") &&
        targetText.includes("teacher_modell") &&
        targetText.length === 2
      ) {
        newPositionTextBox("teacher_solution_text", [
          teacher_modell_information,
          solution_modell_information,
        ]);
      }

      //alle drei

      if (
        targetText.includes("solution_modell") &&
        targetText.includes("teacher_modell") &&
        targetText.includes("student_modell")
      ) {
        newPositionTextBox("teacher_student_solution_text", [
          student_modell_information,
          teacher_modell_information,
          solution_modell_information,
        ]);
      }
    }

    function newPositionTextBox(textBoxId, modells) {
      let hit = true;
      let count = 0;
      do {
        // console.log("teste count: " + count);
        hit = false;
        for (let modell in modells) {
          // console.log(
          //   modells[modell].left >= hitBoxes[count].x &&
          //     modells[modell].left <= hitBoxes[count].width &&
          //     modells[modell].top >= hitBoxes[count].y &&
          //     modells[modell].top <= hitBoxes[count].height,
          //   modells[modell].right >= hitBoxes[count].x &&
          //     modells[modell].right <= hitBoxes[count].width &&
          //     modells[modell].top >= hitBoxes[count].y &&
          //     modells[modell].top <= hitBoxes[count].height,
          //   modells[modell].left >= hitBoxes[count].x &&
          //     modells[modell].left <= hitBoxes[count].width &&
          //     modells[modell].bottom >= hitBoxes[count].y &&
          //     modells[modell].bottom <= hitBoxes[count].height,
          //   modells[modell].right >= hitBoxes[count].x &&
          //     modells[modell].right <= hitBoxes[count].width &&
          //     modells[modell].bottom >= hitBoxes[count].y &&
          //     modells[modell].bottom <= hitBoxes[count].height
          // );
          // console.log(
          //   modells[modell].top,
          //   modells[modell].right,
          //   modells[modell].bottom,
          //   modells[modell].left
          // );
          // console.log(
          //   hitBoxes[count].y,
          //   hitBoxes[count].width,
          //   hitBoxes[count].height,
          //   hitBoxes[count].x
          // );
          if (
            (modells[modell].left >= hitBoxes[count].x &&
              modells[modell].left <= hitBoxes[count].width &&
              modells[modell].top >= hitBoxes[count].y &&
              modells[modell].top <= hitBoxes[count].height) ||
            (modells[modell].right >= hitBoxes[count].x &&
              modells[modell].right <= hitBoxes[count].width &&
              modells[modell].top >= hitBoxes[count].y &&
              modells[modell].top <= hitBoxes[count].height) ||
            (modells[modell].left >= hitBoxes[count].x &&
              modells[modell].left <= hitBoxes[count].width &&
              modells[modell].bottom >= hitBoxes[count].y &&
              modells[modell].bottom <= hitBoxes[count].height) ||
            (modells[modell].right >= hitBoxes[count].x &&
              modells[modell].right <= hitBoxes[count].width &&
              modells[modell].bottom >= hitBoxes[count].y &&
              modells[modell].bottom <= hitBoxes[count].height)
          ) {
            hit = true;
            // console.log("Index von modells hat gehittet: " + modell);
          }
        }
        if (hit) {
          count++;
        }
      } while (hit && count < textBoxPositions.length);
      if (oldTextBoxPosition.has(textBoxId)) {
        if (
          $(`#${textBoxId}`).hasClass(
            textBoxPositions[oldTextBoxPosition.get(textBoxId)]
          )
        ) {
          // console.log(
          //   "entferne css klasse: " +
          //     textBoxPositions[oldTextBoxPosition.get(textBoxId)]
          // );
          $(`#${textBoxId}`).removeClass(
            textBoxPositions[oldTextBoxPosition.get(textBoxId)]
          );
        }
      }
      if (count < textBoxPositions.length) {
        // console.log("vergebe css-klasse: " + textBoxPositions[count]);
        $(`#${textBoxId}`).addClass(textBoxPositions[count]);
        oldTextBoxPosition.set(textBoxId, count);
      } else {
        // console.log("vergebe Standard Klasse: " + textBoxPositions[0]);
        $(`#${textBoxId}`).addClass(textBoxPositions[0]);
        oldTextBoxPosition.set(textBoxId, 0);
      }
    }

    function showActiveSection() {
      if (
        targetText.includes("solution_modell") &&
        targetText.includes("teacher_modell") &&
        targetText.includes("student_modell")
      ) {
        id = "teacher_student_solution";
        switchActiveSection(id);
        table.style.backgroundImage =
          "url(./assets/img/teacher_student_solution.png)";
      } else if (
        targetText.includes("teacher_modell") &&
        targetText.includes("student_modell")
      ) {
        id = "teacher_student";
        switchActiveSection(id);
        table.style.backgroundImage = "url(./assets/img/teacher_student.png)";
      } else if (
        targetText.includes("solution_modell") &&
        targetText.includes("student_modell")
      ) {
        id = "student_solution";
        switchActiveSection(id);
        table.style.backgroundImage = "url(./assets/img/student_solution.png)";
      } else if (
        targetText.includes("solution_modell") &&
        targetText.includes("teacher_modell")
      ) {
        id = "teacher_solution";
        switchActiveSection(id);
        table.style.backgroundImage = "url(./assets/img/teacher_solution.png)";
      } else if (
        targetText.includes("teacher_modell") &&
        targetText.length === 1
      ) {
        id = "teacher";
        switchActiveSection(id);
        table.style.backgroundImage = "url(./assets/img/teacher.png)";
      } else if (
        targetText.includes("student_modell") &&
        targetText.length === 1
      ) {
        id = "student";
        switchActiveSection(id);
        table.style.backgroundImage = "url(./assets/img/student.png)";
      } else if (
        targetText.includes("solution_modell") &&
        targetText.length === 1
      ) {
        id = "solution";
        switchActiveSection(id);
        $(`#solution_modell_circleContainer`).removeClass("show");
        $(`#solution_modell_circleContainer`).addClass("hide");
        $(`#solution_modell_dualCircleContainer1`).removeClass("hide");
        $(`#solution_modell_dualCircleContainer1`).addClass("show");
        $(`#solution_modell_dualCircleContainer2`).removeClass("hide");
        $(`#solution_modell_dualCircleContainer2`).addClass("show");
        if (currentUnderSection === "solution_design") {
          table.style.backgroundImage =
            "url(./assets/img/solution_design.png)";
        } else if (currentUnderSection === "solution_prototyp") {
          table.style.backgroundImage =
            "url(./assets/img/solution_prototyp.png)";
        }
      } else {
        id = "team";
        switchActiveSection(id);
        table.style.backgroundImage = "none";
      }
      conflictCheck();
    }

    //Eventhandler für keydown
    function handle_keydown(e) {
      const keyCode = e.keyCode;
      let xwert = 0,
        ywert = 0;
      if (
        keyCode &&
        (keyCode == 27 ||
          keyCode == 37 ||
          keyCode == 38 ||
          keyCode == 39 ||
          keyCode == 40)
      ) {
        let delta = e.shiftKey ? 10 : 1;
        down(e, {
          x: 0,
          y: 0,
        });
        switch (keyCode) {
          case 37: // links
            xwert = -delta;
            break;
          case 38: // rauf
            ywert = -delta;
            break;
          case 39: // rechts
            xwert = delta;
            break;
          case 40: // runter
            ywert = delta;
            break;
          case 27: // Escape
            esc();
            up(e);
            return;
            break;
        }
        move(e, {
          x: xwert,
          y: ywert,
        });
        up(e);
      }
    } // keydown
    // Auswahl des Dragelements und Start der Dragaktion
    function down(e, pos) {
      const target = parent(e.target, drag_class);

      if (target) {
        document.body.style.touchAction = "none";
        e.preventDefault();
        dragele = target;
        start = {
          x: dragele.offsetLeft,
          y: dragele.offsetTop,
        };
        pos0 = pos;
        dragele.style.zIndex = ++zmax;
        dragele.focus();
      }
    } // down
    // Bewegen des Dragelements
    function move(e, pos) {
      if (dragele) {
        e.preventDefault();
        dragele.style.left = start.x + pos.x - pos0.x + "px";
        dragele.style.top = start.y + pos.y - pos0.y + "px";
      }
    } // move
    // Ende der Aktion
    function up(e) {
      if (dragele) {
        dragele = null;
        document.body.style.touchAction = "auto";
      }
    } // up
    // Defokussieren bei ESC-Taste
    function esc() {
      if (dragele) dragele.blur();
    } // esc
    // Dragbares Element mit Tab-Index für die Fokussierbarkeit und Eventhandler für Unterdrückung der Standardaktion versehen
    function finish(ele) {
      ele.tabIndex = 0;
      if (!pointer_event) {
        ele.addEventListener(
          "touchmove",
          function (e) {
            e.preventDefault();
          },
          false
        );
      }
    } // finish
    // Vorfahrenelement mit Klasse classname suchen
    function parent(child, classname) {
      if (child && "closest" in child) return child.closest("." + classname);
      let ele = child;
      while (ele) {
        if (ele.classList && ele.classList.contains(classname)) return ele;
        else ele = ele.parentElement;
      }
      return null;
    } // parent
    // Alle Eventhandler notieren
    if (pointer_event) {
      document.body.addEventListener("pointerdown", handle_down, false);
      document.body.addEventListener("pointermove", handle_move, false);
      document.body.addEventListener("pointerup", handle_up, false);
    } else if (touch_event) {
      document.body.addEventListener("touchstart", handle_down, false);
      document.body.addEventListener("touchmove", handle_move, false);
      document.body.addEventListener("touchend", handle_up, false);
    } else {
      document.body.addEventListener("mousedown", handle_down, false);
      document.body.addEventListener("mousemove", handle_move, false);
      document.body.addEventListener("mouseup", handle_up, false);
    }
    document.body.addEventListener("keydown", handle_keydown, false);
    // finish für alle verschiebbaren Elemente aufrufen
    const draggable = document.querySelectorAll("." + drag_class);
    for (let i = 0; i < draggable.length; i++) {
      finish(draggable[i]);
    }
    // css-Angaben für die Bedienbarkeit
    const style = document.createElement("style");
    style.innerText =
      "." +
      drag_class +
      ":focus { outline: 2px solid blue; } " +
      "." +
      drag_class +
      " { position: absolute; cursor: move; touch-action: none; } ";
    document.head.appendChild(style);
    // finish für nachträglich erzeugte verschiebbare Elemente aufrufen
    new MutationObserver(function (mutationsList) {
      for (let i = 0; i < mutationsList.length; i++) {
        if (mutationsList[i].type === "childList") {
          for (let j = 0; j < mutationsList[i].addedNodes.length; j++) {
            if (
              mutationsList[i].addedNodes[j].classList &&
              mutationsList[i].addedNodes[j].classList.contains(drag_class)
            ) {
              finish(mutationsList[i].addedNodes[j]);
            }
          }
        }
      }
    }).observe(document.body, {
      childList: true,
      subtree: true,
    });
    window.onresize = () => {
      const table = document.getElementById("table");
      tableInformation = table.getBoundingClientRect();
      modellHeight = $(".draggable").height();
      modellWidth = $(".draggable").width();
      hitBoxes = [
        {
          x: 0,
          y: 0,
          width: (tableInformation.left + tableInformation.right) / 2,
          height: (tableInformation.top + tableInformation.bottom) / 2,
        },
        {
          x: (tableInformation.left + tableInformation.right) / 2,
          y: 0,
          width: tableInformation.left + tableInformation.right,
          height: (tableInformation.top + tableInformation.bottom) / 2,
        },
        {
          x: (tableInformation.left + tableInformation.right) / 2,
          y: (tableInformation.top + tableInformation.bottom) / 2,
          width: tableInformation.left + tableInformation.right,
          height: tableInformation.top + tableInformation.bottom,
        },
        {
          x: 0,
          y: (tableInformation.top + tableInformation.bottom) / 2,
          width: (tableInformation.left + tableInformation.right) / 2,
          height: tableInformation.top + tableInformation.bottom,
        },
      ];
      let nav = $("#nav");
      let navWidth = nav.width();
      let navHeight = nav.height();
      // let navHeight = $("#nav").height();
      let student = document.getElementById("student_modell_container");
      let teacher = document.getElementById("teacher_modell_container");
      let solution = document.getElementById("solution_modell_container");
      if (student.style.left.split("px").length === 2) {
        student.style.left =
          (100 * parseInt(student.style.left.split("px")[0])) / navWidth + "%";
        student.style.top =
          (100 * parseInt(student.style.top.split("px")[0])) / navHeight + "%";
      }
      if (teacher.style.left.split("px").length === 2) {
        teacher.style.left =
          (100 * parseInt(teacher.style.left.split("px")[0])) / navWidth + "%";
        teacher.style.top =
          (100 * parseInt(teacher.style.top.split("px")[0])) / navHeight + "%";
      }
      if (solution.style.left.split("px").length === 2) {
        solution.style.left =
          (100 * parseInt(solution.style.left.split("px")[0])) / navWidth + "%";
        solution.style.top =
          (100 * parseInt(solution.style.top.split("px")[0])) / navHeight + "%";
      }
    };
  },
  false
); // DOMContentLoaded
// Ende drag_n_drop.js
