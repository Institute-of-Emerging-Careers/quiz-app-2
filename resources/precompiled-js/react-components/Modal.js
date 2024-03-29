"use strict";

const Modal = props => {
  const {
    show_modal,
    setShowModal,
    heading,
    content,
    children
  } = props;
  return /*#__PURE__*/React.createElement("div", null, show_modal === true ? /*#__PURE__*/React.createElement("div", {
    id: "modal",
    className: "w-full inset-0 fixed z-30 bg-black/60"
  }, /*#__PURE__*/React.createElement("div", {
    className: "h-min mt-10 w-1/2 bg-white  translate-x-2/4 shadow-xl pb-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-green-400 text-white py-3 px-3 grid grid-cols-2 content-center"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "text-xl col-auto justify-self-start self-center"
  }, heading), /*#__PURE__*/React.createElement("i", {
    className: "fas fa-times text-white cursor-pointer col-auto justify-self-end self-center",
    onClick: () => {
      setShowModal(false);
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "p-8 h-min overflow-y-scroll"
  }, content, children))) : /*#__PURE__*/React.createElement("div", null));
};