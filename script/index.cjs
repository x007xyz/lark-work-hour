const fs = require('fs');
const ICAL = require('node-ical');
const path = require('path');
const dayjs = require('dayjs');
// 读取ICS文件内容
const icsData = fs.readFileSync(path.join(__dirname, './holidayCal-CO.ics'), 'utf-8');

// 解析ICS数据
const jcalData = ICAL.parseICS(icsData);

// 获取所有 VEVENT 组件
const vevents = Object.values(jcalData);

const arr = [];

// 遍历所有 VEVENT 组件，提取节假日信息
vevents.forEach((vevent) => {
    const summary = vevent.summary;
    const startDate = vevent.start;
    const endDate = vevent.end;

    console.log(`节假日：${summary}`);
    console.log(`开始时间：${startDate}`);
    console.log(`结束时间：${endDate}`);
    console.log('---');
    if (startDate) {
        arr.push(dayjs(startDate).format('YYYY-MM-DD'))
    }
});

console.log(arr)