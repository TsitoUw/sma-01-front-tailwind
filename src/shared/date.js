const monthString = (value) => {
  const month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return month[value];
};

const dateString = (value = new Date(), hasYear = false) => {
  const year = value.getFullYear();
  const date = value.getDate();
  const month = monthString(value.getMonth());
  if (hasYear) return month + " " + date + ", " + year;
  else return month + " " + date;
};

const getComparedPostDate = (postedAt = "") => {
  postedAt = new Date(postedAt);
  const oneMinute = 59000; // 59sec
  const maxMinute = 3540000; //59min
  const maxHours = 86340000; //24h -1min
  const maxDays = 518400000; //7d -1min
  const aYear = 31535940000; //1y -1min
  const now = new Date();
  const difference = now.getTime() - postedAt.getTime();

  if (difference <= oneMinute) return "Just now";
  if (difference <= maxMinute) return new Date(difference).getUTCMinutes() + "m";
  if (difference > maxMinute && difference <= maxHours) return new Date(difference).getUTCHours() + "h";
  if (difference > maxHours && difference <= maxDays) return new Date(difference).getUTCDate() + "d";
  if (difference <= aYear) return dateString(postedAt); //the date when the post where made
  return dateString(postedAt, true); // the date when the post where made, with year
};

module.exports = { comparedDate: getComparedPostDate };
