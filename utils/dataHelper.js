const dayjs = require("dayjs");

const getToday = () => {
  return dayjs().startOf("day").toDate();
};

const getDayName = () => {
  return dayjs().format("dddd");
};

const calculateCompletion = (periods) => {
  const total = periods.length;

  const completed = periods.filter(
    (p) => p.lessonDone === true
  ).length;

  return {
    completed,
    total,
    percentage:
      total === 0
        ? 0
        : Math.round((completed / total) * 100),
  };
};

module.exports = {
  getToday,
  getDayName,
  calculateCompletion,
};