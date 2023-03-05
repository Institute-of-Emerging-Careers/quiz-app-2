"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function validateFirstname(firstname) {
  if (firstname.length > 100) return 'First name too long. Cannot exceed 60 alphabets.';else if (firstname.length < 1) return 'First name too short. Must be at least 1 character.';else return true;
}

function validateLastname(lastname) {
  if (lastname.length > 100) return 'Last name too long. Cannot exceed 30 alphabets.';else if (lastname.length < 1) return 'Last name too short. Must be at least 1 character.';
  return true;
}

function validateEmail(email) {
  var regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!regex.test(String(email).toLowerCase())) return 'Email address invalid. Please enter a valid email address.';else if (email.length > 254) return 'Email address too long. Cannot exceed 254 characters.';
  return true;
}

function validateCNIC(cnic) {
  var regex = /\d\d\d\d\d-\d\d\d\d\d\d\d-\d/i;
  if (!regex.test(cnic)) return 'CNIC format invalid. CNIC must contain 13 digits with two dashes (-) in between e.g. 35201-1234567-8';
  return true;
}

function validatePhone(phone) {
  var regex = /\d\d\d\d\d\d\d\d\d\d\d/i;
  if (!regex.test(phone)) return 'Phone number invalid. Phone number must be 11 digits long without any dashes, spaces, or symbols e.g. 03001234567';
  return true;
}

function validateGender(gender) {
  if (gender !== 'male' && gender !== 'female' && gender !== 'other') return 'Gender invalid. Please select a gender.';
  return true;
}

function validateCity(city) {
  if (city.length < 2 || city.length > 100) {
    return 'City name must be at least 2 and at most 100 characters long.';
  } else {
    return true;
  }
}

function validateAddress(address) {
  if (address.length < 10 || address.length > 300) {
    return 'Full address must at least be 10 characters and at most 300 characters long.';
  } else return true;
}

function validateAge(age) {
  if (age < 10 || age > 100 || !Number.isInteger(parseFloat(age))) {
    return 'Age must be a positive non-decimal number between 10 and 100';
  } else return true;
}

function displayError(field, error) {
  field.addClass('border-red-600');
  field.addClass('text-red-600');
  field.prev().prev().append("<br><span class='text-red-600 italic'> " + error + '</span>');
}

function removeError(field) {
  field.removeClass('border-red-600');
  field.removeClass('text-red-600');
  field.prev().prev().children().eq(1).remove();
}

function resetAllErrors(fields) {
  for (var i = 0; i < fields.length; i++) {
    removeError(fields[i]);
  }
}

$(document).ready(function () {
  var curScreen = false; // false is section1, true is section2

  $(document).keypress(function (e) {
    var key = e.which;

    if (key === 13) {
      // the enter key code
      if (curScreen === false) {
        $('#section1-button').click();
        return false;
      } else return true;
    }
  });
  var section1 = $('#section1');
  var section2 = $('#section2');
  var name_mirror = $('#name-mirror');
  var email_mirror = $('#email-mirror');
  var phone_mirror = $('#phone-mirror');
  var cnic_mirror = $('#cnic-mirror');
  var gender_mirror = $('#gender-mirror');
  var age_mirror = $('#age-mirror');
  var city_mirror = $('#city-mirror');
  var address_mirror = $('#address-mirror');
  var back_arrow = $('#back-arrow');
  var firstname_field = $('#firstName');
  var lastname_field = $('#lastName');
  var email_field = $('#email');
  var cnic_field = $('#cnic');
  var phone_field = $('#phone');
  var gender_field = $('#gender');
  var age_field = $('#age');
  var city_field = $('#city');
  var address_field = $('#address');
  var password_field = $('#password');
  var password_retype = $('#password2');
  var name_to_field_obj = {
    firstName: firstname_field,
    lastName: lastname_field,
    email: email_field,
    cnic: cnic_field,
    phone: phone_field,
    gender: gender_field,
    age: age_field,
    city: city_field,
    address: address_field,
    password: password_field
  }; // getting GET search parameters from URL and converting them to a JavaScript object

  function paramsToObject(entries) {
    var result = {};

    var _iterator = _createForOfIteratorHelper(entries),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var _step$value = _slicedToArray(_step.value, 2),
            key = _step$value[0],
            value = _step$value[1];

        // each 'entry' is a [key, value] tupple
        result[key] = value;
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }

    return result;
  }

  var search = location.search.substring(1);
  var urlParams = new URLSearchParams(search);
  var entries = urlParams.entries(); // returns an iterator of decoded [key,value] tuples

  var searchParams = paramsToObject(entries); // {abc:"foo",def:"[asf]",xyz:"5"}

  if (searchParams.error) {
    if (searchParams.error === 'Validation error') {
      displayError(name_to_field_obj[searchParams.field], searchParams.message);
    }
  } // checking if the email entered is already taken, if yes we redirect user to login page


  email_field.focusout(function (e) {
    $.get('/email-exists/' + email_field.val(), function (data, success) {
      if (data === true) window.location = '/student/login?link=' + location.pathname.split('/').slice(-1)[0] + '&email=' + encodeURIComponent(email_field.val());
    });
  });
  cnic_field.focusout(function (e) {
    $.get('/cnic-exists/' + cnic_field.val(), function (data, success) {
      if (data === true) window.location = '/student/login?link=' + location.pathname.split('/').slice(-1)[0] + '&cnic=' + encodeURIComponent(cnic_field.val());
    });
  });
  $('#section1-button').click(function () {
    // getting the values
    var firstname = firstname_field.val();
    var lastname = lastname_field.val() || '';
    var email = email_field.val();
    var cnic = cnic_field.val();
    var phone = phone_field.val();
    var gender = gender_field.val();
    var age = age_field.val();
    var city = city_field.val().toUpperCase();
    var address = address_field.val().toUpperCase(); // reseting all errors

    resetAllErrors([firstname_field, lastname_field, email_field, cnic_field, phone_field, gender_field, age_field, city_field, address_field]); // validating input

    var firstname_validation = validateFirstname(firstname);
    var lastname_validation = validateLastname(lastname);
    var email_validation = validateEmail(email);
    var cnic_validation = validateCNIC(cnic);
    var phone_validation = validatePhone(phone);
    var gender_validation = validateGender(gender);
    var age_validation = validateAge(age);
    var city_validation = validateCity(city);
    var address_validation = validateAddress(address);

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
      name_mirror.text(firstname + ' ' + lastname);
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
  }); // the back arrow

  back_arrow.click(function () {
    resetAllErrors([firstname_field, lastname_field, email_field, cnic_field, phone_field]);
    section1.slideToggle();
    curScreen = !curScreen;
    section2.slideToggle();
    back_arrow.toggle();
  });
  var final_submission = false;
  $('#form1').submit(function (e) {
    if (final_submission === false) {
      e.preventDefault();
      e.stopPropagation();
      resetAllErrors([password_field, password_retype]);

      if (password_field.val() !== password_retype.val()) {
        displayError(password_field, 'Please make sure that the passwords written in these two fields match.');
        displayError(password_retype, 'Please make sure that the passwords written in these two fields match.');
      } else {
        final_submission = true;
        $('#form1').submit();
      }
    }
  });
});