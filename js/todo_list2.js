const posibl_status = ["/img/pending1.png", "/img/wipi1.png", "/img/done1.png"];
const status_alt = ["Pending", "In Progess", "Completed"];

let list_item_count = document.querySelectorAll(".column .item").length / 3,
	curr_status = 0;

console.debug("list_item_count = ", list_item_count);

function getInput() {
	const add_task = document.querySelector(".taskname .plus");
	const add_due_date = document.querySelector(".duedate .plus");

	add_task.innerHTML = `<input type="text" />`;
	add_due_date.innerHTML = `<input onblur=addItemToList() type="text" />`;

	add_task.removeAttribute("onclick");
	add_task.querySelector("input").focus();
}

function addItemToList() {
	const item_status = document.querySelector(".status .plus");
	const add_task = document.querySelector(".taskname .plus");
	const add_due_date = document.querySelector(".duedate .plus");
	const inputs = document.querySelectorAll("input");
	const value = inputs[0].value.trim();

	if (!value) {
		add_task.setAttribute("onclick", "getInput()");
		add_task.innerHTML = "➕";
		add_due_date.innerHTML = "";
		return;
	}

	// update list item
	list_item_count++;
	add_task.innerText = `${inputs[0].value}`;
	add_due_date.innerText = `${inputs[1].value}`;

	item_status.setAttribute("onclick", "updateStatusOfItem()");
	item_status.innerHTML = `
        <img src="${posibl_status[0]}" 
             alt="${status_alt[0]}"
             title="${status_alt[0]}" />`;

	// add new 'plus' item
	const cols = document.querySelectorAll(".plus");
	cols[0].className = `stat_img item n${list_item_count}`;
	cols[1].className = `item n${list_item_count}`;
	cols[2].className = `item n${list_item_count}`;

	document.querySelectorAll(".column").forEach((column, cnt = 0) => {
		if (++cnt == 2) {
			column.innerHTML += '<li class="plus" onclick="getInput()">➕</li>';
		} else {
			column.innerHTML += '<li class="plus"></li>';
		}
	});

	localStorage.setItem(
		list_item_count,
		JSON.stringify([
			posibl_status[++curr_status % 3],
			inputs[0].value,
			inputs[1].value,
		])
	);
}

function deleteItemInList(item_no) {
	document.querySelector(`.item.n${item_no}`).innerHTML = "";
	localStorage.removeItem(item_no);
}

function editItemInList(item_no) {
	const item = document.querySelector(`.item_${item_no}`);
	const task_name = document.querySelector(
		`.item_${item_no} .task_name`
	).textContent;
	const due_date = document.querySelector(
		`.item_${item_no} .due_date`
	).textContent;

	item.innerHTML = `
        <span class="status"></span>
        <span class="task_name">
            <input id="task_name"
                type="text"
                value="${task_name}">
        </span>
        <span class="due_date">
            <input id="due_date"
                type="text"
                value="${due_date}" 
                onblur="updateItemInList(${item_no}, '${task_name}')">
        </span>
    `;

	document.querySelector("input#task_name").focus();
}

function updateItemInList(item_no, task_name) {
	const item = document.querySelector(`.item_${item_no}`);
	const inputs = document.querySelectorAll("input");

	inputs[0].value = inputs[0].value.trim() ? inputs[0].value : task_name;

	item.innerHTML = `
        <span class="edit">
            <button id="delete">
                <img src="/img/delete.png"
                    onclick="deleteItemInList(${item_no})">
            </button>
            <button id="edit">
                <img src="/img/pencil.png"
                    onclick="editItemInList(${item_no})">
            </button>
        </span>
        <span class="status"
            onclick="changeStatusOfItem(${item_no})">
        </span>
        <span class="task_name">${inputs[0].value}</span>
        <span class="due_date">${inputs[1].value}</span>
    `;

	localStorage.setItem(
		item_no,
		JSON.stringify([
			posibl_status[curr_status % 3],
			inputs[0].value,
			inputs[1].value,
		])
	);
}

function updateStatusOfItem() {
    const ul = document.querySelector(".status")
	const item_status = document.querySelector(
		`.stat_img.item.n${list_item_count}`
	);
	const add_task = document.querySelector(
		`.taskname .item.n${list_item_count}`
	);

	curr_status = ++curr_status % 3;
	item_status.innerHTML = `
        <img src="${posibl_status[curr_status]}" 
             alt="${status_alt[curr_status]}"
             title="${status_alt[curr_status]}" />`;

	if (curr_status % 3 === 2) {
		add_task.style.textDecoration = "line-through";
	} else {
		add_task.style.textDecoration = "none";
	}

	// console.log(localStorage);
	// let string_arr = localStorage.item_no;
	// let arr = JSON.parse(string_arr);

	// arr[0] = posibl_status[curr_status % 3];
	// localStorage.setItem(item_no, JSON.stringify([arr]));
}

function loadItems() {
	list_item_count++;
	todolist.innerHTML += `
        <span class="edit">
            <button id="delete">
                <img src="/img/delete.png"
                    onclick="deleteItemInList(${item_no})">
            </button>
            <button id="edit">
                <img src="/img/pencil.png"
                    onclick="editItemInList(${item_no})">
            </button>
        </span>
        <span class="status"
            onclick="changeStatusOfItem(${item_no})">
        </span>
        <span class="task_name">${inputs[0].value}</span>
        <span class="due_date">${inputs[1].value}</span>
    `;
}

document.addEventListener("DOMContentLoaded", () => {
	console.log("LOADED");

	for (const item in localStorage) {
		if (Object.hasOwnProperty.call(localStorage, item)) {
			console.log(localStorage[item]);
		}
	}
});
