import { useState } from 'react';

interface UseModalState<T> {
  isOpen: boolean;
  data: T | null;
}

/**
 * A custom hook to manage modal state.
 * @template T The type of data to be passed to the modal.
 * @returns {object} The modal state and functions to control it.
 */
const useModal = <T,>() => {
  const [modalState, setModalState] = useState<UseModalState<T>>({
    isOpen: false,
    data: null,
  });

  /**
   * Opens the modal with the provided data.
   * @param {T} data - The data to associate with the modal instance.
   */
  const openModal = (data: T) => {
    setModalState({ isOpen: true, data });
  };

  /**
   * Closes the modal and clears its data.
   */
  const closeModal = () => {
    setModalState({ isOpen: false, data: null });
  };

  return {
    ...modalState,
    openModal,
    closeModal,
  };
};

export default useModal;
