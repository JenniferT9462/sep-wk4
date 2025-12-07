console.log("Hello from app.js!");
const SUPABASE_URL = "https://jzbjxzohgzaodvfaeynb.supabase.co/rest/v1/tasks";
const APIKEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp6Ymp4em9oZ3phb2R2ZmFleW5iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ4MDA0NDMsImV4cCI6MjA4MDM3NjQ0M30.DnKVsJBZeACHYDtwGKPO-N1CYBSWIbtlZU4YpM_gR-s";

// let tasks = [
//   // Hardcoded task object for testing
//   {
//     taskName: "Studying",
//     isCompleted: true,
//     createdAt: new Date().toLocaleString(),
//   },
// ];

async function addTask() {
  event.preventDefault();

  // Get DOM Elements
  let taskForm = document.getElementById("taskForm");
  let taskName = document.getElementById("taskName").value;

  // Task object
  let newTask = {
    taskName: taskName,
    isCompleted: false,
  };

  // Push to tasks array
  //   tasks.push(newTask);
  // console.log(tasks);

  let response = await fetch(SUPABASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: APIKEY,
    },
    body: JSON.stringify(newTask),
  });

  console.log("Task Created!");

  // Clear form
  taskForm.reset();

  getTasks();
}

async function getTasks() {
  let response = await fetch(SUPABASE_URL, {
    method: "GET",
    headers: {
      "apikey": APIKEY,
    },
  });

  let data = await response.json();
  console.log(data);

  renderTasks(data);
}

getTasks();

function renderTasks(tasks) {
  let taskList = document.getElementById("taskList");
  let taskItem = document.getElementById("taskItem");
  taskList.innerHTML = "";
  for (let i = 0; i < tasks.length; i++) {
    // Check if tasks are completed
    const isCompleted = tasks[i].isCompleted;
    const completed = isCompleted ? "completedTask" : "";
    const timeStamp = tasks[i].created_at;
    let dateObject = new Date(timeStamp);

    let options = {
      year: "numeric",
      month: "2-digit", 
      day: "2-digit",
      timeZone: "UTC",
    };

    const formattedDate = new Intl.DateTimeFormat("en-us", options).format(dateObject);

    taskList.innerHTML += `
            <li class="${completed} list-group-item list-group-item-light list-group-item-action">
                <div class="taskContent mt-2">
                    <p>${tasks[i].taskName} <span>${formattedDate}</span></p>
                    <div class="d-flex gap-3">
                        <img class="completeBtn" onClick="completeTask(${tasks[i].id})" src="completed.svg"/>
                        <img class="deleteBtn" onClick="deleteTask(${tasks[i].id})" src="delete.svg"/>
                    </div>
                </div>
            </li>
        `;
  }
}

async function deleteTask(id) {
  
  let response = await fetch(`${SUPABASE_URL}?id=eq.${id}`, {
    method: "DELETE",
    headers: {
      "apikey": APIKEY,
      "Prefer": "return=representation",
      "Content-Type": "application/json"
    }
  })
  getTasks();
}

async function completeTask(id) {
  let updateTask = {
    isCompleted: true,
  }

  let response = await fetch(`${SUPABASE_URL}?id=eq.${id}`, {
    method: "PATCH",
    headers: {
      "apikey": APIKEY,
      "Prefer": "return=representation",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(updateTask)
  })


  getTasks();
}
