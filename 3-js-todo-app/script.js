var newInput = document.getElementById("new-input");
var newCategory = document.getElementById("new-category");
var newDate = document.getElementById("new-date");
var newButton = document.getElementById("new-button");
var list = document.getElementById("list");

var filterArea = document.getElementById("filter-area");
var filterToggle = document.getElementById("filter-button");

var filterDateFrom = document.getElementById("filter-date-from");
var filterDateTo = document.getElementById("filter-date-to");
var filterCategory = document.getElementById("filter-category");
var filterMissed = document.getElementById("filter-missed");
var filterUpcoming = document.getElementById("filter-upcoming");

var logsArea = document.getElementById("logs-container");
var logsList = document.getElementById("logs");
var logsToggle = document.getElementById("logs-button");

var data = JSON.parse(localStorage.getItem("tasks"));
if (data == null) data = [];
var logs = JSON.parse(localStorage.getItem("logs"));
if (logs == null) logs = [];

const addTask = (text, category, date) => {
  data.push({
    id: data.length == 0 ? 0 : data[data.length - 1].id + 1,
    info: text,
    category: category,
    date: date,
    tags: [],
    subtasks: [],
    priority: 1,
    done: false,
  });
  logs.unshift({
    log: `Added task <strong>${text}</strong>`,
    time: new Date(
      new Date().getTime() - new Date().getTimezoneOffset() * 60000
    ).toJSON(),
  });
  localStorage.setItem("tasks", JSON.stringify(data));
  localStorage.setItem("logs", JSON.stringify(logs));
  renderTasks();
  renderLogs();
};

const deleteTask = (id) => {
  for (let i = 0; i < data.length; i++) {
    if (data[i].id == id) {
      logs.unshift({
        log: `Deleted task <strong>${data[i].info}</strong>`,
        time: new Date(
          new Date().getTime() - new Date().getTimezoneOffset() * 60000
        ).toJSON(),
      });
      data.splice(i, 1);
      break;
    }
  }
  localStorage.setItem("tasks", JSON.stringify(data));
  localStorage.setItem("logs", JSON.stringify(logs));
  renderTasks();
  renderLogs();
};

const deleteSubtask = (id, n) => {
  for (let i = 0; i < data.length; i++) {
    if (data[i].id == id) {
      logs.unshift({
        log: `Deleted subtask <strong>${data[i].subtasks[n].info}</strong> of task <strong>${data[i].info}</strong>`,
        time: new Date(
          new Date().getTime() - new Date().getTimezoneOffset() * 60000
        ).toJSON(),
      });
      data[i].subtasks.splice(n, 1);
      break;
    }
  }
  localStorage.setItem("tasks", JSON.stringify(data));
  localStorage.setItem("logs", JSON.stringify(logs));
  renderTasks();
  renderLogs();
};

const deleteTag = (id, n) => {
  for (let i = 0; i < data.length; i++) {
    if (data[i].id == id) {
      logs.unshift({
        log: `Deleted tag <strong>${data[i].tags[n]}</strong> from task <strong>${data[i].info}</strong>`,
        time: new Date(
          new Date().getTime() - new Date().getTimezoneOffset() * 60000
        ).toJSON(),
      });
      data[i].tags.splice(n, 1);
      break;
    }
  }
  localStorage.setItem("tasks", JSON.stringify(data));
  localStorage.setItem("logs", JSON.stringify(logs));
  renderTasks();
  renderLogs();
};

const completeTask = (id) => {
  for (let i = 0; i < data.length; i++) {
    if (data[i].id == id) {
      data[i].done = !data[i].done;
      logs.unshift({
        log: `Marked task <strong>${data[i].info}</strong> as <strong>${
          data[i].done ? "Complete" : "Incomplete"
        }</strong>`,
        time: new Date(
          new Date().getTime() - new Date().getTimezoneOffset() * 60000
        ).toJSON(),
      });
      break;
    }
  }
  localStorage.setItem("tasks", JSON.stringify(data));
  localStorage.setItem("logs", JSON.stringify(logs));
  renderTasks();
  renderLogs();
};

