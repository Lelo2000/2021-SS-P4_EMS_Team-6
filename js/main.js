/** Die id der geraden aktiven Section */
let idActiveSection = "team";

let countTut = 0;

/**
 * Wechselt die Aktive Section. Die gerade aktive Section wird unsichtbar und die neue aktive Sektion wird sichtbar.
 * @param {string} id Id der neuen aktiven Section
 */
function switchActiveSection(id) {
  $(`#${idActiveSection}`).removeClass("show");
  $(`#${idActiveSection}`).addClass("hide");
  $(`#${id}`).removeClass("hide");
  $(`#${id}`).addClass("show");
  idActiveSection = id;
}
