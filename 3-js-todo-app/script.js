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
var filterPending = document.getElementById("filter-pending");

var data = JSON.parse(localStorage.getItem("tasks"));
if (data == null) data = [];
console.log(data);

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
  console.log(data);
  localStorage.setItem("tasks", JSON.stringify(data));
  renderTasks();
};

const deleteTask = (id) => {
  for (let i = 0; i < data.length; i++) {
    if (data[i].id == id) {
      data.splice(i, 1);
      break;
    }
  }
  console.log(data);
  localStorage.setItem("tasks", JSON.stringify(data));
  renderTasks();
};

const deleteSubtask = (id, n) => {
  for (let i = 0; i < data.length; i++) {
    if (data[i].id == id) {
      data[i].subtasks.splice(n, 1);
      break;
    }
  }
  console.log(data);
  localStorage.setItem("tasks", JSON.stringify(data));
  renderTasks();
};

const deleteTag = (id, n) => {
  for (let i = 0; i < data.length; i++) {
    if (data[i].id == id) {
      data[i].tags.splice(n, 1);
      break;
    }
  }
  console.log(data);
  localStorage.setItem("tasks", JSON.stringify(data));
  renderTasks();
};

const completeTask = (id) => {
  for (let i = 0; i < data.length; i++) {
    if (data[i].id == id) {
      data[i].done = !data[i].done;
      break;
    }
  }
  console.log(data);
  localStorage.setItem("tasks", JSON.stringify(data));
  renderTasks();
};

const completeSubtask = (id, n) => {
  for (let i = 0; i < data.length; i++) {
    if (data[i].id == id) {
      data[i].subtasks[n].done = !data[i].subtasks[n].done;
      break;
    }
  }
  console.log(data);
  localStorage.setItem("tasks", JSON.stringify(data));
  renderTasks();
};

const addTag = (id, tag) => {
  for (let i = 0; i < data.length; i++) {
    if (data[i].id == id) {
      data[i].tags.push(tag);
      break;
    }
  }
  console.log(data);
  localStorage.setItem("tasks", JSON.stringify(data));
  renderTasks();
};

const addSubtask = (id, subtask) => {
  for (let i = 0; i < data.length; i++) {
    if (data[i].id == id) {
      data[i].subtasks.push({ info: subtask, done: false });
      break;
    }
  }
  console.log(data);
  localStorage.setItem("tasks", JSON.stringify(data));
  renderTasks();
};

const updateTask = (task) => {
  for (let i = 0; i < data.length; i++) {
    if (data[i].id == task.id) {
      data[i] = task;
      break;
    }
  }
  console.log(data);
  localStorage.setItem("tasks", JSON.stringify(data));
  renderTasks();
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
        <button class="edit-priority priority-${task.priority}">${
    task.priority == 0 ? "Low" : task.priority == 1 ? "Med" : "High"
  }</button>
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
    if (editTask.value != "") task.info = editTask.value;
    updateTask(task);
  };
  editCategory.onblur = () => {
    if (editCategory.value != "") task.category = editCategory.value;
    updateTask(task);
  };
  editDate.onblur = () => {
    if (editDate.value != "") task.date = editDate.value;
    updateTask(task);
  };
  editPriority.onclick = () => {
    task.priority = (task.priority + 1) % 3;
    updateTask(task);
  };

  taskCheck.onclick = () => {
    completeTask(task.id);
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
      console.log("text");
      deleteTag(task.id, i);
    };
    tags.appendChild(tagItem);
  });

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
      if (editSubtask.value != "") task.subtasks[i].info = editSubtask.value;
      updateTask(task);
    };
    subtaskDeleteButton.onclick = () => {
      console.log("text");
      deleteSubtask(task.id, i);
    };
    subtaskCheck.onclick = () => {
      completeSubtask(task.id, i);
    };
    subtasks.appendChild(subtaskItem);
  });

  deleteButton.onclick = () => {
    console.log("text");
    deleteTask(task.id);
  };

  tagAddButton.onclick = () => {
    if (newTag.value == "") return;
    addTag(task.id, newTag.value);
  };

  subtaskAddButton.onclick = () => {
    if (newSubtask.value == "") return;
    addSubtask(task.id, newSubtask.value);
  };

  return listItem;
};

const renderTasks = () => {
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
          (filterCompleted.value == 0 && x.done == true) ||
          (filterCompleted.value == 1 && x.done == false)
        )
      );
    })
    .forEach((task) => {
      list.appendChild(taskItem(task));
    });
};

newButton.onclick = () => {
  console.log(newInput.value, newCategory.value, newDate.value);
  if (newInput.value == "" || newCategory.value == "" || newDate.value == "")
    return;
  addTask(newInput.value, newCategory.value, newDate.value);
  newInput.value = "";
};

renderTasks();

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
filterPending.onclick = () => {
  let date = new Date();
  document.querySelectorAll('input[name="completed"]')[1].checked = true;
  filterDateTo.value = null;
  filterDateFrom.value = date.toJSON().slice(0, 10);
  renderTasks();
};
filterMissed.onclick = () => {
  let date = new Date();
  document.querySelectorAll('input[name="completed"]')[0].checked = true;
  filterDateFrom.value = null;
  filterDateTo.value = date.toJSON().slice(0, 10);
  renderTasks();
};

filterToggle.onclick = () => {
  if (filterArea.className == "") filterArea.className = "hide";
  else filterArea.className = "";
};
