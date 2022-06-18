const EmailForm = (props) => {
  const users = props.users;
  const default_values = props.default_values;
  const sending_link = props.sending_link;
  const [email_subject, setEmailSubject] = useState(
    default_values.email_subject
  );
  let applications = null;
  if (props.hasOwnProperty("applications")) applications = props.applications;
  const [email_heading, setEmailHeading] = useState(
    default_values.email_heading
  );
  const [email_body, setEmailBody] = useState(default_values.email_body);
  const [email_button_pre_text, setEmailButtonPreText] = useState(
    default_values.email_button_pre_text
  );
  const [email_button_label, setEmailButtonLabel] = useState(
    default_values.email_button_label
  );
  const [email_button_url, setEmailButtonUrl] = useState(
    default_values.email_button_url
  );

  const [loading, setLoading] = useState(false);

  const sendEmails = () => {
    setLoading(true);
    fetch(sending_link, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        users: applications == null ? users : applications,
        applications: applications != null,
        email_content: {
          subject: email_subject,
          heading: email_heading,
          body: email_body,
          button_pre_text: email_button_pre_text,
          button_label: email_button_label,
          button_url: email_button_url,
        },
      }),
    })
      .then((response) => {
        if (response.ok) {
          alert("Emails sent successfully.");
        } else {
          alert("There was an error while sending emails. Error code 01.");
        }
      })
      .catch((err) => {
        console.log(err);
        alert(
          "There was a problem while sending the request to the server. Please check your internet connection. Error code 02."
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div>
      <h2 className="text-lg mt-4 mb-1">
        <i className="fas fa-mail-bulk"></i> Compose Email
      </h2>
      <form
        action="/mail/preview"
        method="POST"
        target="_blank"
        className="flex flex-col gap-y-2"
      >
        <div>
          <label>Recepients: </label>
          <input
            type="text"
            id="recepients"
            maxLength="100"
            name="recepients"
            className="border bg-gray-200 w-full py-3 px-4 mt-1 hover:shadow-sm"
            value={
              applications == null
                ? `${users[0]}, and ${users.length - 1} others`
                : `${applications[0].Student.email}, and ${
                    applications.length - 1
                  } others`
            }
          ></input>
          <label>Subject: </label>
          <input
            type="text"
            id="subject"
            maxLength="100"
            name="subject"
            placeholder="e.g. Invite"
            className="border w-full py-3 px-4 mt-1 hover:shadow-sm"
            value={email_subject}
            onChange={(e) => {
              setEmailSubject(e.target.value);
            }}
            required
          ></input>
        </div>
        <div>
          <label>Heading: </label>
          <input
            type="text"
            id="heading"
            maxLength="100"
            name="heading"
            placeholder="This will be the heading inside the body of the email."
            className="border w-full py-3 px-4 mt-1 hover:shadow-sm"
            value={email_heading}
            onChange={(e) => {
              setEmailHeading(e.target.value);
            }}
          ></input>
        </div>
        <div>
          <label>Body: </label>
          <textarea
            maxLength="5000"
            id="body"
            name="body"
            placeholder="This will be the the body of the email. Limit: 5000 characters."
            className="border w-full h-48 py-3 px-4 mt-1 hover:shadow-sm"
            value={email_body}
            onChange={(e) => {
              setEmailBody(e.target.value);
            }}
            required
          ></textarea>
        </div>
        <div>
          <label>Button Pre-text: </label>
          <input
            type="text"
            maxLength="100"
            id="button_announcer"
            name="button_announcer"
            placeholder="This text comes before a button and invites the user to click the button. You can leave it empty if you want."
            className="border w-full py-3 px-4 mt-1 hover:shadow-sm"
            value={email_button_pre_text}
            onChange={(e) => {
              setEmailButtonPreText(e.target.value);
            }}
          ></input>
        </div>
        <div>
          <label>Button Label: </label>
          <input
            type="text"
            maxLength="50"
            id="button_text"
            name="button_text"
            placeholder="What does the button say? Limit: 50 characters"
            className="border w-full py-3 px-4 mt-1 hover:shadow-sm"
            value={email_button_label}
            onChange={(e) => {
              setEmailButtonLabel(e.target.value);
            }}
          ></input>
        </div>
        <div>
          <label>Button URL: </label>
          <input
            type="text"
            name="button_url"
            id="button_url"
            placeholder="Where does the button take the user?"
            className="bg-gray-100 border w-full py-3 px-4 mt-1 hover:shadow-sm"
            value={email_button_url}
            readOnly
          ></input>
        </div>
        <div className="flex">
          <button
            type="submit"
            className="w-full py-3 px-6 bg-gray-700 text-white mt-4 cursor-pointer hover:bg-gray-600"
          >
            <i className="far fa-eye"></i> Preview Mail
          </button>
          <button
            type="button"
            className="w-full py-3 px-6 bg-iec-blue text-white mt-4 cursor-pointer hover:bg-iec-blue-hover"
            id="email-button"
            onClick={sendEmails}
          >
            {loading ? (
              <i className="fas fa-spinner animate-spin self-center"></i>
            ) : (
              <i className="far fa-paper-plane"></i>
            )}{" "}
            Send Email(s)
          </button>
        </div>
      </form>
    </div>
  );
};
