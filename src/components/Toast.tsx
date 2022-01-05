import React from "react";
import { ToastContainer } from "react-toastify";

const Toast = () => {
  console.log("RENDER: TOAST");
  return (
    <div>
      <ToastContainer
        theme="dark"
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover={false}
      />
    </div>
  );
};

export default React.memo(Toast);
