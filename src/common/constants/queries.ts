export const GUILD_ATTENDANCE_QUERY = `
query ($page: Int) {
	guildData {
		guild(id: 608268) {
			id
			name
			attendance(page: $page) {
				has_more_pages
				data {
					code
					startTime
					zone {
						name
					}
					players {
						name
						presence
					}
				}
			}
		}
	}
}
`;
