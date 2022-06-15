import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

const LoaderLarger = () => {
  return (
    <div className="min-h-screen flex justify-center items-center">
      <FontAwesomeIcon icon="cloud" size="2x" className="text-rose-500 mx-1 animate-bounce" />
    </div>
  );
};

export default LoaderLarger;
