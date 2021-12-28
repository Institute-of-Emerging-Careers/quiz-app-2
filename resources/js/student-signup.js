function validateFirstname(firstname) {
  if (firstname.length > 60) return "First name too long. Cannot exceed 60 alphabets.";
  else if (firstname.length < 1) return "First name too short. Must be at least 1 character.";
  else return true;
}
function validateLastname(lastname) {
  if (lastname.length > 60) return "Last name too long. Cannot exceed 30 alphabets.";
  else if (lastname.length < 1) return "Last name too short. Must be at least 1 character.";
  return true;
}
function validateEmail(email) {
  const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!regex.test(String(email).toLowerCase())) return "Email address invalid. Please enter a valid email address.";
  else if (email.length > 254) return "Email address too long. Cannot exceed 254 characters.";

  return true;
}
function validateCNIC(cnic) {
  const regex = /\d\d\d\d\d-\d\d\d\d\d\d\d-\d/i;
  if (!regex.test(cnic)) return "CNIC format invalid. CNIC must contain 13 digits with two dashes (-) in between e.g. 35201-1234567-8";
  return true;
}
function validatePhone(phone) {
  const regex = /\d\d\d\d\d\d\d\d\d\d\d/i;
  if (!regex.test(phone)) return "Phone number invalid. Phone number must be 11 digits long without any dashes, spaces, or symbols e.g. 03001234567";
  return true;
}

function displayError(field, error) {
  field.addClass("border-red-600");
  field.addClass("text-red-600");
  field
    .prev()
    .prev()
    .append("<br><span class='text-red-600 italic'> " + error + "</span>");
}

function removeError(field) {
  field.removeClass("border-red-600");
  field.removeClass("text-red-600");
  field.prev().prev().children().eq(1).remove();
}

function resetAllErrors(fields) {
  for (let i = 0; i < fields.length; i++) {
    removeError(fields[i]);
  }
}

$(document).ready(function () {
  let curScreen = false;
  // false is section1, true is section2

  $(document).keypress(function (e) {
    var key = e.which;
    if (key == 13) {
      // the enter key code
      if (curScreen == false) {
        $("#section1-button").click();
        return false;
      } else return true;
    }
  });

  let section1 = $("#section1");
  let section2 = $("#section2");
  let name_mirror = $("#name-mirror");
  let email_mirror = $("#email-mirror");
  let phone_mirror = $("#phone-mirror");
  let cnic_mirror = $("#cnic-mirror");
  let back_arrow = $("#back-arrow");

  let firstname_field = $("#firstName");
  let lastname_field = $("#lastName");
  let email_field = $("#email");
  let cnic_field = $("#cnic");
  let phone_field = $("#phone");
  let password_field = $("#password");
  let password_retype = $("#password2");

  // getting GET search data from URL
  let searchParams = new URLSearchParams(window.location.search);
  if (searchParams.has("error")) {
    if (searchParams.get("error") == "unique violation") {
      displayError(email_field, "An account with this email address already exists. <a href='/student/login' class='text-blue-600 underline'>Click here to log in instead.</a>");
    }
  }

  email_field.focusout((e)=>{
    $.get("/email-exists/" + email_field.val(), (data, success)=>{
      if (data == true) window.location="/student/login?link=" + location.pathname.split('/').slice(-1)[0] + "&email=" + email_field.val()
    })
  })

  $("#section1-button").click(function () {
    // getting the values
    let firstname = firstname_field.val();
    let lastname = lastname_field.val() || "";
    let email = email_field.val();
    let cnic = cnic_field.val();
    let phone = phone_field.val();

    // reseting all errors
    resetAllErrors([firstname_field, lastname_field, email_field, cnic_field, phone_field]);

    // validating input
    let firstname_validation = validateFirstname(firstname);
    let lastname_validation = validateLastname(lastname);
    let email_validation = validateEmail(email);
    let cnic_validation = validateCNIC(cnic);
    let phone_validation = validatePhone(phone);

    if (firstname_validation !== true) {
      displayError(firstname_field, firstname_validation);
    } else if (lastname_validation !== true) {
      displayError(lastname_field, lastname_validation);
    } else if (email_validation !== true) {
      displayError(email_field, email_validation);
    } else if (cnic_validation !== true) {
      displayError(cnic_field, cnic_validation);
    } else if (phone_validation !== true) {
      displayError(phone_field, phone_validation);
    } else {
      section1.slideToggle();
      curScreen = !curScreen;
      name_mirror.text(firstname + " " + lastname);
      email_mirror.text(email);
      cnic_mirror.text(cnic);
      phone_mirror.text(phone);
      section2.slideToggle();
      back_arrow.toggle();
    }
  });

  // the back arrow
  back_arrow.click(function () {
    resetAllErrors([firstname_field, lastname_field, email_field, cnic_field, phone_field]);
    section1.slideToggle();
    curScreen = !curScreen;
    section2.slideToggle();
    back_arrow.toggle();
  });

  let final_submission = false;
  $("#form1").submit(function (e) {
    if (final_submission == false) {
      e.preventDefault();
      e.stopPropagation();
      resetAllErrors([password_field, password_retype]);
      if (password_field.val() != password_retype.val()) {
        displayError(password_field, "Please make sure that the passwords written in these two fields match.");
        displayError(password_retype, "Please make sure that the passwords written in these two fields match.");
      } else {
        final_submission = true;
        $("#form1").submit();
      }
    }
  });
});
