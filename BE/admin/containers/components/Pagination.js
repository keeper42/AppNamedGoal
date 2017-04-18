import React, { Component, PropTypes } from 'react'

import './style/Pagination.scss'

const paginationWrapperStyle = {
	textAlign: 'center',
	overflow: 'hidden'
}

const paginationStyle = {
	display: 'inline-block',
	margin: '10px 0px'
}

class Pagination extends Component {
	
	_changePage(id, event) {
		const {changePage} = this.props;
		changePage(id);
	}
	
	/**
	 * 生成需要显示的页面列表
	 * @return {array} [
	 *   {
	 *   	name: 上一页,
	 *   	current: false,
	 *   	id: currentPage - 1
	 *   },
	 *   ...
	 * ]
	 */
	_buildPageList() {
		const {currentPage, totlePage} = this.props;
		if (totlePage < 1) {
			return [];
		}
		let pageList = [];
		pageList.push({name: '上一页', current: currentPage == 1, id: currentPage - 1});
		let i = currentPage - 4 + (currentPage + 5 > totlePage ? totlePage - currentPage - 5 : 0);
		i = i < 1 ? 1 : i;
		while (i < currentPage) {
			pageList.push({name: i, id: i});
			++i;
		}
		pageList.push({name: i, current: true, id: i});
		++i;
		let max = i + 4 - (currentPage >= 5 ? 0 : currentPage - 5);
		max = max > totlePage ? totlePage : max;
		while (i <= max) {
			pageList.push({name: i, id: i});
			++i;
		}
		pageList.push({name: '下一页', current: currentPage == totlePage, id: currentPage + 1});
		return pageList;
	}

	render() {
		let pageList = this._buildPageList();
		return (
			<div style={paginationWrapperStyle}>
				<ul className="pagination">
					{pageList.map((page, index) => (
					<li key={index} onClick={page.current ? null : (event) => this._changePage(page.id, event)} className={page.current ? "current-page" : ""}>{page.name}</li>
					))}
				</ul>
			</div>
		)
	}
}

Pagination.PropTypes = {
	currentPage: PropTypes.number.isRequired,
	totlePage: PropTypes.number.isRequired,
	changePage: PropTypes.func.isRequired
}

export default Pagination