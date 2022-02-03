const csv_input = document.getElementById("csv-upload")
csv_input.addEventListener("change", uploadCSV)

const csv_form = document.getElementById("csv_form")
const mail_form = document.getElementById("mail-form")
const recepients_list = document.getElementById("recepients_list")
const recepient_field = document.getElementById("recepient_field")
const email_button = document.getElementById("email-button")
let email_addresses = []

// email form fields
const email_subject = document.getElementById("subject")
const email_heading = document.getElementById("heading")
const email_body = document.getElementById("body")
const email_button_announcer = document.getElementById("button_announcer")
const email_button_label = document.getElementById("button_text")
const email_button_url = document.getElementById("button_url")

// restore old values from localStorage if present
email_subject.value = window.localStorage.getItem("subject")
email_body.value = window.localStorage.getItem("inner_text")
email_heading.value = window.localStorage.getItem("heading",email_heading.value)
email_button_announcer.value = window.localStorage.getItem("button_announcer",email_button_announcer.value)
email_button_label.value = window.localStorage.getItem("button_text",email_button_label.value)
email_button_url.value = window.localStorage.getItem("button_url",email_button_url.value)


email_button.addEventListener("click", sendEmails)

function arrayToCommaDeliminatedString(arr) {
    let result = ""
    arr.map((elem,index)=>{
        result+=elem
        if (index!=arr.length-1)
            result+=", "
    })
    return result
}

function stringIsEmail(str) {
    // Regular expression to check if string is email
    const regexExp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/gi;

    return regexExp.test(str);
}

function removeNonEmailsFromArray(arr) {
    let result = []
    for(let i=0;i<arr.length;i++) {
        if (stringIsEmail(arr[i])) result.push(arr[i])
    }
    return result
}

function uploadCSV(e) {
    let data = new FormData(csv_form);

    fetch("/upload/email/csv", {
        method: "POST",
        body: data,
    })
    .then((response) => {
        if (response.status == 200) {
            response.json().then((array_of_emails) => {
                array_of_emails = removeNonEmailsFromArray(array_of_emails)
                const email_string = arrayToCommaDeliminatedString(array_of_emails)
                recepients_list.innerText= "Recepients: " + email_string
                recepient_field.classList.add("hidden")
                recepient_field.disabled=true
                email_addresses = array_of_emails
            })
            .catch(err=>{
                console.log(err)
            }) 
        } else if (response.status == 401) {
            console.log("Fuck")
        } else {
            console.log("error uploading csv file");
        }
    })
    .catch((err) => {
        console.log(err);
    });
}

function sendEmails() {   
    document.getElementById("loading-spinner").classList.remove("hidden")

    // save this email's subject and content to browser local storage for future use
    window.localStorage.setItem("subject",email_subject.value)
    window.localStorage.setItem("heading",email_heading.value)
    window.localStorage.setItem("inner_text",email_body.value)
    window.localStorage.setItem("button_announcer",email_button_announcer.value)
    window.localStorage.setItem("button_text",email_button_label.value)
    window.localStorage.setItem("button_url",email_button_url.value)

    if (!recepient_field.disabled) {
        // this means that no excel sheet was uploaded for email addresses
        email_addresses = []
        email_addresses.push(recepient_field.value)
    }
    
    if (email_addresses.length>0) {
        fetch("/mail/send/batch", {
            method:"POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email_addresses: email_addresses,
                email_content: {
                    subject: email_subject.value,
                    heading: email_heading.value,
                    inner_text: email_body.value,
                    button_announcer: email_button_announcer.value,
                    button_text: email_button_label.value,
                    button_link: email_button_url.value
                }
            })
        })
        .then(response=>{
            document.getElementById("loading-spinner").classList.add("hidden")
            if (response.status==200) {
                alert("Emails sent successfully")
            } else {
                alert("There was an error sending emails. Contact IT.")
            }
        })
        .catch(err=>{
            document.getElementById("loading-spinner").classList.add("hidden")
            console.log(err)
            alert("Could not contact server. Something is wrong. Try later.")
        })
    } else {
        alert("No email addresses found.")
    }
}