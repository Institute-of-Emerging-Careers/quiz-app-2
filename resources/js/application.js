const nextStep = (from, to) => {
  $(`#${to}-bar`).removeClass("bg-secondary").addClass("progress-bar-striped");
  $(`#${from}`).fadeOut(() => {
    $(`#${to}`).fadeIn();
  });
};

const prevStep = (from, to) => {
  $(`#${from}-bar`)
    .addClass("bg-secondary")
    .removeClass("progress-bar-striped");
  $(`#${from}`).fadeOut(() => {
    $(`#${to}`).fadeIn();
  });
};

$("#step1-next-button").click(() => nextStep("step1", "step2"));
$("#step2-next-button").click(() => nextStep("step2", "step3"));
$("#step3-next-button").click(() => nextStep("step3", "step4"));

$("#step2-prev-button").click(() => prevStep("step2", "step1"));
$("#step3-prev-button").click(() => prevStep("step3", "step2"));
$("#step4-prev-button").click(() => prevStep("step4", "step3"));
