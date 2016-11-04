'use strict';

var STORAGE_KEY = 'todoList';
var allTodos, completedTodos, activeTodos;

function $(elem) {
  return document.querySelector(elem);
}

var getStore = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
var setStore = function setStore(todos) {
  return localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
};

function list() {
  $("#todo-list").innerHTML = getStore.map(function (current, index) {
    var id = index;
    var completed = current.status == true ? "completed" : "uncompleted";
    var checked = completed == "completed" ? "checked" : "";
    var title = current.subject;

    return '<li id="todo-' + id + '" class="' + completed + '">\n        <div class="view">\n          <input class="toggle" type="checkbox" onchange="updateStatus(' + id + ')" ' + checked + '>\n          <label ondblclick="edit(' + id + ')">' + title + '</label>\n          <button class="destroy" onclick="removeTodo(' + id + ')"></button>\n        </div>\n      </li>';
  }).join("");

  allTodos = getStore.length;
  completedTodos = getStore.filter(function (todo) {
    return todo.status;
  }).length;
  activeTodos = allTodos - completedTodos;

  if (activeTodos == 0) {
    $(".todo-count").innerHTML = "Hepsi Tamam";
    $(".toggle-all").checked = true;
  } else {
    $(".todo-count").innerHTML = activeTodos + ' Yap\u0131lacak';
    $(".toggle-all").checked = false;
  }

  if (window.location.hash == "") {
    window.location.hash = "#/";
  };

  route();
}

list();

function addTodo(e) {
  if (e.keyCode == 13) {
    getStore.push({ "subject": $(".new-todo").value, "status": false });
    $(".new-todo").value = "";
    setStore(getStore);
    list();
  }
}

function edit(id) {
  $('#todo-' + id).classList.add("editing");

  var Edit = '<input type="text" id="edit" class="edit" value="' + getStore[id].subject + '" onkeydown="keyEvent(event, ' + id + ')" onblur="updateSubject(' + id + ')">';

  $('#todo-' + id).insertAdjacentHTML('beforeend', Edit);
  $("#edit").focus();
  $("#edit").value = $("#edit").value;
}

function updateStatus(id) {
  getStore[id].status = !getStore[id].status;
  setStore(getStore);
  list();
}

function updateSubject(id) {
  getStore[id].subject = $("#edit").value;
  setStore(getStore);
  list();
}

function keyEvent(e, id) {
  if (e.keyCode == 13) {
    updateSubject(id);
  } else if (e.keyCode == 27) {
    $("#edit").value = getStore[id].subject;
    list();
  }
}

function toggleAll() {
  setStore(getStore.map(function (current) {
    current.status = $(".toggle-all").checked;
    return current;
  }));
  list();
}

function removeTodo(id) {
  getStore.splice(id, 1);
  setStore(getStore);
  list();
}

function removeAll() {
  getStore = getStore.filter(function (todo) {
    return !todo.status;
  });
  setStore(getStore);
  list();
}

function route() {
  var hash = window.location.hash;

  if (document.querySelector('a.selected')) {
    document.querySelector('a.selected').classList.remove("selected");
  }

  document.querySelector('a[href=\'' + hash + '\']').classList.add("selected");

  function hashStyle(hashClass) {
    if (hashClass != null) {
      $("#hashStyle").innerHTML = '.' + hashClass + ' {display: none;}';
    } else {
      $("#hashStyle").innerHTML = "";
    }
  }

  if (hash == "#/active") {
    hashStyle("completed");
  } else if (hash == "#/completed") {
    hashStyle("uncompleted");
  } else {
    hashStyle();
  }
  console.log(hash);
}