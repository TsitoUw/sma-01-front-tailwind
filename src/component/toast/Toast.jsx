import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";

function Toast({ show, header, body, tcolor="" }) {

  return (
    <div
      className={show ? "d-flex flex-column bg-dark p-2 pe-5 m-2" : "d-none"}
      style={{ position: "fixed", bottom: "0", border: "none", right: "0", opacity: "90%", borderRadius: "8px", zIndex: "99"}}
    >
      {header && (
        <div className="header m-2 pe-5" style={{ border: "none" }}>
          <FontAwesomeIcon icon="info-circle"/> {header}
        </div>
      )}
      {body && (
        <div className={"body m-2 d-flex align-items-center"} style={{ border: "none" }}>
          <FontAwesomeIcon icon="info-circle" className="px-1"/> {body}
        </div>
      )}
    </div>
  );
}

export default Toast;
