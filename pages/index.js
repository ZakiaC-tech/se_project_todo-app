import PopupWithForm from "../components/PopupWithForm.js";
import { v4 as uuidv4 } from "https://jspm.dev/uuid";
import { initialTodos, validationConfig } from "../utils/constants.js";
import Todo from "../components/Todo.js";
import FormValidator from "../components/FormValidator.js";
import Section from "../components/Section.js";

// ===== DOM ELEMENTS =====
const addTodoButton = document.querySelector(".button_action_add");
const counterText = document.querySelector(".counter__text");

// ===== FORM VALIDATION =====
const addTodoForm = document.querySelector("#add-todo-popup .popup__form");
const addTodoFormValidator = new FormValidator(validationConfig, addTodoForm);
addTodoFormValidator.enableValidation();

// ===== COUNTER (DOM SOURCE OF TRUTH) =====
function updateCounter() {
  const todos = Array.from(document.querySelectorAll(".todo"));

  const completedCount = todos.filter((todo) => {
    const checkbox = todo.querySelector(".todo__completed");
    return checkbox?.checked;
  }).length;

  counterText.textContent = `Showing ${completedCount} out of ${todos.length} completed`;
}

// ===== TODO CREATION =====
function generateTodo(data) {
  const todo = new Todo(data, "#todo-template");
  const todoElement = todo.getView();

  const checkbox = todoElement.querySelector(".todo__completed");
  const deleteBtn = todoElement.querySelector(".todo__delete-btn");

  checkbox.addEventListener("change", updateCounter);

  deleteBtn.addEventListener("click", () => {
    todoElement.remove();
    updateCounter();
  });

  return todoElement;
}

// ===== SECTION INSTANCE =====
const todoSection = new Section({
  items: initialTodos,
  renderer: (item) => {
    const todoElement = generateTodo(item);
    todoSection.addItem(todoElement);
  },
  containerSelector: ".todos__list",
});

// ===== POPUP WITH FORM =====
const addTodoPopup = new PopupWithForm("#add-todo-popup", (data) => {
  const date = new Date(data.date);
  date.setMinutes(date.getMinutes() + date.getTimezoneOffset());

  const todoData = {
    id: uuidv4(),
    name: data.name,
    completed: false,
    date,
  };

  const todoElement = generateTodo(todoData);
  todoSection.addItem(todoElement);

  addTodoForm.reset();
  addTodoFormValidator.resetValidation();
  addTodoPopup.close();

  updateCounter();
});

addTodoPopup.setEventListeners();

// ===== EVENT LISTENER =====
addTodoButton.addEventListener("click", () => {
  addTodoPopup.open();
});

// ===== INITIAL RENDER =====
todoSection.renderItems();
updateCounter();
