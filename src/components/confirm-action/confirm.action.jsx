import React from "react";

function ConfirmAction(props) {
  function deleting(){
    props.deleteFunc(props.isDeleteConfirmModal.id)
    props.handlerDeleteConfirmModal(false)
  }
  
  return (
    <div className="p-2 bg-gray-100 dark:bg-gray-900 dark:bg-opacity-50 bg-opacity-50 fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center backdrop-blur-sm z-[99]">
      <div>
        <div className="bg-white dark:dark:bg-gray-900 p-5 rounded-2xl">
          <h3>{`Are you sure you want to delete ${props.text}?`}</h3>
          <div className="flex text-white dark:text-gray-900 justify-center gap-5 items-center mt-5">
            <button
              onClick={() => props.handlerDeleteConfirmModal(false)}
              className="bg-blue-500 p-1 font-bold rounded-2xl"
            >
              Cancel
            </button>
            <button
              onClick={() => deleting()}
              className="bg-red-500 p-1 font-bold rounded-2xl"
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConfirmAction;