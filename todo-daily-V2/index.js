import express from "express"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const port = process.env.PORT || 3000
const dataPath = path.join(__dirname, "data.json")

// Initialize data structure
let data = {
  tasks: [],
  groceries: [],
  groceryPrices: [],
  groceryTotal: 0,
}

// Load data from file if exists
try {
  if (fs.existsSync(dataPath)) {
    const fileData = fs.readFileSync(dataPath, "utf8")
    data = JSON.parse(fileData)
  }
} catch (err) {
  console.error("Error loading data:", err)
}

// Save data to file
const saveData = () => {
  try {
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2))
  } catch (err) {
    console.error("Error saving data:", err)
  }
}

app.use(express.static("public"))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// Routes
app.get("/", (req, res) => {
  res.render("index.ejs")
})

app.post("/submit", (req, res) => {
  const { action } = req.body
  if (action === "action1") {
    res.redirect("/agenda")
  } else if (action === "action2") {
    res.redirect("/pabili")
  } else {
    res.render("index.ejs", { error: "Invalid action" })
  }
})

// Task routes
app.get("/agenda", (req, res) => {
  res.render("agenda.ejs", { tasks: data.tasks })
})

app.post("/task/add", (req, res) => {
  const task = req.body.task
  if (task && task.trim() !== "") {
    data.tasks.push({
      id: Date.now().toString(),
      text: task,
      completed: false,
      date: new Date().toISOString(),
    })
    saveData()
  }
  res.redirect("/agenda")
})

app.post("/task/toggle/:id", (req, res) => {
  const id = req.params.id
  const taskIndex = data.tasks.findIndex((task) => task.id === id)

  if (taskIndex !== -1) {
    data.tasks[taskIndex].completed = !data.tasks[taskIndex].completed
    saveData()
  }

  res.json({ success: true })
})

app.post("/task/delete/:id", (req, res) => {
  const id = req.params.id
  data.tasks = data.tasks.filter((task) => task.id !== id)
  saveData()
  res.json({ success: true })
})

// Grocery routes
app.get("/pabili", (req, res) => {
  res.render("pabili.ejs", {
    groceries: data.groceries,
    prices: data.groceryPrices,
    total: data.groceryTotal,
  })
})

app.post("/grocery/add", (req, res) => {
  const item = req.body.pabili
  const price = Number.parseFloat(req.body.price) || 0

  if (item && item.trim() !== "") {
    data.groceries.push({
      id: Date.now().toString(),
      text: item,
      price: price,
      completed: false,
    })
    data.groceryTotal += price
    saveData()
  }
  res.redirect("/pabili")
})

app.post("/grocery/toggle/:id", (req, res) => {
  const id = req.params.id
  const groceryIndex = data.groceries.findIndex((item) => item.id === id)

  if (groceryIndex !== -1) {
    data.groceries[groceryIndex].completed = !data.groceries[groceryIndex].completed
    saveData()
  }

  res.json({ success: true })
})

app.post("/grocery/delete/:id", (req, res) => {
  const id = req.params.id
  const groceryItem = data.groceries.find((item) => item.id === id)

  if (groceryItem) {
    data.groceryTotal -= groceryItem.price
    data.groceries = data.groceries.filter((item) => item.id !== id)
    saveData()
  }

  res.json({ success: true })
})

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).render("error.ejs", { error: "Something went wrong!" })
})

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
