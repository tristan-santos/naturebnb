const fs = require("fs")

// fs.readFile("./docs/file.txt", (err, data) => {
// 	if (err) {
// 		console.log(err)
// 	}
// 	console.log(data.toString())
// })

// fs.writeFile("./docs/file.txt", "i love web dev", () => {
// console.log("file was written")
// })

// fs.appendFile("./docs/file.txt", "\nappend this", (err) => {
// 	if (err) {
// 		console.log(err)
// 	}
// 	console.log("append")
// })

// if (!fs.existsSync("./assets")) {
// 	fs.mkdir("./assets", (err) => {
// 		if (err) {
// 			console.log(err)
// 		}
// 		console.log("folder created")
// 	})
// } else {
// 	fs.rmdir("./assets", (err) => {
// 		if (err) {
// 			console.log(err)
// 		}
// 		console.log("folder deleted")
// 	})
// }
// if (fs.existsSync("./docs/file.txt")) {
// 	fs.unlink("./docs/file.txt", (err) => {
// 		console.log(err)
// 	})
// 	console.log("file deleted!!")
// }
// if (!fs.existsSync("./docs/file.txt")) {
// 	fs.link("./docs/file.txt", (err) => {
// 		console.log(err)
// 	})
// 	console.log("file was created")
// }

function createRecord(record) {
	fs.appendFileSync("./CRUD/blog.txt", record + "\n", "utf-8")
	console.log(record)
}

function readRecords() {
	if (!fs.existsSync("./CRUD/blog.txt")) {
		return console.log("no data yet")
	}
	const data = fs.readFileSync("./CRUD/blog.txt", "utf-8").trim()
	if (!data) console.log("No Data yet")

	const record = data.split("\n")

	record.forEach((rec, i) => {
		console.log(`${i + 1} : ${rec}`)
	})
}

function updateRecord(index, newRecords) {
	if (!fs.existsSync("./CRUD/blog.txt")) return console.log("No Data Yet")

	let record = fs.readFileSync("./CRUD/blog.txt", "utf-8").trim().split("\n")

	if (index < 0 || index > record.length) {
		console.log("invalid numbers")
		return
	}

	const old = record[index - 1]
	record[index - 1] = newRecords
	fs.writeFileSync("./CRUD/blog.txt", record.join("\n") + "\n", "utf-8")

	console.log(` updated record ${index} -> ${newRecords}`)
}

function deleteRecord(index) {
	if (!fs.existsSync("./CRUD/blog.txt")) return console.log("No Data Yet")

	let record = fs.readFileSync("./CRUD/blog.txt", "utf-8").trim().split("\n")

	if (index < 0 || index > record.length) {
		console.log("invalid numbers")
		return
	}

	record.splice(index - 1, 1)
	fs.writeFileSync("./CRUD/blog.txt", record.join("\n") + "\n", "utf-8")

	console.log(` updated record ${index} -> `)
}

deleteRecord(3)
