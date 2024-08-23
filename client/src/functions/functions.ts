export const DayMonth = (date: Date | number | string) => {
  try {
    const currentDate =
      typeof date === "number" || typeof date === "string"
        ? new Date(date)
        : date;

    if (!(currentDate instanceof Date && !isNaN(currentDate.getTime()))) {
      throw new TypeError(`${date} is not a valid date.`);
    }

    const day = currentDate.getDate();
    const month = currentDate.toLocaleString("default", { month: "short" });
    return `${day} ${month}`;
  } catch (error) {
    console.error("Error formatting date:", error);
    return "";
  }
};

export const TimeDayMonth = (date: Date | number | string) => {
  try {
    const currentDate =
      typeof date === "number" || typeof date === "string"
        ? new Date(date)
        : date;

    if (!(currentDate instanceof Date && !isNaN(currentDate.getTime()))) {
      throw new TypeError(`${date} is not a valid date.`);
    }

    const day = currentDate.getDate();
    const month = currentDate.toLocaleString("default", { month: "short" });
    const time = currentDate.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    return `${time} ${day} ${month}`;
  } catch (error) {
    console.error("Error formatting date:", error);
    return "";
  }
};
