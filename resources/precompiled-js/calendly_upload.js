"use strict";

const useState = React.useState;
const useEffect = React.useEffect;

const CalendlyUpload = () => {
  const [link, setLink] = useState("");
  useEffect(async () => {
    const response = await fetch("/admin/interview/get-link");
  }, []);

  const uploadLink = e => {
    e.preventDefault();
    console.log(link);
    fetch("/admin/interview/upload-link", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        calendly_link: link
      })
    }).then(res => {
      if (res.status === 200) {
        window.alert("Link uploaded successfully!");
      }
    });
  };

  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    className: "text-2xl"
  }, "Please enter your Calendly link"), /*#__PURE__*/React.createElement("form", {
    onSubmit: uploadLink
  }, /*#__PURE__*/React.createElement("input", {
    className: "bg-white h-10 rounded-md border-black border",
    type: "text",
    name: "calendly_link",
    id: "calendly_link",
    value: link,
    onChange: e => setLink(e.target.value),
    required: true
  }), /*#__PURE__*/React.createElement("button", {
    type: "submit"
  }, "Upload")));
};

ReactDOM.render( /*#__PURE__*/React.createElement(CalendlyUpload, null), document.getElementById("app"));