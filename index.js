document.addEventListener("DOMContentLoaded", function () {
  const expensesList = document.getElementById("item-list-expenses");
  const incomeList = document.getElementById("item-list-income");
  const expensesTotalElement = document.getElementById("expenses-total");
  const incomeTotalElement = document.getElementById("income-total");
  const totalElement = document.getElementById("total");
  const mainSection = document.getElementById("main-section");

  function mainSectionHeight() {
    const topHeight =
      window.innerHeight -
      (document.getElementById("logo").clientHeight +
        document.getElementById("balance").clientHeight * 2 +
        document.getElementById("buttons-section").clientHeight);

    // Проверка, чтобы убедиться, что topHeight не меньше 20rem (примерное значение)
    const minHeight =
      20 * parseFloat(getComputedStyle(document.documentElement).fontSize);
    if (topHeight < minHeight) {
      mainSection.style.height = `${minHeight}px`;
    } else {
      mainSection.style.height = `${topHeight}px`;
    }
  }

  mainSectionHeight();

  window.addEventListener("resize", mainSectionHeight);

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

  // Обработчик события кнопки расходов
  document
    .getElementById("income-button")
    .addEventListener("click", function () {
      const expenseButton = document.getElementById("expense-button");
      const incomeButton = document.getElementById("income-button");
      const incomeSection = document.getElementById("income-section");
      const expenseSection = document.getElementById("expense-section");

      expenseButton.classList.add("border-b-white", "text-slate-400");
      incomeButton.classList.add("text-black", "border-b-transparent");
      incomeButton.classList.remove("text-slate-400", "border-b-white");
      incomeSection.classList.add("flex");
      incomeSection.classList.remove("hidden");
      expenseSection.classList.add("hidden");
      expenseSection.classList.remove("flex");
    });

  // Обработчик события кнопки доходов
  document
    .getElementById("expense-button")
    .addEventListener("click", function () {
      const expenseButton = document.getElementById("expense-button");
      const incomeButton = document.getElementById("income-button");
      const incomeSection = document.getElementById("income-section");
      const expenseSection = document.getElementById("expense-section");

      expenseButton.classList.add("border-b-transparent", "text-black");
      expenseButton.classList.remove("border-b-white", "text-slate-400");
      incomeButton.classList.add("border-b-white", "text-slate-400");
      incomeButton.classList.remove("border-b-transparent", "text-white");
      expenseSection.classList.add("flex");
      expenseSection.classList.remove("hidden");
      incomeSection.classList.add("hidden");
      incomeSection.classList.remove("flex");
    });

  // Обработчик для добавления нового элемента расходов
  document
    .getElementById("add-button-expenses")
    .addEventListener("click", function () {
      const name = document.getElementById("new-item-expenses").value;
      const value = parseFloat(
        document.getElementById("new-item-expenses-value").value
      );
      if (name && !isNaN(value) && value >= 0) {
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
      if (name && !isNaN(value) && value >= 0) {
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
  // Функция для редактирования элемента
  function editItem(list, index, listType) {
    const item = list[index];
    const editedItem = { ...item }; // Создаем копию элемента
    const editModal = document.getElementById("edit-modal");
    const editWindow = document.getElementById("edit-window");
    const newNameEdit = document.getElementById("new-name");
    const newValueEdit = document.getElementById("new-value");
    const cancel = document.getElementById("cancel-button");
    const ok = document.getElementById("ok-button");

    // Очищаем предыдущие значения, если они были
    newNameEdit.value = "";
    newValueEdit.value = "";

    // Заполняем текстовые поля с данными элемента
    newNameEdit.value = editedItem.name;
    newValueEdit.value = editedItem.value;

    editModal.classList.add("fixed");
    editModal.classList.remove("hidden");

    document.addEventListener("click", function (event) {
      if (event.target === edit) {
        editModal.classList.add("hidden");
        editModal.classList.remove("fixed");
      }
    });

    cancel.addEventListener("click", function () {
      editModal.classList.add("hidden");
      editModal.classList.remove("fixed");
    });

    editWindow.addEventListener("click", function (event) {
      event.stopPropagation();
    });

    ok.addEventListener("click", function () {
      if (newNameEdit.value !== "" && !isNaN(newValueEdit.value)) {
        editedItem.name = newNameEdit.value;
        editedItem.value = parseFloat(newValueEdit.value);
        // Обновляем элемент в Local Storage, учитывая тип списка
        list[index] = editedItem; // Заменяем элемент в исходном массиве
        if (listType === "expenses") {
          localStorage.setItem("expenses", JSON.stringify(list));
        } else if (listType === "income") {
          localStorage.setItem("income", JSON.stringify(list));
        }
        updateTotalValues();
        // Перестраиваем список после редактирования
        refreshItemList();
        editModal.classList.add("hidden");
        editModal.classList.remove("fixed");
      }
    });
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
      const textSpan = document.createElement("span");
      const valueSpan = document.createElement("span");
      const textDiv = document.createElement("div");
      textSpan.textContent = `${expense.name}`;
      valueSpan.textContent = `${expense.value} zł`;
      valueSpan.classList.add("text-center");
      //   li.textContent = `${item.name} - ${item.value} zł`;
      const editDiv = document.createElement("div");
      editDiv.classList.add("flex", "flex-nowrap");
      textDiv.classList.add("flex", "justify-between", "w-full", "px-4");
      const editButton = document.createElement("button");
      // Создаем элемент <svg>
      const svgEdit = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "svg"
      );
      svgEdit.setAttribute("xmlns", "http://www.w3.org/2000/svg");
      svgEdit.setAttribute("fill", "none");
      svgEdit.setAttribute("viewBox", "0 0 24 24");
      svgEdit.setAttribute("stroke-width", "1.5");
      svgEdit.setAttribute("stroke", "currentColor");
      svgEdit.classList.add("md:w-6", "md:h-6", "w-7", "h-7");

      // Создаем элемент <path>
      const path = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
      );
      path.setAttribute("stroke-linecap", "round");
      path.setAttribute("stroke-linejoin", "round");
      path.setAttribute(
        "d",
        "M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
      );

      // Добавляем элемент <path> к элементу <svg>
      svgEdit.appendChild(path);

      // Добавляем <svg> к документу
      document.body.appendChild(svgEdit);

      editButton.appendChild(svgEdit);

      editButton.title = "Edytuj";
      editButton.classList.add("p-2");
      const deleteButton = document.createElement("button");
      // Создаем элемент <svg> bin
      const svgBin = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "svg"
      );
      svgBin.setAttribute("xmlns", "http://www.w3.org/2000/svg");
      svgBin.setAttribute("fill", "none");
      svgBin.setAttribute("viewBox", "0 0 24 24");
      svgBin.setAttribute("stroke-width", "1.5");
      svgBin.setAttribute("stroke", "currentColor");
      svgBin.classList.add("md:w-6", "md:h-6", "w-7", "h-7");

      // Создаем элемент <path>
      const pathElement = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
      );
      pathElement.setAttribute("stroke-linecap", "round");
      pathElement.setAttribute("stroke-linejoin", "round");
      pathElement.setAttribute(
        "d",
        "M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
      );

      // Добавляем элемент <path> в элемент <svg>
      svgBin.appendChild(pathElement);

      // Теперь svgBin содержит созданный SVG-иконку

      deleteButton.appendChild(svgBin);
      deleteButton.title = "Usuń";
      deleteButton.classList.add("p-2");

      // Обработчик для кнопки редактирования
      editButton.addEventListener("click", () =>
        editItem(expenses, index, "expenses")
      );

      // Обработчик для кнопки удаления
      deleteButton.addEventListener("click", () => deleteItem(expenses, index));

      li.classList.add(
        "flex",
        "justify-between",
        "items-center",
        "bg-white",
        "rounded-lg",
        "mb-4",
        "p-2",
        "text-xl",
        "md:text-base"
      );
      editButton.classList.add("mr-2");
      textDiv.appendChild(textSpan);
      textDiv.appendChild(valueSpan);
      li.appendChild(textDiv);
      li.appendChild(editDiv);
      editDiv.appendChild(editButton);
      editDiv.appendChild(deleteButton);
      incomeList.appendChild(li);

      expensesList.appendChild(li);
    });

    income.forEach((item, index) => {
      const li = document.createElement("li");
      const textSpan = document.createElement("span");
      const valueSpan = document.createElement("span");
      const textDiv = document.createElement("div");
      textSpan.textContent = `${item.name}`;
      valueSpan.textContent = `${item.value} zł`;
      valueSpan.classList.add("text-center");
      //   li.textContent = `${item.name} - ${item.value} zł`;
      const editDiv = document.createElement("div");
      editDiv.classList.add("flex", "flex-nowrap");
      textDiv.classList.add("flex", "justify-between", "w-full", "px-4");
      const editButton = document.createElement("button");
      // Создаем элемент <svg>
      const svgEdit = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "svg"
      );
      svgEdit.setAttribute("xmlns", "http://www.w3.org/2000/svg");
      svgEdit.setAttribute("fill", "none");
      svgEdit.setAttribute("viewBox", "0 0 24 24");
      svgEdit.setAttribute("stroke-width", "1.5");
      svgEdit.setAttribute("stroke", "currentColor");
      svgEdit.classList.add("md:w-6", "md:h-6", "w-7", "h-7");

      // Создаем элемент <path>
      const path = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
      );
      path.setAttribute("stroke-linecap", "round");
      path.setAttribute("stroke-linejoin", "round");
      path.setAttribute(
        "d",
        "M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
      );

      // Добавляем элемент <path> к элементу <svg>
      svgEdit.appendChild(path);

      // Добавляем <svg> к документу
      document.body.appendChild(svgEdit);

      editButton.appendChild(svgEdit);

      editButton.title = "Edytuj";
      editButton.classList.add("p-2");
      const deleteButton = document.createElement("button");
      // Создаем элемент <svg> bin
      const svgBin = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "svg"
      );
      svgBin.setAttribute("xmlns", "http://www.w3.org/2000/svg");
      svgBin.setAttribute("fill", "none");
      svgBin.setAttribute("viewBox", "0 0 24 24");
      svgBin.setAttribute("stroke-width", "1.5");
      svgBin.setAttribute("stroke", "currentColor");
      svgBin.classList.add("md:w-6", "md:h-6", "w-7", "h-7");

      // Создаем элемент <path>
      const pathElement = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
      );
      pathElement.setAttribute("stroke-linecap", "round");
      pathElement.setAttribute("stroke-linejoin", "round");
      pathElement.setAttribute(
        "d",
        "M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
      );

      // Добавляем элемент <path> в элемент <svg>
      svgBin.appendChild(pathElement);

      // Теперь svgBin содержит созданный SVG-иконку

      deleteButton.appendChild(svgBin);
      deleteButton.title = "Usuń";
      deleteButton.classList.add("p-2");

      // Обработчик для кнопки редактирования
      editButton.addEventListener("click", () => editItem(income, index));

      // Обработчик для кнопки удаления
      deleteButton.addEventListener("click", () => deleteItem(income, index));

      li.classList.add(
        "flex",
        "justify-between",
        "items-center",
        "bg-white",
        "rounded-lg",
        "mb-4",
        "p-2",
        "text-xl",
        "md:text-base"
      );
      editButton.classList.add("mr-2");
      textDiv.appendChild(textSpan);
      textDiv.appendChild(valueSpan);
      li.appendChild(textDiv);
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
