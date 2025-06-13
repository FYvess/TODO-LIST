document.addEventListener("DOMContentLoaded", () => {
  // Initialize data from localStorage or create empty arrays
  const data = {
    tasks: JSON.parse(localStorage.getItem("todoDailyTasks")) || [],
    groceries: JSON.parse(localStorage.getItem("todoDailyGroceries")) || [],
  }

  // Set current year in footer
  document.getElementById("current-year").textContent = new Date().getFullYear()

  // Navigation
  setupNavigation()

  // Initialize pages
  initTaskPage()
  initGroceryPage()

  // Save data to localStorage
  function saveData() {
    localStorage.setItem("todoDailyTasks", JSON.stringify(data.tasks))
    localStorage.setItem("todoDailyGroceries", JSON.stringify(data.groceries))
  }

  // Navigation setup
  function setupNavigation() {
    // Get all navigation links
    const navLinks = document.querySelectorAll("[data-page]")

    // Add click event to each link
    navLinks.forEach((link) => {
      link.addEventListener("click", function (e) {
        e.preventDefault()

        // Get the page to show
        const pageId = this.getAttribute("data-page")

        // Hide all pages
        document.querySelectorAll(".page").forEach((page) => {
          page.classList.remove("active")
        })

        // Show the selected page
        document.getElementById(`${pageId}-page`).classList.add("active")

        // Update active state in navigation
        document.querySelectorAll(".nav-menu a").forEach((navLink) => {
          navLink.classList.remove("active")
          if (navLink.getAttribute("data-page") === pageId) {
            navLink.classList.add("active")
          }
        })
      })
    })
  }

  // Task page initialization
  function initTaskPage() {
    const taskInput = document.getElementById("task-input")
    const addTaskBtn = document.getElementById("add-task-btn")
    const taskList = document.getElementById("task-list")
    const taskTemplate = document.getElementById("task-template")

    // Render initial tasks
    renderTasks()

    // Add task event
    addTaskBtn.addEventListener("click", () => {
      addTask()
    })

    // Add task on Enter key
    taskInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        addTask()
      }
    })

    // Add a new task
    function addTask() {
      const taskText = taskInput.value.trim()

      if (taskText) {
        // Create new task object
        const newTask = {
          id: Date.now().toString(),
          text: taskText,
          completed: false,
          date: new Date().toISOString(),
        }

        // Add to tasks array
        data.tasks.push(newTask)

        // Save to localStorage
        saveData()

        // Clear input
        taskInput.value = ""

        // Render tasks
        renderTasks()

        // Focus input for next task
        taskInput.focus()
      }
    }

    // Render all tasks
    function renderTasks() {
      // Clear current list
      taskList.innerHTML = ""

      // Check if there are tasks
      if (data.tasks.length === 0) {
        taskList.innerHTML = '<li class="empty-note">No tasks for today.<br>Write something to get started!</li>'
        return
      }

      // Add each task to the list
      data.tasks.forEach((task) => {
        const taskItem = taskTemplate.content.cloneNode(true)
        const li = taskItem.querySelector("li")
        const checkbox = taskItem.querySelector(".task-checkbox")
        const content = taskItem.querySelector(".task-content")
        const deleteBtn = taskItem.querySelector(".delete-task")

        // Set task data
        li.dataset.id = task.id
        content.textContent = task.text
        content.dataset.id = task.id
        checkbox.dataset.id = task.id
        deleteBtn.dataset.id = task.id

        // Set completed state
        if (task.completed) {
          checkbox.checked = true
          content.classList.add("completed")
        }

        // Add event listeners
        checkbox.addEventListener("change", toggleTaskCompletion)
        deleteBtn.addEventListener("click", deleteTask)

        // Add to list
        taskList.appendChild(taskItem)
      })
    }

    // Toggle task completion
    function toggleTaskCompletion() {
      const taskId = this.dataset.id
      const taskIndex = data.tasks.findIndex((task) => task.id === taskId)

      if (taskIndex !== -1) {
        // Toggle completed state
        data.tasks[taskIndex].completed = !data.tasks[taskIndex].completed

        // Update UI
        const content = document.querySelector(`.task-content[data-id="${taskId}"]`)
        if (content) {
          content.classList.toggle("completed")
        }

        // Save to localStorage
        saveData()
      }
    }

    // Delete task
    function deleteTask() {
      const taskId = this.dataset.id

      if (confirm("Are you sure you want to delete this task?")) {
        // Remove from array
        data.tasks = data.tasks.filter((task) => task.id !== taskId)

        // Save to localStorage
        saveData()

        // Re-render tasks
        renderTasks()
      }
    }
  }

  // Grocery page initialization
  function initGroceryPage() {
    const groceryInput = document.getElementById("grocery-input")
    const priceInput = document.getElementById("price-input")
    const addGroceryBtn = document.getElementById("add-grocery-btn")
    const groceryList = document.getElementById("grocery-list")
    const groceryTotal = document.getElementById("grocery-total")
    const groceryTemplate = document.getElementById("grocery-template")

    // Render initial grocery items
    renderGroceries()

    // Add grocery event
    addGroceryBtn.addEventListener("click", () => {
      addGrocery()
    })

    // Add grocery on Enter key
    groceryInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter" && priceInput.value.trim()) {
        addGrocery()
      }
    })

    priceInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter" && groceryInput.value.trim()) {
        addGrocery()
      }
    })

    // Add a new grocery item
    function addGrocery() {
      const itemText = groceryInput.value.trim()
      const itemPrice = Number.parseFloat(priceInput.value) || 0

      if (itemText) {
        // Create new grocery object
        const newGrocery = {
          id: Date.now().toString(),
          text: itemText,
          price: itemPrice,
          completed: false,
        }

        // Add to groceries array
        data.groceries.push(newGrocery)

        // Save to localStorage
        saveData()

        // Clear inputs
        groceryInput.value = ""
        priceInput.value = ""

        // Render groceries
        renderGroceries()

        // Focus input for next item
        groceryInput.focus()
      }
    }

    // Render all grocery items
    function renderGroceries() {
      // Clear current list
      groceryList.innerHTML = ""

      // Check if there are grocery items
      if (data.groceries.length === 0) {
        groceryList.innerHTML = '<li class="empty-note">No items for today.<br>Write something to get started!</li>'
        groceryTotal.textContent = "0.00"
        return
      }

      // Calculate total
      let total = 0

      // Add each grocery item to the list
      data.groceries.forEach((item) => {
        const groceryItem = groceryTemplate.content.cloneNode(true)
        const li = groceryItem.querySelector("li")
        const checkbox = groceryItem.querySelector(".grocery-checkbox")
        const content = groceryItem.querySelector(".grocery-content")
        const price = groceryItem.querySelector(".price")
        const deleteBtn = groceryItem.querySelector(".delete-grocery")

        // Set item data
        li.dataset.id = item.id
        content.textContent = item.text
        content.dataset.id = item.id
        price.textContent = item.price.toFixed(2)
        checkbox.dataset.id = item.id
        deleteBtn.dataset.id = item.id

        // Set completed state
        if (item.completed) {
          checkbox.checked = true
          content.classList.add("completed")
        }

        // Add to total
        total += item.price

        // Add event listeners
        checkbox.addEventListener("change", toggleGroceryCompletion)
        deleteBtn.addEventListener("click", deleteGrocery)

        // Add to list
        groceryList.appendChild(groceryItem)
      })

      // Update total
      groceryTotal.textContent = total.toFixed(2)
    }

    // Toggle grocery completion
    function toggleGroceryCompletion() {
      const itemId = this.dataset.id
      const itemIndex = data.groceries.findIndex((item) => item.id === itemId)

      if (itemIndex !== -1) {
        // Toggle completed state
        data.groceries[itemIndex].completed = !data.groceries[itemIndex].completed

        // Update UI
        const content = document.querySelector(`.grocery-content[data-id="${itemId}"]`)
        if (content) {
          content.classList.toggle("completed")
        }

        // Save to localStorage
        saveData()
      }
    }

    // Delete grocery
    function deleteGrocery() {
      const itemId = this.dataset.id

      if (confirm("Are you sure you want to delete this item?")) {
        // Remove from array
        data.groceries = data.groceries.filter((item) => item.id !== itemId)

        // Save to localStorage
        saveData()

        // Re-render groceries
        renderGroceries()
      }
    }
  }
})
