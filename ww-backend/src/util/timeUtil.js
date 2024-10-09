// timeUtil.js
const ConvertToUTC = (localDateString) => {
  const localDate = new Date(localDateString);
  const utcDate = new Date(
    localDate.getTime() - localDate.getTimezoneOffset() * 60000
  )
    .toISOString()
    .split("T")[0];
  return utcDate;
};

const ConvertTimeToUTC = (localDateString) => {
  const localDate = new Date(localDateString);
  const utcDate = new Date(
    localDate.getTime() - localDate.getTimezoneOffset() * 60000
  );
  return utcDate;
};

module.exports = { ConvertToUTC, ConvertTimeToUTC };
