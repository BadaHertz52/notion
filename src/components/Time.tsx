import React, { useMemo } from "react";

type TimeProps = {
  editTime: string;
};
const Time = ({ editTime }: TimeProps) => {
  type TimeInform = {
    year: string;
    month: string;
    date: string;
    hour: string;
    min: string;
  };
  const today = new Date().getDate();
  const currentHour = new Date().getHours();
  const currentMin = new Date().getMinutes();
  const time = useMemo(() => new Date(Number(editTime)), [editTime]);
  const time_date = time.getDate();
  const time_hour = time.getHours();
  const time_min = time.getMinutes();

  const stringTimeInform: TimeInform = useMemo(
    () => ({
      year: JSON.stringify(time.getFullYear()),
      month: JSON.stringify(time.getMonth() + 1),
      date: JSON.stringify(time_date),
      hour: JSON.stringify(time_hour),
      min: JSON.stringify(time_min),
    }),
    [time, time_date, time_hour, time_min]
  );

  const ago = JSON.stringify(currentMin - time_min);
  const timeInform: TimeInform = useMemo(
    () => ({
      year:
        stringTimeInform.year.length < 2
          ? `0${stringTimeInform.year}`
          : stringTimeInform.year,
      month:
        stringTimeInform.month.length < 2
          ? `0${stringTimeInform.month}`
          : stringTimeInform.month,
      date:
        stringTimeInform.date.length < 2
          ? `0${stringTimeInform.date}`
          : stringTimeInform.date,
      hour:
        stringTimeInform.hour.length < 2
          ? `0${stringTimeInform.hour}`
          : stringTimeInform.hour,
      min:
        stringTimeInform.min.length < 2
          ? `0${stringTimeInform.min}`
          : stringTimeInform.min,
    }),
    [stringTimeInform]
  );

  return (
    <p className="time">
      {today === time_date
        ? currentHour === time_hour
          ? ` ${ago} minutes ago`
          : `Today at ${timeInform.hour}:${timeInform.min}`
        : `${timeInform.month}/${timeInform.date}/${timeInform.year}`}
    </p>
  );
};

export default React.memo(Time);
