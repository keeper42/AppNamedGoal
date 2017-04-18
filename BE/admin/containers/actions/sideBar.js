const UPDATE_MENU_LIST = "UPATE_MENU_LIST"

const MENU_LIST = [
	{
		link: "/admin/Server",
		icon: "fa-server",
		description: "Server"
	},
	{
		link: '/admin/User',
		icon: 'fa-users',
		description: "User"
	},
	{
		link: '/admin/DailySentence',
		icon: 'fa-book',
		description: 'DailySentence'
	},
	{
		link: '/admin/Feedback',
		icon: 'fa-book',
		description: 'Feedback'
	}
]

export function update_menu_list(authList) {
	return {
		type: UPDATE_MENU_LIST,
		data: MENU_LIST
	}
}
