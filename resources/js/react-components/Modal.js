const Modal = (props) => {
  const { show_modal, setShowModal, heading, content } = props;

  return (
    <div>
      {show_modal === true ? (
        <div
          id="modal"
          className="h-min w-full inset-0 fixed z-30 bg-black bg-opacity-60"
        >
          <div className="h-min mx-auto mt-10 w-1/2 bg-white left-1/4 translate-x-2/4 shadow-xl pb-2">
            <div className="bg-green-400 text-white py-3 px-3 grid grid-cols-2 content-center">
              <h3 className="text-xl col-auto justify-self-start self-center">
                {heading}
              </h3>
              <i
                className="fas fa-times text-white cursor-pointer col-auto justify-self-end self-center"
                onClick={() => {
                  setShowModal(false);
                }}
              ></i>
            </div>
            <div className="p-8 h-min overflow-y-scroll">{content}</div>
          </div>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
};
