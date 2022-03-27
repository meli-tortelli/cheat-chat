export default function Modal() {
  const modal = document.querySelector('.modal-wrapper');
  const cancelButton = document.querySelector('.button.cancel');

  cancelButton.addEventListener('click', close);

  function open() {
    modal.classList.add('active');
  }

  function close() {
    modal.classList.remove('active');
  }

  return {
    open,
    close,
  };
}
