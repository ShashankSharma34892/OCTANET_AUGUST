const todolist = document.querySelector("#todolist"),
	add_item = document.querySelector("#get_input");

let item_count = document.querySelectorAll("#todolist li").length - 1,
	status_count = 0;

console.debug("item_count = ", item_count);

const statuses = [
	"/img/workinprogress.png",
	"/img/done1.png",
	"/img/pending1.png",
];

function getInput() {
	add_item.innerHTML = `
        <span class="status"></span>
        <span class="task_name">
            <input id="task_name" type="text" >
        </span>
        <span class="due_date">
            <input id="due_date" type="text" onblur="addItemToList()">
        </span>
    `;
	add_item.id = "got";

	document.querySelector("input#task_name").focus();
}

function addItemToList() {
	const inputs = document.querySelectorAll("span input");
	const value = inputs[0].value.trim();

	if (value) {
		item_count++;
		todolist.innerHTML += `
            <li class="item_${item_count}">
                <span class="edit">
                    <button id="delete">
                        <img src="/img/delete.png"
                            onclick="deleteItemInList(${item_count})">
                    </button>
                    <button id="edit">
                        <img src="/img/pencil.png"
                            onclick="editItemToList(${item_count})">
                    </button>
                </span>
                <span class="status"
                    onclick="changeStatusOfItem(${item_count})">
                </span>
                <span class="task_name">${inputs[0].value}</span>
                <span class="due_date">${inputs[1].value}</span>
            </li>
            `;
	}

	add_item.innerHTML = "<span>➕</span>";
	add_item.id = "get_input";

	localStorage.setItem(
		item_count,
		JSON.stringify([
			statuses[status_count % 3],
			inputs[0].value,
			inputs[1].value,
		])
	);
}

function editItemToList(item_no) {
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
                    onclick="editItemToList(${item_no})">
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
			statuses[status_count % 3],
			inputs[0].value,
			inputs[1].value,
		])
	);
}

function deleteItemInList(item_no) {
	document.querySelector(`.item_${item_no}`).remove();
	localStorage.removeItem(item_no);
}

function changeStatusOfItem(item_no) {
	const status = document.querySelector(`.item_${item_no} .status`);
	const task = document.querySelector(`.item_${item_no} .task_name`);

	status.style.backgroundImage = `url(${statuses[status_count++ % 3]})`;

	if (status_count % 3 === 2) task.style.textDecoration = "line-through";
	else task.style.textDecoration = "none";

	let string_arr = localStorage.item_no;
	let arr = JSON.parse(string_arr);

	arr[0] = statuses[status_count % 3];
	localStorage.setItem(item_no, JSON.stringify([arr]));
}

function loadListItems() {
    item_count++;
    todolist.innerHTML += `
        <span class="edit">
            <button id="delete">
                <img src="/img/delete.png"
                    onclick="deleteItemInList(${item_no})">
            </button>
            <button id="edit">
                <img src="/img/pencil.png"
                    onclick="editItemToList(${item_no})">
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
