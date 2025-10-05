const fs = require("fs")

if (!fs.existsSync("./CRUD")) {
	fs.mkdir("./CRUD", (err) => {
		if (err) {
			console.log(err)
		}
		if (!fs.existsSync("./CRUD/blog.txt")) {
			fs.writeFile("./CRUD/blog.txt", "i love advanced web dev", () => {
				console.log("file was written")
			})
			fs.appendFile("./CRUD/blog.txt", "\nI love developing websites", (er) => {
				if (er) {
					console.log(er)
				}
				console.log("appended")
			})
		}
	})
} else {
	fs.unlink("./CRUD/blog.txt", (err) => {
		console.log(err)
	})
	console.log("file deleted!!")
	fs.rmdir("./CRUD", (err) => {
		if (err) {
			console.log(err)
		}
		console.log("folder deleted")
	})
}
