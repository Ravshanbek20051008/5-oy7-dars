const form = document.querySelector("#form");
const name = document.querySelector("#todo-name");
const time = document.querySelector("#todo-time");
const add = document.querySelector("#add");
const filter = document.querySelector("#filter");
const todowrapper = document.querySelector("#todo-wrapper");

function createitem(todo) {
  let ischecked = todo.status == "inactive" ? true : false;
  return `  <div class="todo-item">
          <div class="left">
            <input type="checkbox"${
              ischecked ? "checked" : ""
            } onchange="toggleCheck(event, ${todo.id})">
            <div class="info">
              <h3 style="text-decoration:${
                ischecked ? "line-through" : "none"
              }" id="todo-name-id${todo.id}">${todo.name}</h3>
              <p>${todo.time}</p>
            </div>
          </div>
          <div class="rigth">
            <span class="delete" data-id="${todo.id}">
              <i class="fa-solid fa-trash-can"></i>
            </span>
            <span class="edit">
              <i class="fa-solid fa-pen-nib"></i>
            </span>
          </div>
        </div>`;
}

function validate(name, time) {
  if (name.value.length < 3) {
    alert("todo name 3 ta belgidan kam bo'lmasin");
    name.focus();
    return false;
  }
  if (!time.value.length) {
    alert("todo time 3 ta belgidan kam bo'lmasin");
    time.focus();
    return false;
  }
  return true;
}

function getData() {
  let data = [];
  if (localStorage.getItem("todos")) {
    data = JSON.parse(localStorage.getItem("todos"));
  }
  return data;
}

function toggleCheck(event, id) {
  let todos = getData();
  todos = todos.map((todo) => {
    if (todo.id === id) {
      todo.status = event.target.checked ? "inactive" : "active";
    }
    return todo;
  });
  localStorage.setItem("todos", JSON.stringify(todos));
  let h3 = document.querySelector(`#todo-name-id${id}`);
  h3.style.textDecoration = event.target.checked ? "line-through" : "none";
}

add &&
  add.addEventListener("click", function (event) {
    event.preventDefault();
    const isvalid = validate(name, time);
    if (!isvalid) {
      return;
    }
    const todo = {
      id: Date.now(),
      name: name.value,
      time: time.value,
      status: "active",
    };
    let todos = getData();
    todos.push(todo);
    localStorage.setItem("todos", JSON.stringify(todos));
    form.reset();

    const card = createitem(todo);
    todowrapper.innerHTML += card;
  });

document.addEventListener("DOMContentLoaded", function (event) {
  let todos = getData();
  todos.forEach((element) => {
    let card = createitem(element);
    todowrapper.innerHTML += card;
  });
  const deletebuttons = document.querySelectorAll(".delete");
  deletebuttons.forEach(function (delitem) {
    delitem.addEventListener("click", function () {
      let isdelete = confirm("Rostdan ham o'chirmoqchimisz");
      if (isdelete) {
        this.parentNode.parentNode.remove();
        let id = this.getAttribute("data-id");
        let todos = getData();
        todos = todos.filter(function (el) {
          return el.id != id;
        });
        localStorage.setItem("todos", JSON.stringify(todos));
      }
    });
  });
});

filter &&
  filter.addEventListener("change", function () {
    let todos = getData();
    let selectvalue = this.value;
    let result = todos.filter(function (el) {
      if (selectvalue == "all") {
        return true;
      }
      if (selectvalue == "active") {
        return el.status == "active";
      }
      if (selectvalue == "inactive") {
        return el.status == "inactive";
      }
    });
    todowrapper.innerHTML = "";
    result.length &&
      result.forEach(function (el) {
        let card = createitem(el);
        todowrapper.innerHTML += card;
      });
  });
