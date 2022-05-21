const nextStep = (from, to) => {
  $(`#${to}-bar`).removeClass("bg-secondary").addClass("progress-bar-striped");
  $(`#${from}`).addClass("was-validated");
  $(`#${from}-next-button`).fadeOut(() => {
    $(`#${to}`).fadeIn();
  });
};

$(document).ready(function () {
  // pagination
  $("#step1-next-button").click(() => nextStep("step1", "step2"));
  $("#step2-next-button").click(() => nextStep("step2", "step3"));
  $("#step3-next-button").click(() => nextStep("step3", "step4"));
  $("#step4-next-button").click(() => nextStep("step4", "step5"));

  // showing additional employment questions if the user selects "yes" on "are you employed"
  if (
    $('input:radio[name="is-employed"]').is(":checked") &&
    $('input:radio[name="is-employed"]').val() == "1"
  ) {
    $("#additional-employment-questions").fadeIn();
    $("#salary").prop("required", true);
    $("#part-time").prop("required", true);
    $("#will-leave-job-yes").prop("required", true);
  }

  $('input:radio[name="is-employed"]').change(function () {
    if ($(this).is(":checked") && $(this).val() == "1") {
      $("#additional-employment-questions").fadeIn();
      $("#salary").prop("required", true);
      $("#part-time").prop("required", true);
      $("#will-leave-job-yes").prop("required", true);
    } else {
      $("#additional-employment-questions").fadeOut();
      $("#salary").prop("required", false);
      $("#part-time").prop("required", false);
      $("#will-leave-job-yes").prop("required", false);
    }
  });

  // form validation
});
