import { text } from '../langs';

const monthes = [
  'MONTH_JAN',
  'MONTH_FEB',
  'MONTH_MAR',
  'MONTH_APR',
  'MONTH_MAY',
  'MONTH_JUN',
  'MONTH_JUL',
  'MONTH_AUG',
  'MONTH_SEP',
  'MONTH_OCT',
  'MONTH_NOV',
  'MONTH_DEC',
];

class DateTime {
  constructor(date) {
    this.date = new Date(date);
  }

  getFormat() {
    const d = this.date;
    const month = text(monthes[d.getMonth()]);

    return `${month} ${d.getDate()}, ${d.getFullYear()}`;
  }
}

export default DateTime;
