// Twój kod

$(function () {
  const todoListUl = $('ul.todo-list');
  const todoNumberSpan = $('span.todo-count strong');

  let itemsLeft = 0;
  let lastId = 0;
  let todosList = [];
  let body = $("body");

  loadToDos();

  body.on("click", "button.destroy", e => {
    e.preventDefault();
    deleteToDo($(e.target).data("id"));
  });

  body.on("click", ".view input.toggle", e => {
    toggleDone($(e.target).data("id"));
  });

  body.on("dblclick", ".view label", e => {
    let _this = $(e.target);
    let input = _this.parent().next();
    _this.hide();
    input.show();
    input.focus();
    input.on("blur", e => {
      input.hide();
      _this.text(input.val());
      _this.show();
      updateToDoText(parseInt(_this.next().data('id')), input.val());
      saveToDos();
    });
    input.keypress(e => {
      if (e.which === 13) {
        input.hide();
        _this.text(input.val());
        _this.show();
        updateToDoText(parseInt(_this.next().data('id')), input.val());
        saveToDos();
      }
    });
  });

  $("input.new-todo").keypress(e => {
    if (e.which === 13) {
      lastId++;
      todosList.push({ "id": lastId, "text": $(e.target).val(), "done": false });
      $(e.target).val("");
      saveToDos();
      loadToDos();
    }
  });

  function loadToDos() {
    todoListUl.empty();
    $.ajax({
      url: '/todos',
      type: 'GET',
      dataType: 'json',
    }).then(response => {
      itemsLeft = 0;
      todosList = response;
      response.forEach(response => {

        if (!response.done) {
          itemsLeft++;
        }
        if (response.id > lastId) {
          lastId = response.id;
        }

        let inputChecked = '';
        let liClass = '';
        if (response.done) {
          liClass = "completed";
          inputChecked = "checked";
        }

        let template =
          '<li class="' + liClass + '" data-id="' + response.id + '">' +
          '<div class="view">' +
          '<input class="toggle" type="checkbox" data-id="' + response.id + '" ' + inputChecked + '>' +
          '<label>' + response.text + '</label>' +
          '<button class="destroy" data-id="' + response.id + '"></button>' +
          '</div>' +
          '<input class="edit" value="' + response.text + '">' +
          '</li>';

        todoListUl.append(template);
      });
      updateItemsLeft();
    });
  }

  function toggleDone(id) {
    $.ajax({
      url: '/todos/' + id + '/done',
      type: 'POST',
      dataType: 'json',
    });

    $("ul.todo-list").find("li[data-id='" + id + "']").toggleClass("completed");

    if ($("body").find("input.toggle[data-id='" + id + "']").is(":checked")) {
      itemsLeft--;
    }
    else {
      itemsLeft++;
    }
    updateItemsLeft();
  }

  function deleteToDo(id) {
    $.ajax({
      url: '/todos/' + id,
      type: 'DELETE',
      dataType: 'json',
    });
    $("ul.todo-list").find("li[data-id='" + id + "']").remove();
  }

  function updateToDoText(id, text) {
    console.log(todosList);
    todosList.forEach(response => {
      if (response.id === id) {
        response.text = text;
      }
    })
  }

  function updateItemsLeft() {
    todoNumberSpan.text(itemsLeft);
  }

  function saveToDos() {
    $.ajax({
      url: '/todos',
      type: 'PUT',
      dataType: 'json',
      data: {
        todos: todosList
      }
    });
  }
});