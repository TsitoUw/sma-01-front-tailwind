import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

const LoaderLarger = () => {
  return (
    <div className="min-h-screen flex justify-center items-center">
      <FontAwesomeIcon icon="cloud" size="2x" className="text-sky-400 mx-1 animate-bounce" />
    </div>
  );
};

export default LoaderLarger;
