export const emitUserUpdated = () => {
  window.dispatchEvent(new Event("userUpdated"));
};