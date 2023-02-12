import React from 'react'
import Modal from 'react-modal';
import { FiAlertCircle } from "react-icons/fi";

const VerifyEmail = () => {

  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
    },
  };

  let subtitle;
  const [modalIsOpen, setIsOpen] = React.useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    subtitle.style.color = '#f00';
  }

  function closeModal() {
    setIsOpen(false);
  }

  return (
    <>
        <div>
          <button onClick={openModal}>Open Modal</button>
          <Modal
            isOpen={modalIsOpen}
            onAfterOpen={afterOpenModal}
            onRequestClose={closeModal}
            style={customStyles}
            contentLabel="Example Modal"
            shouldCloseOnOverlayClick={false} 
            ariaHideApp={false}
          >
            <div className='flex flex-col gap-2 my-5'>
              <FiAlertCircle className='text-5xl font-bold text-red-500 mx-auto'/>
              <h2 className='text-2xl text-black'>Please verify your Email first</h2>
            </div>
          </Modal>
        </div>
      </>
  )
}

export default VerifyEmail
