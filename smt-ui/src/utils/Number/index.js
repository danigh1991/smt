import _ from "lodash";

class Number {
  static format(value) {
    value += "";
    const list = value.split(".");
    const prefix = list[0].charAt(0) === "-" ? "-" : "";
    let num = prefix ? list[0].slice(1) : list[0];
    let result = "";
    while (num.length > 3) {
      result = `,${num.slice(-3)}${result}`;
      num = num.slice(0, num.length - 3);
    }
    if (num) {
      result = num + result;
    }
    return `${prefix}${result}${list[1] ? `.${list[1]}` : ""}`;
  }

  static english(value) {
    if (
      !_.isUndefined(value) &&
      !_.isNull(value) &&
      value.toString().trim() !== ""
    ) {
      let persianNumbersFormatOne = [
        "۱",
        "۲",
        "۳",
        "۴",
        "۵",
        "۶",
        "۷",
        "۸",
        "۹",
        "۰",
      ];
      let persianNumbersFormatTwo = [
        "۱",
        "۲",
        "۳",
        "۴",
        "۵",
        "۶",
        "۷",
        "۸",
        "۹",
        "۰",
      ];
      let englishNumbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
      for (
        let i = 0, numbersLen = persianNumbersFormatOne.length;
        i < numbersLen;
        i += 1
      ) {
        value = value
          .toString()
          .replace(
            new RegExp(persianNumbersFormatOne[i], "g"),
            englishNumbers[i]
          );
        value = value
          .toString()
          .replace(
            new RegExp(persianNumbersFormatTwo[i], "g"),
            englishNumbers[i]
          );
      }
    }

    return value;
  }

  static persian(value) {
    if (
      !_.isUndefined(value) &&
      !_.isNull(value) &&
      value.toString().trim() !== ""
    ) {
      let persianNumbers = ["۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹", "۰"];
      let englishNumbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
      for (
        let i = 0, numbersLen = englishNumbers.length;
        i < numbersLen;
        i += 1
      ) {
        value = value
          .toString()
          .replace(new RegExp(englishNumbers[i], "g"), persianNumbers[i]);
      }
    }

    return value;
  }
}

export const format = Number.format;
export const english = Number.english;
export const persian = Number.persian;
export default Number;
