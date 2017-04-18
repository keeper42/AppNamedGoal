import Record from '../models/Record'
import GoalUserMap from '../models/GoalUserMap'
import DailySentence from '../models/DailySentence'
import 'babel-polyfill'
import {getToday} from './util/util'

let codeMsg = {
	10000: 'success',
	10404: 'unkown error'
}

/**
 * 获取用户当天每日一句信息
 */
exports.get_daily_sentence_today = (req, res, next) => {
	let userId = req.user._id,
			today = getToday();
	Record.findOne({date: today, user: userId}, (err, record) => {
		if (err) return reject({code: 10500, msg: '查询失败'});

		if (!record) {
			createRecord(userId).then(([record, dailySentence]) => {
				res.json({code: 10000, msg: '', data: {
					date: Date.now(),
					sentence: dailySentence.sentence,
					backImg: dailySentence.backImg
				}});
			}, err => {
				res.json({code: 10500, msg: '查询失败'});
			});
		} else {
			DailySentence.findById(record.dailySentence, (err, sentence) => {
				if (err) return res.json({code: 10500, msg: '查询失败'});
				if (!sentence) return res.json({code: 10200, msg: '该每日一句已被删除'});
				res.json({code: 10000, msg: '', data: {
					date: Date.now(),
					sentence: sentence.sentence,
					backImg: sentence.backImg
				}});
			})
		}
	})
}

/*
	获取用户所有每日一句信息
 */
exports.get_daily_sentence = (req, res, next) => {
	let userId = req.user._id;
	Record.find({user: userId}).populate({path: 'dailySentence'}).exec((err, records) => {
		if (err) return res.json({code: 10500, msg: '查询失败'});
		res.json({code: 10000, msg: '', data: records.map(record => {
			return {
				dailySentence: record.dailySentence,
				date: record.date
			}
		})});
	})
}

/*
	获取用户所有每日已完成目标信息
 */
exports.get_goals_finished_record = (req, res, next) => {
	let userId = req.user._id;
	Record.find({user: userId}, (err, records) => {
		if (err) return res.json({code: 10500, msg: '查询失败'});
		res.json({code: 10000, msg: '', data: records.map(record => {
			return {
				goalsFinished: record.goalsFinished,
				date: record.date
			}
		})});
	})
}

/*
	获取用户今日已完成目标信息
 */
exports.get_goals_finished_record_today = (req, res, next) => {
	let userId = req.user._id;
	Record.findOne({user: userId, date: getToday()}, (err, record) => {
		if (err) return res.json({code: 10500, msg: '查询失败'});
		res.json({code: 10000, msg: '', data: {
			goalsFinished: record ? record.goalsFinished : [],
			date: getToday()
		}});
	})
}

/*
	标记目标今日已完成
 */
exports.mark_goal_finished = (req, res, next) => {
	let userId = req.user._id,
			goalId = req.params.id, // GoalUserMap记录的_id值
			today = getToday();
	GoalUserMap.findById(goalId, (err, goal) => {
		if (err) return res.json({code: 10500, msg: '数据库查询失败'});
		if (!goal) return res.json({code: 10200, msg: '要完成目标不存在或已被删除'});
		if (goal.finish) return res.json({code: 10200, msg: '不可标记已完成目标'});

		Record.findOne({user: userId, date: today}, (err, record) => {
			if (err) {
				console.log(err);
				return res.json({code: 10404, msg: '服务器出错，请重新尝试'});
			}
			new Promise((resolve, reject) => {
				if (!record) {
					createRecord(userId).then(([record, dailySentence]) => resolve(record), err => reject(err));
				} else {
					resolve(record);
				}
			}).then(record => {
				console.log(record);
				// 目标今日已被标记完成则直接返回完成成功
				if (record.goalsFinished.indexOf(goal.goal) !== -1) return res.json({code: 10000, msg: '目标完成成功'});

				record.goalsFinished.push(goal.goal); // 存放Goal记录的_id值
				record.save(err => {
					if (err) {
						console.log(err);
						res.json({code: 10404, msg: '目标达成标记失败'});
					} else {
						res.json({code: 10000, msg: '目标完成成功'});
					}
				})
			}, err => {
				res.json(err);
			})
		})
	})
}

let createRecord = userId => new Promise((resolve, reject) => {
	let today = getToday();
	let record = new Record();
	record.user = userId;
	record.date = today;
	getSentenceRandomly().then(dailySentence => {
		record.dailySentence = dailySentence._id;
		record.save((err, product) => {
			if (err) {
				return reject({code: 10404, msg: '保存失败'});
			}
			resolve([product, dailySentence]);
		})
	}, err => {
		reject(err);
	})
})

/**
 * 从DailySentence中随机获取一条
 */
let getSentenceRandomly = () => new Promise((resolve, reject) => {
	DailySentence.find({}, (err, dailySentence) => {
		if (err) {
			return reject({code: 10404, msg: 'error in getSentenceRandomly'});
		}
		if (dailySentence.length === 0) {
			return reject({code: 10404, msg: 'database error'});
		}
		let r = parseInt(Math.random() * dailySentence.length);
		resolve(dailySentence[r]);
	})
})