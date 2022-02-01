const invite_quizid_field = document.getElementById("invite-quiz-id");
const modal = document.getElementById("modal");
const real_time_url = document.getElementById("real-time-link");
const invite_url_field = document.getElementById("invite-url-field");
const site_domain_name = document.getElementById("site-domain-name").innerText;
const link_creation_spinner = $("#link-creation-spinner");
const invite_link_error = $("#invite-link-error");
const previous_links_table_body = $("#previous-links-table-body");

real_time_url.innerHTML = "Link URL Preview: <span class='text-blue-600'>" + linkToFullUrl(invite_url_field.value) + "</span>";

function linkToFullUrl(link) {
  return site_domain_name + "/invite/" + link;
}

function copyToClipboard(id) {
  invite_quizid_field.value = id;
  modal.classList.toggle("hidden-imp");
}

function hideModal() {
  modal.classList.toggle("hidden-imp");
}

invite_url_field.addEventListener("keyup", (e) => {
  real_time_url.innerHTML = "Link URL Preview: <span class='text-blue-600'>" + linkToFullUrl(e.target.value) + "</span>";
});

$("#invite-link-creation-form").submit(function (e) {
  e.preventDefault();
  e.stopPropagation();
  link_creation_spinner.toggleClass("hidden-imp");
  $.post(
    "/create-invite",
    $("#invite-link-creation-form").serialize(),
    function (data) {
      link_creation_spinner.toggleClass("hidden-imp");
      invite_link_error.text(data.message);
      if (data.success == false) {
        invite_link_error.removeClass("text-green-500");
        invite_link_error.addClass("text-red-500");
      } else {
        invite_link_error.removeClass("text-red-500");
        invite_link_error.addClass("text-green-500");
        previous_links_table_body.append("<tr><td>" + linkToFullUrl(data.invite.link) + "</td><td></td><td class='text-blue-600'><a href='registrations/" + data.invite.link + "'>" + data.invite.registrations + " (View All)</a></td><td>" + moment(data.invite.createdAt).format("Do MMMM, YYYY") + "</td></tr>");
      }
    },
    "json"
  );

});

function toggleDropdown(quiz_id) {
  console.log("hi",quiz_id)
  $(`#quiz-dropdown-${quiz_id}`).toggleClass('hidden');
}

function toggleReminderEmailSetting(dom_obj) {
  const current_reminder_setting = dom_obj.dataset.currentReminderSetting
  const quiz_id = dom_obj.dataset.quizId

  const data_to_send = {
    current_reminder_setting: current_reminder_setting,
    quiz_id: quiz_id
  }

  $.post("/quiz/edit-reminder-setting", data_to_send, function(data) {
    if (data.success) {
      dom_obj.children[1].innerHTML= data.new_reminder_setting ? "Disable Reminder Emails" : "Enable Reminder Emails"
      dom_obj.children[0].classList.remove(data.new_reminder_setting ? "far" : "fas")
      dom_obj.children[0].classList.add(data.new_reminder_setting ? "fas" : "far")
      dom_obj.dataset.currentReminderSetting = data.new_reminder_setting
    } else {
      alert("Error changing reminder setting.")
    }
  })
}
