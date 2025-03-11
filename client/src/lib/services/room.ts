export const getRoomId = () => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("roomId");
};