const completeSubtask = (id, n) => {
  for (let i = 0; i < data.length; i++) {
    if (data[i].id == id) {
      data[i].subtasks[n].done = !data[i].subtasks[n].done;
      logs.unshift({
        log: `Marked subtask <strong>${
          data[i].subtasks[n].info
        }</strong> of task <strong>${data[i].info}</strong> as <strong>${
          data[i].subtasks[n].done ? "Complete" : "Incomplete"
        }</strong>`,
        time: new Date(
          new Date().getTime() - new Date().getTimezoneOffset() * 60000
        ).toJSON(),
      });
      break;
    }
  }
  localStorage.setItem("tasks", JSON.stringify(data));
  localStorage.setItem("logs", JSON.stringify(logs));
  renderTasks();
  renderLogs();
};

const addTag = (id, tag) => {
  for (let i = 0; i < data.length; i++) {
    if (data[i].id == id) {
      data[i].tags.push(tag);
      logs.unshift({
        log: `Added tag <strong>${tag}</strong> to task <strong>${data[i].info}</strong>`,
        time: new Date(
          new Date().getTime() - new Date().getTimezoneOffset() * 60000
        ).toJSON(),
      });
      break;
    }
  }
  localStorage.setItem("tasks", JSON.stringify(data));
  localStorage.setItem("logs", JSON.stringify(logs));
  renderTasks();
  renderLogs();
};

const addSubtask = (id, subtask) => {
  for (let i = 0; i < data.length; i++) {
    if (data[i].id == id) {
      data[i].subtasks.push({ info: subtask, done: false });
      logs.unshift({
        log: `Added subtask <strong>${subtask}</strong> to task <strong>${data[i].info}</strong>`,
        time: new Date(
          new Date().getTime() - new Date().getTimezoneOffset() * 60000
        ).toJSON(),
      });
      break;
    }
  }
  localStorage.setItem("tasks", JSON.stringify(data));
  localStorage.setItem("logs", JSON.stringify(logs));
  renderTasks();
  renderLogs();
};

const updateTask = (task) => {
  for (let i = 0; i < data.length; i++) {
    if (data[i].id == task.id) {
      data[i] = task;
      break;
    }
  }
  localStorage.setItem("tasks", JSON.stringify(data));
  localStorage.setItem("logs", JSON.stringify(logs));
  renderTasks();
  renderLogs();
};

