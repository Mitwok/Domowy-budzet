document.addEventListener("DOMContentLoaded", function () {
  const expensesList = document.getElementById("item-list-expenses");
  const incomeList = document.getElementById("item-list-income");
  const expensesTotalElement = document.getElementById("expenses-total");
  const incomeTotalElement = document.getElementById("income-total");
  const totalElement = document.getElementById("total");

  // Инициализация значений из Local Storage или установка значений по умолчанию
  let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
  let income = JSON.parse(localStorage.getItem("income")) || [];
  let total = parseFloat(localStorage.getItem("total")) || 0;

  // Функция для обновления итоговых значений
  function updateTotalValues() {
    expensesTotalElement.textContent = expenses.reduce(
      (total, expense) => total + expense.value,
      0
    );
    incomeTotalElement.textContent = income.reduce(
      (total, income) => total + income.value,
      0
    );
    total =
      parseFloat(incomeTotalElement.textContent) -
      parseFloat(expensesTotalElement.textContent);
    const totalBalanse = (total) => {
      if (total > 0) {
        // totalElement.classList.add("text-green-500");
        return "Możesz jeszcze wydać " + total + " złotych";
      } else if (total === 0) {
        // totalElement.classList.add("text-red-500");
        return "Bilans wynosi zero";
      } else {
        // totalElement.classList.add("text-red-500");
        return (
          "Bilans jest ujemny. Jesteś na minusie " +
          Math.abs(total) +
          " złotych"
        );
      }
    };
    totalElement.textContent = totalBalanse(total);
    incomeTotalElement.classList.add("font-semibold");
    expensesTotalElement.classList.add("font-semibold");
    localStorage.setItem("expenses", JSON.stringify(expenses));
    localStorage.setItem("income", JSON.stringify(income));
    localStorage.setItem("total", total);
  }

  // Функция для добавления нового элемента в список
  function addItemToList(list, item) {
    const li = document.createElement("li");
    li.textContent = `${item.name} - ${item.value} zł`;
    list.insertBefore(li, list.firstChild);
  }

  // Восстановление элементов списка при загрузке страницы
  expenses.forEach((expense) => addItemToList(expensesList, expense));
  income.forEach((item) => addItemToList(incomeList, item));

  // Обработчик для добавления нового элемента расходов
  document
    .getElementById("add-button-expenses")
    .addEventListener("click", function () {
      const name = document.getElementById("new-item-expenses").value;
      const value = parseFloat(
        document.getElementById("new-item-expenses-value").value
      );
      if (name && !isNaN(value)) {
        const newItem = { name, value };
        expenses.unshift(newItem);
        addItemToList(expensesList, newItem);
        document.getElementById("new-item-expenses").value = "";
        document.getElementById("new-item-expenses-value").value = "";
        refreshItemList();
        updateTotalValues();
      }
    });

  // Обработчик для добавления нового элемента доходов
  document
    .getElementById("add-income-button")
    .addEventListener("click", function () {
      const name = document.getElementById("new-item-income").value;
      const value = parseFloat(
        document.getElementById("new-item-income-value").value
      );
      if (name && !isNaN(value)) {
        const newItem = { name, value };
        income.unshift(newItem);
        addItemToList(incomeList, newItem);
        document.getElementById("new-item-income").value = "";
        document.getElementById("new-item-income-value").value = "";
        refreshItemList();
        updateTotalValues();
      }
    });
  // Функция для редактирования элемента
  function editItem(list, index) {
    const item = list[index];
    const newName = prompt("Nowa nazwa:", item.name);
    const newValue = parseFloat(prompt("Nowa kwota:", item.value));
    if (newName !== null && !isNaN(newValue)) {
      item.name = newName;
      item.value = newValue;
      list[index] = item;
      // Обновите элемент в Local Storage
      localStorage.setItem("expenses", JSON.stringify(expenses));
      localStorage.setItem("income", JSON.stringify(income));
      updateTotalValues();
      // Перестройте список после редактирования
      refreshItemList();
    }
  }

  // Функция для удаления элемента
  function deleteItem(list, index) {
    list.splice(index, 1);
    // Удалите элемент из Local Storage
    localStorage.setItem("expenses", JSON.stringify(expenses));
    localStorage.setItem("income", JSON.stringify(income));
    updateTotalValues();
    // Перестройте список после удаления
    refreshItemList();
  }
  // Функция для перестройки списка
  function refreshItemList() {
    // Очистите список
    expensesList.innerHTML = "";
    incomeList.innerHTML = "";

    // Добавьте обработчики кнопок редактирования и удаления для каждого элемента
    expenses.forEach((expense, index) => {
      const li = document.createElement("li");
      li.textContent = `${expense.name} - ${expense.value} zł`;
      const editDiv = document.createElement("div");
      const editButton = document.createElement("button");
      editButton.textContent = "✏️";
      editButton.title = "Edytuj";
      const deleteButton = document.createElement("button");
      deleteButton.textContent = "🗑️";
      deleteButton.title = "Usuń";

      // Обработчик для кнопки редактирования
      editButton.addEventListener("click", () => editItem(expenses, index));

      // Обработчик для кнопки удаления
      deleteButton.addEventListener("click", () => deleteItem(expenses, index));

      li.classList.add(
        "flex",
        "justify-between",
        "bg-white",
        "rounded-lg",
        "mb-4",
        "p-2"
      );
      editButton.classList.add("mr-2");
      li.appendChild(editDiv);
      editDiv.appendChild(editButton);
      editDiv.appendChild(deleteButton);

      expensesList.appendChild(li);
    });

    income.forEach((item, index) => {
      const li = document.createElement("li");
      li.textContent = `${item.name} - ${item.value} zł`;
      const editDiv = document.createElement("div");
      const editButton = document.createElement("button");
      editButton.textContent = "✏️";
      editButton.title = "Edytuj";
      const deleteButton = document.createElement("button");
      deleteButton.textContent = "🗑️";
      deleteButton.title = "Usuń";

      // Обработчик для кнопки редактирования
      editButton.addEventListener("click", () => editItem(income, index));

      // Обработчик для кнопки удаления
      deleteButton.addEventListener("click", () => deleteItem(income, index));

      li.classList.add(
        "flex",
        "justify-between",
        "bg-white",
        "rounded-lg",
        "mb-4",
        "p-2"
      );
      editButton.classList.add("mr-2");
      li.appendChild(editDiv);
      editDiv.appendChild(editButton);
      editDiv.appendChild(deleteButton);
      incomeList.appendChild(li);
    });
  }

  // Восстановление элементов списка при загрузке страницы
  refreshItemList();

  // Инициализация итоговых значений при загрузке страницы
  updateTotalValues();
});
