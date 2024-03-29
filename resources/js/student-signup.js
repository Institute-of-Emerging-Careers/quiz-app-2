function validateFirstname(firstname) {
  if (firstname.length > 100)
    return "First name too long. Cannot exceed 60 alphabets.";
  else if (firstname.length < 1)
    return "First name too short. Must be at least 1 character.";
  else return true;
}
function validateLastname(lastname) {
  if (lastname.length > 100)
    return "Last name too long. Cannot exceed 30 alphabets.";
  else if (lastname.length < 1)
    return "Last name too short. Must be at least 1 character.";
  return true;
}
function validateEmail(email) {
  const regex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!regex.test(String(email).toLowerCase()))
    return "Email address invalid. Please enter a valid email address.";
  else if (email.length > 254)
    return "Email address too long. Cannot exceed 254 characters.";

  return true;
}
function validateCNIC(cnic) {
  const regex = /\d\d\d\d\d-\d\d\d\d\d\d\d-\d/i;
  if (!regex.test(cnic))
    return "CNIC format invalid. CNIC must contain 13 digits with two dashes (-) in between e.g. 35201-1234567-8";
  return true;
}
function validatePhone(phone) {
  const regex = /\d\d\d\d\d\d\d\d\d\d\d/i;
  if (!regex.test(phone))
    return "Phone number invalid. Phone number must be 11 digits long without any dashes, spaces, or symbols e.g. 03001234567";
  return true;
}

function validateGender(gender) {
  if (gender != "male" && gender != "female" && gender != "other")
    return "Gender invalid. Please select a gender.";
  return true;
}

function validateCity(city) {
  if (city.length < 2 || city.length > 100) {
    return "City name must be at least 2 and at most 100 characters long.";
  } else {
    return true;
  }
}

function validateAddress(address) {
  if (address.length < 10 || address.length > 300) {
    return "Full address must at least be 10 characters and at most 300 characters long.";
  } else return true;
}

function validateAge(age) {
  if (age < 10 || age > 100 || !Number.isInteger(parseFloat(age))) {
    return "Age must be a positive non-decimal number between 10 and 100";
  } else return true;
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
  let gender_mirror = $("#gender-mirror");
  let age_mirror = $("#age-mirror");
  let city_mirror = $("#city-mirror");
  let address_mirror = $("#address-mirror");
  let back_arrow = $("#back-arrow");

  let firstname_field = $("#firstName");
  let lastname_field = $("#lastName");
  let email_field = $("#email");
  let cnic_field = $("#cnic");
  let phone_field = $("#phone");
  let gender_field = $("#gender");
  let age_field = $("#age");
  let city_field = $("#city");
  let address_field = $("#address");
  let password_field = $("#password");
  let password_retype = $("#password2");

  let name_to_field_obj = {
    firstName: firstname_field,
    lastName: lastname_field,
    email: email_field,
    cnic: cnic_field,
    phone: phone_field,
    gender: gender_field,
    age: age_field,
    city: city_field,
    address: address_field,
    password: password_field,
  };

  // getting GET search parameters from URL and converting them to a JavaScript object
  function paramsToObject(entries) {
    const result = {};
    for (const [key, value] of entries) {
      // each 'entry' is a [key, value] tupple
      result[key] = value;
    }
    return result;
  }

  let search = location.search.substring(1);
  const urlParams = new URLSearchParams(search);
  const entries = urlParams.entries(); //returns an iterator of decoded [key,value] tuples
  const searchParams = paramsToObject(entries); //{abc:"foo",def:"[asf]",xyz:"5"}

  if (searchParams.hasOwnProperty("error")) {
    if (searchParams["error"] == "Validation error") {
      console.log(name_to_field_obj[searchParams["field"]]);
      displayError(
        name_to_field_obj[searchParams["field"]],
        searchParams["message"]
      );
    }
  }

  // checking if the email entered is already taken, if yes we redirect user to login page
  email_field.focusout((e) => {
    $.get("/email-exists/" + email_field.val(), (data, success) => {
      if (data == true)
        window.location =
          "/student/login?link=" +
          location.pathname.split("/").slice(-1)[0] +
          "&email=" +
          encodeURIComponent(email_field.val());
    });
  });

  cnic_field.focusout((e) => {
    $.get("/cnic-exists/" + cnic_field.val(), (data, success) => {
      if (data == true)
        window.location =
          "/student/login?link=" +
          location.pathname.split("/").slice(-1)[0] +
          "&cnic=" +
          encodeURIComponent(cnic_field.val());
    });
  });

  $("#section1-button").click(function () {
    // getting the values
    let firstname = firstname_field.val();
    let lastname = lastname_field.val() || "";
    let email = email_field.val();
    let cnic = cnic_field.val();
    let phone = phone_field.val();
    let gender = gender_field.val();
    let age = age_field.val();
    let city = city_field.val().toUpperCase();
    let address = address_field.val().toUpperCase();

    // reseting all errors
    resetAllErrors([
      firstname_field,
      lastname_field,
      email_field,
      cnic_field,
      phone_field,
      gender_field,
      age_field,
      city_field,
      address_field,
    ]);

    // validating input
    let firstname_validation = validateFirstname(firstname);
    let lastname_validation = validateLastname(lastname);
    let email_validation = validateEmail(email);
    let cnic_validation = validateCNIC(cnic);
    let phone_validation = validatePhone(phone);
    let gender_validation = validateGender(gender);
    let age_validation = validateAge(age);
    let city_validation = validateCity(city);
    let address_validation = validateAddress(address);

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
    } else if (gender_validation !== true) {
      displayError(gender_field, gender_validation);
    } else if (age_validation !== true) {
      displayError(age_field, age_validation);
    } else if (city_validation !== true) {
      displayError(city_field, city_validation);
    } else if (address_validation !== true) {
      displayError(address_field, address_validation);
    } else {
      section1.slideToggle();
      curScreen = !curScreen;
      name_mirror.text(firstname + " " + lastname);
      email_mirror.text(email);
      cnic_mirror.text(cnic);
      phone_mirror.text(phone);
      gender_mirror.text(gender);
      age_mirror.text(age);
      city_mirror.text(city);
      address_mirror.text(address);
      section2.slideToggle();
      back_arrow.toggle();
    }
  });

  // the back arrow
  back_arrow.click(function () {
    resetAllErrors([
      firstname_field,
      lastname_field,
      email_field,
      cnic_field,
      phone_field,
    ]);
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
        displayError(
          password_field,
          "Please make sure that the passwords written in these two fields match."
        );
        displayError(
          password_retype,
          "Please make sure that the passwords written in these two fields match."
        );
      } else {
        final_submission = true;
        $("#form1").submit();
      }
    }
  });
});
