import React from "react";

export const PopupModal = ({ header, body }) => {
  return (
    <div class="overflow-y-hidden overflow-x-hidden fixed top-0 right-0 left-0 z-50 md:inset-0 h-modal md:h-full hidden justify-center items-center">
      <div class="relative w-full max-w-md min-h-screen md:h-auto flex justify-center items-center"></div>
    </div>
  );
};
