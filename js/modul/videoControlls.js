let marks = [
  { start: 0, end: 2 },
  { start: 2, end: 8 },
  { start: 8, end: 24 },
];
let currentMark = 0;

function setCurrentMark(newMark) {
  updateActiveVideoControll(newMark);
  currentMark = newMark;
}

function updateActiveVideoControll(newMark) {
  $(`#videoControll${currentMark}`)
    .find(".octagon")
    .removeClass("activeOpacity");
  $(`#videoControll${newMark}`).find(".octagon").addClass("activeOpacity");
}

$(document).ready(() => {
  $(`#video_student_solution`).on("timeupdate", function (event) {
    if (this.currentTime > marks[currentMark].end) {
      this.currentTime = marks[currentMark].start;
    } else if (this.currentTime < marks[currentMark].start) {
      this.currentTime = marks[currentMark].start;
    }
  });
  $("#video_student_solution").prop("muted", true).play();
});