var taskItem = (task) => {
  var listItem = document.createElement("div");
  listItem.className = "list-item";
  listItem.innerHTML = `
      <div>
        <input type="checkbox" class="task-check" ${
          task.done ? "checked" : ""
        }/>
        <input class="edit-task" type="text" value="${task.info}" />
        <div class="flex-filler"></div>
        <button class="task-delete-button">
          <img src="images/plus-red.svg" />
        </button>
      </div>
			<div>
        <input class="edit-date" type="date" value="${task.date}" />
        <button class="edit-priority priority-${task.priority}">
          ${task.priority == 0 ? "Low" : task.priority == 1 ? "Med" : "High"}
        </button>
        <div class="flex-filler"></div>
        <input class="edit-category" type="text" value="${task.category}" />
      </div>
      <div class="separator"></div>
      <ul class="subtasks"></ul>
      <div>
        <input class="new-subtask" type="text" placeholder="Add subtask" />
        <div class="flex-filler"></div>
			  <button class="subtask-add-button">
         <img src="images/plus.svg" />
        </button>
      </div>
      <div class="separator"></div>
      <div class="tag-container">
        <div class="add-tag-wrapper">
          <input class="new-tag" type="text" placeholder="Add tags" />
          <button class="tag-add-button">
            <img src="images/plus.svg" />
          </button>
        </div>
        <ul class="tags"></ul>
      </div>
	`;
  var deleteButton = listItem.getElementsByClassName("task-delete-button")[0];
  var tagAddButton = listItem.getElementsByClassName("tag-add-button")[0];
  var subtaskAddButton =
    listItem.getElementsByClassName("subtask-add-button")[0];
  var newTag = listItem.getElementsByClassName("new-tag")[0];
  var newSubtask = listItem.getElementsByClassName("new-subtask")[0];
  var subtasks = listItem.getElementsByClassName("subtasks")[0];
  var tags = listItem.getElementsByClassName("tags")[0];
  var taskCheck = listItem.getElementsByClassName("task-check")[0];

  var editTask = listItem.getElementsByClassName("edit-task")[0];
  var editCategory = listItem.getElementsByClassName("edit-category")[0];
  var editDate = listItem.getElementsByClassName("edit-date")[0];
  var editPriority = listItem.getElementsByClassName("edit-priority")[0];

  editTask.onblur = () => {
    if (editTask.value == task.info || editTask.value == "") {
      editTask.value = task.info;
      return;
    }
    logs.unshift({
      log: `Changed task name <strong>${task.info}</strong> to <strong>${editTask.value}</strong>`,
      time: new Date(
        new Date().getTime() - new Date().getTimezoneOffset() * 60000
      ).toJSON(),
    });
    task.info = editTask.value;
    updateTask(task);
  };
  editCategory.onblur = () => {
    if (editCategory.value == task.category || editCategory.value == "") {
      editCategory.value = task.category;
      return;
    }
    logs.unshift({
      log: `Changed category of task <strong>${task.info}</strong> from <strong>${task.category}</strong> to <strong>${editCategory.value}</strong>`,
      time: new Date(
        new Date().getTime() - new Date().getTimezoneOffset() * 60000
      ).toJSON(),
    });
    task.category = editCategory.value;
    updateTask(task);
  };
  editDate.onblur = () => {
    if (editDate.value == task.date || editDate.value == "") {
      editDate.value = task.date;
      return;
    }
    logs.unshift({
      log: `Changed due date of task <strong>${task.info}</strong> from  <strong>${task.date}</strong> to <strong>${editDate.value}</strong>`,
      time: new Date(
        new Date().getTime() - new Date().getTimezoneOffset() * 60000
      ).toJSON(),
    });
    task.date = editDate.value;
    updateTask(task);
  };
  editPriority.onclick = () => {
    logs.unshift({
      log: `Changed priority of task <strong>${
        task.info
      }</strong> from <strong>${
        task.priority == 0 ? "Low" : task.priority == 1 ? "Med" : "High"
      }</strong> to  <strong>${
        task.priority == 0 ? "Med" : task.priority == 1 ? "High" : "Low"
      }</strong>`,
      time: new Date(
        new Date().getTime() - new Date().getTimezoneOffset() * 60000
      ).toJSON(),
    });
    task.priority = (task.priority + 1) % 3;
    updateTask(task);
  };

  taskCheck.onclick = () => {
    completeTask(task.id);
  };

  subtaskAddButton.onclick = () => {
    if (newSubtask.value == "") return;
    addSubtask(task.id, newSubtask.value);
  };

  task.subtasks.forEach((subtask, i) => {
    var subtaskItem = document.createElement("li");
    subtaskItem.innerHTML = `
    <input type="checkbox" class="subtask-check" ${
      subtask.done ? "checked" : ""
    }/><input class="edit-subtask" type="text" value="${subtask.info}" />
    <div class="flex-filler"></div>
    <button class="subtask-delete-button">
      <img src="images/plus-red.svg" />
    </button>`;
    var subtaskDeleteButton = subtaskItem.getElementsByClassName(
      "subtask-delete-button"
    )[0];
    var subtaskCheck = subtaskItem.getElementsByClassName("subtask-check")[0];
    var editSubtask = subtaskItem.getElementsByClassName("edit-subtask")[0];
    editSubtask.onblur = () => {
      if (
        editSubtask.value == task.subtasks[i].info ||
        editSubtask.value == ""
      ) {
        editSubtask.value = task.subtasks[i].info;
        return;
      }
      logs.unshift({
        log: `Changed subtask of task <strong>${task.info}</strong> from  <strong>${task.subtasks[i].info}</strong> to <strong>${editSubtask.value}</strong>`,
        time: new Date(
          new Date().getTime() - new Date().getTimezoneOffset() * 60000
        ).toJSON(),
      });
      task.subtasks[i].info = editSubtask.value;
      updateTask(task);
    };
    subtaskDeleteButton.onclick = () => {
      deleteSubtask(task.id, i);
    };
    subtaskCheck.onclick = () => {
      completeSubtask(task.id, i);
    };
    subtasks.appendChild(subtaskItem);
  });

  tagAddButton.onclick = () => {
    if (newTag.value == "") return;
    addTag(task.id, newTag.value);
  };

  task.tags.forEach((tag, i) => {
    var tagItem = document.createElement("li");
    tagItem.innerHTML = `
    <span>#${tag}</span>
    <button class="tag-delete-button">
      <img src="images/plus.svg" />
    </button>`;
    var tagDeleteButton =
      tagItem.getElementsByClassName("tag-delete-button")[0];
    tagDeleteButton.onclick = () => {
      deleteTag(task.id, i);
    };
    tags.appendChild(tagItem);
  });

  deleteButton.onclick = () => {
    deleteTask(task.id);
  };

  return listItem;
};

