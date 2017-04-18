import FocusTime from '../models/FocusTime'

/*
	获取用户总专注时长
 */
exports.get_focus_time = (req, res, next) => {
	let userId = req.user._id;
	FocusTime.find({user: userId}, (err, focusTimes) => {
		if (err) return res.json({code: 10500, msg: '查询失败'});
		res.json({code: 10000, msg: '', data: focusTimes.reduce((totle, focusTime) => totle + focusTime.length, 0)});
	})
}

/*
	添加专注时长
 */
exports.add_focus_time = (req, res, next) => {
	let userId = req.user._id;
	let {begin, length} = req.body;
	if (!begin || !length) return res.json({code: 10200, msg: 'params error'});
	let focusTime = new FocusTime;
	focusTime.user = userId;
	focusTime.begin = begin;
	focusTime.length = length;
	focusTime.save(err => {
		if (err) return res.json({code: 10500, msg: '添加时长失败，请检查参数是否合法'});
		res.json({code: 10000, msg: ''});
	})
}