'use strict';

import express from 'express'

import User from '../controllers/User'
import DailySentence from '../controllers/DailySentence'
import Authentication from '../controllers/Authenticate'
import Record from '../controllers/Record'
import Note from '../controllers/Note'
import Goal from '../controllers/Goal'
import GoalUserMap from '../controllers/GoalUserMap'
import Comment from '../controllers/Comment'
import Feedback from '../controllers/Feedback'
import FocusTime from '../controllers/FocusTime'
import Analyse from '../controllers/Analyse'
import Follow from '../controllers/Follow'
import Recommend from '../controllers/Recommend'
import Message from '../controllers/Message'

let router = express.Router();

//////////////client api//////////////
// authentication
router.route('/login')
	.post(Authentication.login)
router.route('/logout')
	.get(Authentication.logout)
router.route('/register')
	.post(User.save)
//////////////login required//////////////
// upload avatar img
router.route('/user/avatar')
	.post(Authentication.auth, User.upload_img)
// user
router.route('/user/info')
	.get(Authentication.auth, User.get_user_info)
	.put(Authentication.auth, User.update_user_info)
router.route('/user/info/:id')
	.get(User.get_other_user_info)
router.route('/user/password')
	.put(Authentication.auth, User.update_password)
// email
router.route('/email')
	.put(Authentication.auth, User.update_email)
// phone
router.route('/phone')
	.put(Authentication.auth, User.update_phone)

// note
router.route('/note')
	.get(Authentication.auth, Note.index)
	.post(Authentication.auth, Note.save)
router.route('/note/:id')
	.get(Authentication.auth, Note.read)
	.put(Authentication.auth, Note.update)
	.delete(Authentication.auth, Note.delete)

// goalUserMap
router.route('/goalmap')
	.get(Authentication.auth, GoalUserMap.get_current_user_goals) // 获取当前用户目标列表
router.route('/goalmap/user/:id')
	.get(GoalUserMap.index) // 获取某用户的目标列表
router.route('/goalmap/goal/:id')
	.post(Authentication.auth, GoalUserMap.save) // 将指定目标添加到用户目标列表
router.route('/goalmap/finish/:id')
	.post(Authentication.auth, GoalUserMap.finish) // 标记目标已完成
	.delete(Authentication.auth, GoalUserMap.unfinish) // 标记目标未完成
router.route('/goalmap/:id')
	.put(Authentication.auth, GoalUserMap.update) // 更改目标信息
	.delete(Authentication.auth, GoalUserMap.delete) // 删除目标

// goal
router.route('/goal')
	.get(Goal.index) // 获取目标列表
	.post(Authentication.auth, Goal.save) // 添加目标进列表
router.route('/goal/:id')
	.get(Goal.read) // 获取目标详细信息

// comment
router.route('/comment/goal/:id')
	.get(Comment.index) // 获取指定目标的直接评论信息
	.post(Authentication.auth, Comment.save) // 向指定目标id评论
router.route('/comment/like/:id')
	.post(Authentication.auth, Comment.like) // 点赞指定评论
	.delete(Authentication.auth, Comment.unlike) // 取消点赞
router.route('/comment/:id')
	.get(Comment.getReplyList) // 获取指定评论的回复列表
	.post(Authentication.auth, Comment.reply) // 回复评论
	.delete(Authentication.auth, Comment.delete) // 删除评论

// record
// dailySentenceRecord
router.route('/record/dailySentence/today')
	.get(Authentication.auth, Record.get_daily_sentence_today) // 获取当天每日一句信息
router.route('/record/dailySentence')
	.get(Authentication.auth, Record.get_daily_sentence) // 获取用户所有每日一句信息
// goalRecord
router.route('/record/goal')
	.get(Authentication.auth, Record.get_goals_finished_record) // 获取所有每日完成目标信息
router.route('/record/goal/today')
	.get(Authentication.auth, Record.get_goals_finished_record_today)
router.route('/record/goal/:id')
	.post(Authentication.auth, Record.mark_goal_finished) // 标记目标已完成

// focus time
router.route('/focus')
	.get(Authentication.auth, FocusTime.get_focus_time)
	.post(Authentication.auth, FocusTime.add_focus_time)

// analyse
router.route('/analyse')
	.get(Authentication.auth, Analyse.analyse);
router.route('/analyse/rank')
	.get(Authentication.auth, Analyse.rank);

// follow
router.route('/follow')
	.get(Authentication.auth, Follow.get_followers) // 获取关注当前用户的人
router.route('/follow/user/:id')
	.get(Follow.get_user_followers)  // 获取关注某人的人
	.post(Authentication.auth, Follow.follow) // 关注某人
	.delete(Authentication.auth, Follow.unfollow) // 取消关注某人

// recommend
router.route('/recommend')
	.get(Authentication.auth, Recommend.get_recommend) // 获取推荐评论

// message
router.route('/message')
	.get(Authentication.auth, Message.get_message) // 获取当前用户收到的消息
router.route('/message/user/:id')
	.post(Authentication.auth, Message.send_message) // 向指定用户发送消息
router.route('/message/read/:id')
	.post(Authentication.auth, Message.mark_read) // 标记已读
router.route('/message/:id')
	.delete(Authentication.auth, Message.delete) // 删除短消息

// feedback
router.route('/feedback') // 反馈
	.post(Feedback.save)

///////////////////admin api////////////
router.route('/user/count')
	.get(Authentication.auth, Authentication.auth_admin, User.count)
router.route('/user')
	.get(Authentication.auth, Authentication.auth_admin, User.index)
	.post(Authentication.auth, Authentication.auth_admin, User.save)
router.route('/user/:id')
	.get(Authentication.auth, Authentication.auth_admin, User.read)
	.put(Authentication.auth, Authentication.auth_admin, User.update)
	.delete(Authentication.auth, Authentication.auth_admin, User.delete)

// dailySentence
router.route('/dailySentence/count')
	.get(Authentication.auth, Authentication.auth_admin, DailySentence.count)
router.route('/dailySentence')
	.get(Authentication.auth, Authentication.auth_admin, DailySentence.index)
	.post(Authentication.auth, Authentication.auth_admin, DailySentence.save)
router.route('/dailySentence/:id')
	.get(Authentication.auth, Authentication.auth_admin, DailySentence.read)
	.put(Authentication.auth, Authentication.auth_admin, DailySentence.update)
	.delete(Authentication.auth, Authentication.auth_admin, DailySentence.delete)

// feedback
router.route('/feedback')
	.get(Authentication.auth, Authentication.auth_admin, Feedback.index)
router.route('/feedback/read/:id')
	.post(Authentication.auth, Authentication.auth_admin, Feedback.mark_read)
	.delete(Authentication.auth, Authentication.auth_admin, Feedback.mark_unread)
router.route('/feedback/:id')
	.delete(Authentication.auth, Authentication.auth_admin, Feedback.delete)

module.exports = router;