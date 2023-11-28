import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);

/**
 * @description: 节假日日期数组
 */
const holidays = [
  '2024-01-01', '2024-02-10', '2024-02-11', '2024-02-12',
  '2024-02-13', '2024-02-14', '2024-02-15', '2024-02-16',
  '2024-02-17', '2024-04-04', '2024-04-05', '2024-04-06',
  '2024-05-01', '2024-05-02', '2024-05-03', '2024-05-04',
  '2024-05-05', '2024-06-10', '2024-09-15', '2024-09-16',
  '2024-09-17', '2024-10-01', '2024-10-02', '2024-10-03',
  '2024-10-04', '2024-10-05', '2024-10-06', '2024-10-07',
  '2022-12-31', '2023-01-01', '2023-01-02', '2023-01-21',
  '2023-01-22', '2023-01-23', '2023-01-24', '2023-01-25',
  '2023-01-26', '2023-01-27', '2023-04-05', '2023-04-29',
  '2023-04-30', '2023-05-01', '2023-05-02', '2023-05-03',
  '2023-06-22', '2023-06-23', '2023-06-24', '2023-09-29',
  '2023-09-30', '2023-10-01', '2023-10-02', '2023-10-03',
  '2023-10-04', '2023-10-05', '2023-10-06', '2022-01-01',
  '2022-01-02', '2022-01-03', '2022-01-31', '2022-02-01',
  '2022-02-02', '2022-02-03', '2022-02-04', '2022-02-05',
  '2022-02-06', '2022-04-03', '2022-04-04', '2022-04-05',
  '2022-04-30', '2022-05-01', '2022-05-02', '2022-05-03',
  '2022-05-04', '2022-06-03', '2022-06-04', '2022-06-05',
  '2022-09-10', '2022-09-11', '2022-09-12', '2022-10-01',
  '2022-10-02', '2022-10-03', '2022-10-04', '2022-10-05',
  '2022-10-06', '2022-10-07'
]

/**
 * @description: 节假日调休日期数组
 */
const workdays = [
  '2024-02-04', '2024-02-18',
  '2024-04-07', '2024-04-28',
  '2024-05-11', '2024-09-14',
  '2024-09-29', '2024-10-12',
  '2023-01-28', '2023-01-29',
  '2023-04-23', '2023-05-06',
  '2023-06-25', '2023-10-07',
  '2023-10-08', '2022-01-29',
  '2022-01-30', '2022-04-02',
  '2022-04-24', '2022-05-07',
  '2022-10-08', '2022-10-09'
]

export function isWorkday(date: dayjs.Dayjs): boolean {
    // 判断是否在调休数组内
    const dateString = date.format('YYYY-MM-DD');
    if (workdays.includes(dateString)) {
        return true;
    }

    // 判断是否是周末（星期六或星期天）
    if (date.day() === 6 || date.day() === 0) {
        return false;
    }

    // 判断是否是节假日
    return !holidays.includes(dateString);
}

export function calculateWorkSchedule(workHoursArray: number[], startTime: dayjs.Dayjs, workHour = 8) {

    let result: dayjs.Dayjs[][] = [];
    // 初始开始时间
    let _startTime = startTime;

    for (let i = 0; i < workHoursArray.length; i++) {
        // 获取当前工作的工时
        const hours: number = workHoursArray[i];

        // 计算工作的天数
        const addDayNum = Math.floor(hours / workHour);

        // 计算工作的小时数
        const addHourNum = hours % workHour;
        let index = addDayNum + (addHourNum === 0 ? 0 : 1);
        let _endTime: dayjs.Dayjs = _startTime;
        while (index > 0) {
          // 最后一个，并且是小时数
          if (index === 1 && addHourNum !== 0) {
            // 小时数跨天了
            if (_endTime.hour() + addHourNum > workHour) {
              _endTime = _endTime.add(1, 'day').hour(_endTime.hour() + addHourNum - workHour);
            } else {
              _endTime = _endTime.add(addHourNum, 'hours');
            }
          } else {
            _endTime = _endTime.add(1, 'day');
          }
          if (isWorkday(_endTime)) {
              index--;
          }
        }
        result.push([_startTime, _endTime]);
        _startTime = _endTime;
    }

    return result;
}
