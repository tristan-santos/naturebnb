const http = require("http")
const fs = require("fs")

const server = http.createServer((req, res) => {
	console.log(req.url, req.method)
	res.setHeader("Content-Type", "text/html")
	fs.readFile("./index.html", (err, data) => {
		if (err) {
			res.setHeader("Location", "./404.html")
			res.end()
		} else {
			res.write(data)
			res.end()
		}
	})
})

server.listen(3000, "localhost", () => {
	console.log("Server is listening on http://localhost:3000")
})
