exports.ONE_DAY = 86400000; // 一天=86400000ms

/**
 * @return {[int]} A Number representing the milliseconds elapsed since the UNIX epoch
 */
let getToday = () => {
	let date = new Date();
	date.setHours(0);
	date.setMinutes(0);
	date.setSeconds(0);
	date.setMilliseconds(0);
	return date.getTime();
};
exports.getToday = getToday;

/**
 * 根据today日期获取当月开始时间
 */
exports.getMonthBegin = today => {
	today = new Date(today);
	today.setDate(1);
	return today.getTime();
}

/**
 * 根据today日期获取当月结束时间
 */
exports.getMonthEnd = monthBegin => {
	let tmp = new Date(monthBegin);
	if (tmp.getMonth() == 11) {
		tmp.setMonth(0);
		tmp.setFullYear(tmp.getFullYear() + 1);
	} else {
		tmp.setMonth(tmp.getMonth() + 1);
	}
	return tmp.getTime() - 1;
}