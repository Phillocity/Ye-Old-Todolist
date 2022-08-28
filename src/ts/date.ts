export const getDate = () => {
  const now: Date = new Date();
  const options: Object = {
    day: "numeric",
    month: "long",
  };
  return now.toLocaleDateString("en-US", options);
};

export const getDay = () => {
  const now: Date = new Date();
  const options: Object = {
    weekday: "long",
  };
  return now.toLocaleDateString("en-US", options);
};
