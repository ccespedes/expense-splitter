export const formatWithCommas = (num) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const formatDate = (firebaseDate) => {
  if (!firebaseDate) {
    return "processing date..";
  }
  const now = firebaseDate.toDate();
  const formattedDate =
    now.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }) +
    " - " +
    now.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

  return formattedDate;
};
