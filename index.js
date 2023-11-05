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

    // Check to make sure topHeight is at least 20rem (approximate value)
    const minHeight =
      20 * parseFloat(getComputedStyle(document.documentElement).fontSize);
    if (topHeight < minHeight) {
      mainSection.style.height = `${minHeight}px`;
    } else {
      mainSection.style.height = `${topHeight}px`;
    }
  }

  // Setting the height for the main section
  mainSectionHeight();

  window.addEventListener("resize", mainSectionHeight);

  // Initializing values from Local Storage or setting default values
  let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
  let income = JSON.parse(localStorage.getItem("income")) || [];
  let total = parseFloat(localStorage.getItem("total")) || 0;

  // Function for updating totals
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
        return (
          "Możesz jeszcze wydać " +
          total.toFixed(2).replace(/\.?0*$/, "") +
          " złotych"
        );
      } else if (total === 0) {
        return "Bilans wynosi zero";
      } else {
        return (
          "Bilans jest ujemny. Jesteś na minusie " +
          Math.abs(total.toFixed(2).replace(/\.?0*$/, "")) +
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

  // Function for adding a new item to the list
  function addItemToList(list, item) {
    const li = document.createElement("li");
    li.textContent = `${item.name} - ${item.value} zł`;
    list.insertBefore(li, list.firstChild);
  }

  // Restoring list items when the page loads
  expenses.forEach((expense) => addItemToList(expensesList, expense));
  income.forEach((item) => addItemToList(incomeList, item));

  // Handler income button
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

  // Handler expense button
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

  // Handler for adding a new expense item
  document
    .getElementById("expense-form")
    .addEventListener("submit", function (event) {
      event.preventDefault();
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
        document.getElementById("new-item-expenses").focus();
      }
    });

  // Handler for adding a new income item
  document
    .getElementById("income-form")
    .addEventListener("submit", function (event) {
      event.preventDefault();
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
        document.getElementById("new-item-income").focus();
      }
    });

  // Function for editing an element
  function editItem(list, index) {
    let item = list[index];
    const editModal = document.getElementById("edit-modal");
    const editWindow = document.getElementById("edit-window");
    const newNameEdit = document.getElementById("new-name");
    const newValueEdit = document.getElementById("new-value");
    const cancel = document.getElementById("cancel-button");
    const save = document.getElementById("save-button");

    // Fill in the text fields with the element data
    newNameEdit.value = item.name;
    newValueEdit.value = item.value;

    editModal.classList.add("fixed");
    editModal.classList.remove("hidden");
    fadeIn();
    newNameEdit.focus();

    document.addEventListener("click", function (event) {
      if (event.target === edit) {
        editModal.classList.add("hidden");
        editModal.classList.remove("fixed");
      }
    });

    function fadeIn() {
      editModal.classList.add("fade-in");
      editModal.classList.remove("fade-out");
      editWindow.classList.add("slide-in");
      editWindow.classList.remove("slide-out");
    }

    newNameEdit.addEventListener("keydown", function (e) {
      if (e.key === "Tab" && e.shiftKey) {
        e.preventDefault();
        save.focus();
      } else if (e.key === "Enter") {
        e.preventDefault();
        newValueEdit.focus();
      }
    });

    newValueEdit.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        editWindow.dispatchEvent(new Event("submit"));
      }
    });

    cancel.addEventListener("click", function (e) {
      e.preventDefault();
      editModal.classList.add("hidden");
      editModal.classList.remove("fixed");
    });

    save.addEventListener("keydown", function (e) {
      if (e.key === "Tab" && e.shiftKey) {
        e.preventDefault();
        cancel.focus();
      } else if (e.key === "Tab") {
        e.preventDefault();
        newNameEdit.focus();
      }
    });

    editWindow.addEventListener("submit", saveButton);

    function saveButton(event) {
      if (newNameEdit.value !== "" && !isNaN(newValueEdit.value)) {
        item.name = newNameEdit.value;
        item.value = parseFloat(newValueEdit.value);
        list[index] = item;
        editWindow.removeEventListener("submit", saveButton);
        updateTotalValues();
        refreshItemList();
        event.preventDefault();
        editModal.classList.add("hidden");
        editModal.classList.remove("fixed");
      }
    }
  }

  // Function for deleting an element
  function deleteItem(list, index) {
    list.splice(index, 1);
    // Delete the item from Local Storage
    localStorage.setItem("expenses", JSON.stringify(expenses));
    localStorage.setItem("income", JSON.stringify(income));
    updateTotalValues();
    // Rebuild the list after deleting
    refreshItemList();
  }
  // Function for rebuilding the list
  function refreshItemList() {
    // Clear the list
    expensesList.innerHTML = "";
    incomeList.innerHTML = "";

    // Add edit and delete button handlers for each element
    expenses.forEach((expense, index) => {
      const li = document.createElement("li");
      const textSpan = document.createElement("span");
      const valueSpan = document.createElement("span");
      const textDiv = document.createElement("div");
      textSpan.textContent = `${expense.name}`;
      valueSpan.textContent = `${expense.value} zł`;
      valueSpan.classList.add("text-center");
      const editDiv = document.createElement("div");
      editDiv.classList.add("flex", "flex-nowrap");
      textDiv.classList.add("flex", "justify-between", "w-full", "px-4");

      // Creating the edit button
      const editButton = document.createElement("button");
      // Creating the <svg> element
      const svgEdit = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "svg"
      );
      svgEdit.setAttribute("xmlns", "http://www.w3.org/2000/svg");
      svgEdit.setAttribute("fill", "none");
      svgEdit.setAttribute("viewBox", "0 0 24 24");
      svgEdit.setAttribute("stroke-width", "1.5");
      svgEdit.setAttribute("stroke", "currentColor");
      svgEdit.setAttribute("class", "md:w-6 md:h-6 w-7 h-7");
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
      svgEdit.appendChild(path);
      document.body.appendChild(svgEdit);
      editButton.appendChild(svgEdit);
      editButton.title = "Edytuj";
      editButton.classList.add("p-2");

      // Creating the delete button
      const deleteButton = document.createElement("button");
      // Creating the <svg> element
      const svgBin = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "svg"
      );
      svgBin.setAttribute("xmlns", "http://www.w3.org/2000/svg");
      svgBin.setAttribute("fill", "none");
      svgBin.setAttribute("viewBox", "0 0 24 24");
      svgBin.setAttribute("stroke-width", "1.5");
      svgBin.setAttribute("stroke", "currentColor");
      svgBin.setAttribute("class", "md:w-6 md:h-6 w-7 h-7");
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
      svgBin.appendChild(pathElement);
      deleteButton.appendChild(svgBin);
      deleteButton.title = "Usuń";
      deleteButton.classList.add("p-2");

      // Handler for the edit button
      editButton.addEventListener("click", () => editItem(expenses, index));

      // Handler for the delete button
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
      const editDiv = document.createElement("div");
      editDiv.classList.add("flex", "flex-nowrap");
      textDiv.classList.add("flex", "justify-between", "w-full", "px-4");
      // Creating the edit button
      const editButton = document.createElement("button");
      // Creating the <svg> element
      const svgEdit = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "svg"
      );
      svgEdit.setAttribute("xmlns", "http://www.w3.org/2000/svg");
      svgEdit.setAttribute("fill", "none");
      svgEdit.setAttribute("viewBox", "0 0 24 24");
      svgEdit.setAttribute("stroke-width", "1.5");
      svgEdit.setAttribute("stroke", "currentColor");
      svgEdit.setAttribute("class", "md:w-6 md:h-6 w-7 h-7");
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
      svgEdit.appendChild(path);
      document.body.appendChild(svgEdit);
      editButton.appendChild(svgEdit);
      editButton.title = "Edytuj";
      editButton.classList.add("p-2");
      // Creating the delete button
      const deleteButton = document.createElement("button");
      // Creating the <svg> element
      const svgBin = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "svg"
      );
      svgBin.setAttribute("xmlns", "http://www.w3.org/2000/svg");
      svgBin.setAttribute("fill", "none");
      svgBin.setAttribute("viewBox", "0 0 24 24");
      svgBin.setAttribute("stroke-width", "1.5");
      svgBin.setAttribute("stroke", "currentColor");
      svgBin.setAttribute("class", "md:w-6 md:h-6 w-7 h-7");
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
      svgBin.appendChild(pathElement);
      deleteButton.appendChild(svgBin);
      deleteButton.title = "Usuń";
      deleteButton.classList.add("p-2");

      // Handler for the edit button
      editButton.addEventListener("click", () => editItem(income, index));

      // Handler for the delete button
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

  // Restoring list items when the page loads
  refreshItemList();

  // Initializing the totals when the page loads
  updateTotalValues();
});
