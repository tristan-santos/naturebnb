const http = require("http")
const fs = require("fs")

const server = http.createServer((req, res) => {
	res.setHeader("Content-type", "text/html")

	let path = "../"
	switch (req.url) {
		case "/":
			path += "index.html"
			res.statusCode = 200
			break
		case "/aboutMe":
			path += "aboutMe.html"
			res.statusCode = 200
			break
		default:
			path += "404.html"
			res.statusCode = 404
			break
	}

	fs.readFile(path, (err, data) => {
		if (err) {
			console.log(err)
		} else {
			res.write(data)
			res.end()
		}
	})
})

server.listen(3001, "localhost", () => {
	console.log("Listening for port tristan 3001")
})
