import moment from "moment";

class DateTime {
  static jDate(value, time = false) {
    let date = new Date(value);
    if (date.getTime())
      if (time) return moment(date).format("HH:mm jYYYY/jMM/jDD");
      else return moment(date).format("jYYYY/jMM/jDD");
    return value;
  }

  static gDate(value, time = false) {
    let date = new Date(value);
    let year = date.getFullYear();
    let month =
      date.getMonth().toString().length < 2
        ? `0${date.getMonth() + 1}`
        : date.getMonth() + 1;
    let day =
      date.getDate().toString().length < 2
        ? `0${date.getDate()}`
        : date.getDate();
    let hours =
      date.getHours().toString().length < 2
        ? `0${date.getHours()}`
        : date.getHours();
    let minutes =
      date.getMinutes().toString().length < 2
        ? `0${date.getMinutes()}`
        : date.getMinutes();
    if (date.getTime())
      if (time) return `${year}-${month}-${day} ${hours}:${minutes}`;
      else return `${year}-${month}-${day}`;
    return value;
  }

  static time(value, second = false) {
    let date = new Date(value);
    if (date.getTime())
      if (second) return moment(date).format("HH:mm:ss");
      else return moment(date).format("HH:mm");
    return value;
  }
}

export default DateTime;
