export const formatWithCommas = (num) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const formatDate = (isoDate) => {
  const date = new Date(isoDate);

  // Get month name
  const options = { month: "long" };
  const month = date.toLocaleString("en-US", options);

  // Get day, year, hours, and minutes
  const day = date.getDate();
  const year = date.getFullYear();
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");

  // Determine AM/PM and adjust hours
  const ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12 || 12; // Convert to 12-hour format

  // Format the date
  return `${month} ${day}, ${year} | ${hours}:${minutes}${ampm}`;
};
