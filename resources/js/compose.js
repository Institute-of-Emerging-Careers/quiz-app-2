const csv_input = document.getElementById("csv-upload");
csv_input.addEventListener("change", uploadCSV);

const csv_form = document.getElementById("csv_form");
const mail_form = document.getElementById("mail-form");
const recepients_list = document.getElementById("recepients_list");
const recepient_field = document.getElementById("recepient_field");
const email_button = document.getElementById("email-button");
let email_addresses = [];

// email form fields
const email_subject = document.getElementById("subject");
const email_heading = document.getElementById("heading");
const email_body = document.getElementById("body");
const email_button_announcer = document.getElementById("button_announcer");
const email_button_label = document.getElementById("button_text");
const email_button_url = document.getElementById("button_url");

const load_previous_email_spinner = document.getElementById(
  "load_previous_email_spinner"
);

email_button.addEventListener("click", sendEmails);

function arrayToCommaDeliminatedString(arr) {
  let result = "";
  arr.map((elem, index) => {
    result += elem;
    if (index != arr.length - 1) result += ", ";
  });
  return result;
}

function stringIsEmail(str) {
  // Regular expression to check if string is email
  const regexExp =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/gi;

  return regexExp.test(str);
}

function uploadCSV(e) {
  let data = new FormData(csv_form);

  fetch("/upload/email/csv", {
    method: "POST",
    body: data,
  })
    .then((response) => {
      if (response.status == 200) {
        response
          .json()
          .then((array_of_emails) => {
            array_of_emails = array_of_emails.filter((email) =>
              stringIsEmail(email)
            );
            const email_string = arrayToCommaDeliminatedString(array_of_emails);
            recepients_list.innerText = "Recepients: " + email_string;
            recepient_field.classList.add("hidden");
            recepient_field.disabled = true;
            email_addresses = array_of_emails;
          })
          .catch((err) => {
            console.log(err);
          });
      } else if (response.status == 401) {
        console.log("Something went wrong.");
      } else {
        console.log("error uploading csv file");
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

function sendEmails() {
  document.getElementById("loading-spinner").classList.remove("hidden");

  // save this email's subject and content to browser local storage for future use
  //   window.localStorage.setItem("subject", email_subject.value);
  //   window.localStorage.setItem("heading", email_heading.value);
  //   window.localStorage.setItem("inner_text", email_body.value);
  //   window.localStorage.setItem("button_announcer", email_button_announcer.value);
  //   window.localStorage.setItem("button_text", email_button_label.value);
  //   window.localStorage.setItem("button_url", email_button_url.value);

  if (!recepient_field.disabled) {
    console.log("hey")
    // this means that no excel sheet was uploaded for email addresses
    email_addresses = [];
    email_addresses.push(recepient_field.value);
  }

  if (email_addresses.length > 0) {
    console.log(email_addresses)
    fetch("/mail/send/batch", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email_addresses: email_addresses,
        email_content: {
          subject: email_subject.value,
          heading: email_heading.value,
          inner_text: email_body.value,
          button_announcer: email_button_announcer.value,
          button_text: email_button_label.value,
          button_link: email_button_url.value,
        },
      }),
    })
      .then((response) => {
        document.getElementById("loading-spinner").classList.add("hidden");
        if (response.status == 200) {
          alert("Emails have been queued successfully. They will gradually be sent at a rate of 14 emails per second. You can close this page.");
        } else {
          alert("There was an error sending emails. Contact IT.");
          console.log(response);
        }
      })
      .catch((err) => {
        document.getElementById("loading-spinner").classList.add("hidden");
        console.log(err);
        alert("Could not contact server. Something is wrong. Try later.");
      });
  } else {
    alert("No email addresses found.");
  }
}

const prev_email_selector = document.getElementById("prev_email_selector");
prev_email_selector.addEventListener("change", loadPreviousEmail);

function loadPreviousEmail(e) {
  load_previous_email_spinner.classList.remove("hidden");
  const email_id = e.target.value;
  fetch("/email/get/" + email_id)
    .then((resp) => {
      resp
        .json()
        .then((email) => {
          email_subject.value = email.subject;
          email_heading.value = email.heading;
          email_body.value = email.body;
          email_button_announcer.value = email.button_pre_text;
          email_button_label.value = email.button_label;
          email_button_url.value = email.button_url;
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      load_previous_email_spinner.classList.add("hidden");
    });
}
