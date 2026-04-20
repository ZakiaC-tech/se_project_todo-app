export default class Todo {
  constructor(data, selector, { onCheck, onDelete } = {}) {
    this._onCheck = onCheck;
    this._onDelete = onDelete;

    this._id = data.id || crypto.randomUUID();
    this._name = data.name;
    this._completed = data.completed ?? false;
    this._date = data.date;
    this._selector = selector;
  }

  _getTemplate() {
    const template = document.querySelector(this._selector);
    return template.content.querySelector(".todo").cloneNode(true);
  }

  _setData() {
    this._nameEl.textContent = this._name;
    this._checkboxEl.checked = this._completed;

    this._checkboxEl.id = `todo-${this._id}`;
    this._labelEl.setAttribute("for", `todo-${this._id}`);

    const dueDate = new Date(this._date);

    this._dateEl.textContent = !isNaN(dueDate.getTime())
      ? `Due: ${dueDate.toLocaleString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })}`
      : "";
  }

  _handleDelete() {
    this._onDelete?.(this._completed);

    this._element.remove();
    this._element = null;
  }

  _handleToggleComplete() {
    this._completed = this._checkboxEl.checked;

    this._onCheck?.(this._completed);
  }

  _setEventListeners() {
    this._deleteBtn.addEventListener("click", () => this._handleDelete());
    this._checkboxEl.addEventListener("change", () =>
      this._handleToggleComplete(),
    );
  }

  getView() {
    this._element = this._getTemplate();

    this._nameEl = this._element.querySelector(".todo__name");
    this._checkboxEl = this._element.querySelector(".todo__completed");
    this._labelEl = this._element.querySelector(".todo__label");
    this._dateEl = this._element.querySelector(".todo__date");
    this._deleteBtn = this._element.querySelector(".todo__delete-btn");

    this._setData();
    this._setEventListeners();

    return this._element;
  }
}
