const monthes = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

class DateTime {
  constructor(date) {
    this.date = new Date(date);
  }

  getFormat() {
    const d = this.date;

    return `${monthes[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
  }
}

export default DateTime;