var logListItem = (log) => {
  var logItem = document.createElement("div");
  logItem.className = "log-item";
  logItem.innerHTML = `
    <div class="log-timestamp">
      <span>${log.time.slice(2, 10).split("-").reverse().join("/")}</span>
      <span>${log.time.slice(11, 19)}</span>
    </div>
    <div class="log-info">${log.log}</div>
  `;
  return logItem;
};

const renderTasks = () => {
  console.log(data);
  list.innerHTML = "";

  var filterPriority = document.querySelector('input[name="priority"]:checked');
  var filterCompleted = document.querySelector(
    'input[name="completed"]:checked'
  );
  data
    .filter((x) => {
      return (
        (filterDateTo.value == "" || x.date <= filterDateTo.value) &&
        (filterDateFrom.value == "" || x.date >= filterDateFrom.value) &&
        (filterPriority.value == 3 || filterPriority.value == x.priority) &&
        (filterCategory.value == "" || filterCategory.value == x.category) &&
        !(
          (filterCompleted.value == 0 && x.done == false) ||
          (filterCompleted.value == 1 && x.done == true)
        )
      );
    })
    .forEach((task) => {
      list.appendChild(taskItem(task));
    });

  var inputItems = document.querySelectorAll("input");
  inputItems.forEach((x) => {
    x.onkeydown = (e) => {
      if (e.key == "Enter") {
        x.blur();
      }
    };
  });
};

const renderLogs = () => {
  console.log(logs);
  logsList.innerHTML = ``;
  if (logs.length > 0) {
    logsList.innerHTML = `
      <button id="log-clear-button">
        Clear Logs
      </button>
    `;
    var logDeleteButton = document.getElementById("log-clear-button");
    logDeleteButton.onclick = () => {
      logs = [];
      localStorage.setItem("logs", JSON.stringify(logs));
      renderLogs();
    };
  }
  logs.forEach((log) => {
    logsList.appendChild(logListItem(log));
  });
  logsList.style.maxHeight = `${logsList.scrollHeight}px`;
};

newButton.onclick = () => {
  if (newInput.value == "" || newCategory.value == "" || newDate.value == "")
    return;
  addTask(newInput.value, newCategory.value, newDate.value);
  newInput.value = "";
  newCategory.value = "";
  newDate.value = "";
};

renderTasks();
renderLogs();

filterDateFrom.onchange = renderTasks;
filterDateTo.onchange = renderTasks;
filterCategory.oninput = renderTasks;
var radios = [
  ...document.querySelectorAll('input[name="priority"]'),
  ...document.querySelectorAll('input[name="completed"]'),
];
radios.forEach((x) => {
  x.onchange = renderTasks;
});
filterUpcoming.onclick = () => {
  document.querySelectorAll('input[name="priority"]')[3].checked = true;
  document.querySelectorAll('input[name="completed"]')[1].checked = true;
  filterDateTo.value = null;
  filterDateFrom.value = new Date().toJSON().slice(0, 10);
  renderTasks();
};
filterMissed.onclick = () => {
  document.querySelectorAll('input[name="priority"]')[3].checked = true;
  document.querySelectorAll('input[name="completed"]')[1].checked = true;
  filterDateFrom.value = null;
  filterDateTo.value = new Date().toJSON().slice(0, 10);
  renderTasks();
};

filterToggle.onclick = () => {
  if (filterArea.className == "") filterArea.className = "hide";
  else filterArea.className = "";
};

logsToggle.onclick = () => {
  if (logsArea.className == "") logsArea.className = "hide";
  else logsArea.className = "";
};
