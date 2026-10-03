import { readFile } from "node:fs/promises"
import { validateContent } from "../src/content"
validateContent(JSON.parse(await readFile("data.json", "utf8")))
console.log("Content is valid")
