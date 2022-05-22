function handleForm(e) {
  e.preventDefault();
  e.stopPropagation();

  const data = new URLSearchParams(new FormData(e.target));

  fetch($("#application-form").attr("action"), {
    method: "POST",
    body: data,
  }).then((raw_response) => {
    if (raw_response.ok) {
      alert("Created");
    } else if (raw_response.status == 500) alert("Something went wrong.");
    else if (raw_response.status == 400) {
      raw_response.json().then((response) => {
        console.log(response);
        $(`#${response.field}`).addClass("is-invalid").focus();
        $(`#${response.field}-error-message`).text(response.message);
      });
    }
  });
}

document
  .getElementById("application-form")
  .addEventListener("submit", handleForm);

const nextStep = (from, to) => {
  $(`#${to}-bar`).removeClass("bg-secondary").addClass("progress-bar-striped");
  $(`#${from}`).addClass("was-validated");
  if (to == "step5") $(`#${to}`).addClass("was-validated");
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
