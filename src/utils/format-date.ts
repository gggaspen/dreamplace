export function dateToCustomString(date: Date) {
  const months = [
    "ENE",
    "FEB",
    "MAR",
    "ABR",
    "MAY",
    "JUN",
    "JUL",
    "AGO",
    "SEP",
    "OCT",
    "NOV",
    "DIC",
  ];

  const day = date.getDate();
  const month = months[date.getMonth()];

  return `${day} ${month}`;
}
