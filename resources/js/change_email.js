const submit_button = document.getElementById("submit-button");

function changeEmail(e) {
  e.preventDefault();
  submit_button.value = "Please Wait";
  submit_button.classList.remove("btn-primary");
  submit_button.classList.add("btn-warning");
  const data = new URLSearchParams(new FormData(e.target));
  fetch("/application/change-email", { method: "POST", body: data }).then(
    (res) => {
      if (res.ok) {
        submit_button.value = "Success";
        submit_button.classList.remove("btn-warning");
        submit_button.classList.add("btn-success");
        alert(
          "Email changed. You can return to the application form and apply."
        );
      } else if (res.status == 401) {
        submit_button.classList.remove("btn-warning");
        submit_button.classList.add("btn-primary");
        document.getElementById("submit-button").value = "Try Again";
        alert(
          "Email not changed. There is something wrong with your CNIC and password. Contact ask@iec.org.pk."
        );
      } else {
        submit_button.classList.remove("btn-warning");
        submit_button.classList.add("btn-primary");
        document.getElementById("submit-button").value = "Try Again";
        alert(
          "Email not changed. Please enter a valid email address, CNIC, and password. Contact ask@iec.org.pk."
        );
      }
    }
  );
}

document
  .getElementById("credentials-form")
  .addEventListener("submit", changeEmail);
