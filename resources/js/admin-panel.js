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
        previous_links_table_body.append("<tr><td>" + linkToFullUrl(data.invite.link) + "</td><td></td><td>" + data.invite.registrations + "</td>" + moment(data.invite.createdAt).format("Do MMMM, YYYY") + "</tr>");
      }
    },
    "json"
  );
});
