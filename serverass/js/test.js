const http = require("http")
const fs = require("fs")

const server = http.createServer((req, res) => {
	res.setHeader("Content-type", "text/html")

	let path = "../"
	switch (req.url) {
		case "/":
			break
		default:
			break
	}
	path += "index.html"

	fs.readFile(path, (err, data) => {
		if (err) {
			console.log(err)
		} else {
			res.write(data)
			res.end()
		}
	})
})

server.listen(3000, "localhost", () => {
	console.log("Listening for port 3000")
})
