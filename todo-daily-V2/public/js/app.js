document.addEventListener("DOMContentLoaded", () => {
  // Task completion toggle
  document.querySelectorAll(".task-checkbox").forEach((checkbox) => {
    checkbox.addEventListener("change", function () {
      const taskId = this.dataset.id
      const contentElement = document.querySelector(`.task-content[data-id="${taskId}"]`)

      if (contentElement) {
        contentElement.classList.toggle("completed")
      }

      // Send request to server
      fetch(`/task/toggle/${taskId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })
    })
  })

  // Grocery item completion toggle
  document.querySelectorAll(".grocery-checkbox").forEach((checkbox) => {
    checkbox.addEventListener("change", function () {
      const itemId = this.dataset.id
      const contentElement = document.querySelector(`.grocery-content[data-id="${itemId}"]`)

      if (contentElement) {
        contentElement.classList.toggle("completed")
      }

      // Send request to server
      fetch(`/grocery/toggle/${itemId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })
    })
  })

  // Delete task
  document.querySelectorAll(".delete-task").forEach((button) => {
    button.addEventListener("click", function () {
      const taskId = this.dataset.id
      const listItem = document.querySelector(`.task-item[data-id="${taskId}"]`)

      if (confirm("Are you sure you want to delete this task?")) {
        fetch(`/task/delete/${taskId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.success && listItem) {
              listItem.remove()

              // Check if list is empty
              const taskList = document.getElementById("task-list")
              if (taskList && taskList.children.length === 0) {
                taskList.innerHTML =
                  '<li class="empty-note">No tasks for today.<br>Write something to get started!</li>'
              }
            }
          })
      }
    })
  })

  // Delete grocery item
  document.querySelectorAll(".delete-grocery").forEach((button) => {
    button.addEventListener("click", function () {
      const itemId = this.dataset.id
      const listItem = document.querySelector(`.grocery-item[data-id="${itemId}"]`)

      if (confirm("Are you sure you want to delete this item?")) {
        fetch(`/grocery/delete/${itemId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.success && listItem) {
              // Get the price to update total
              const price = Number.parseFloat(listItem.querySelector(".price").textContent)
              listItem.remove()

              // Update total
              const totalElement = document.getElementById("grocery-total")
              if (totalElement) {
                const currentTotal = Number.parseFloat(totalElement.textContent)
                totalElement.textContent = (currentTotal - price).toFixed(2)
              }

              // Check if list is empty
              const groceryList = document.getElementById("grocery-list")
              if (groceryList && groceryList.children.length === 0) {
                groceryList.innerHTML =
                  '<li class="empty-note">No items for today.<br>Write something to get started!</li>'
              }
            }
          })
      }
    })
  })
})
