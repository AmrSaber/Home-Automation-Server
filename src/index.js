const chalk = require('chalk')
const app = require('./app')

const PORT = 3000

app.listen(PORT, () => {
	console.log(chalk.blue(`Server running on port ${PORT}...`))
})