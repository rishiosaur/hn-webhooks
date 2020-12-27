module.exports = {
	async redirects() {
		return [
			{
				source: '/',
				destination: 'https://hn.rishi.cx',
				permanent: true,
			},
		]
	},
}
