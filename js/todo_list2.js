const img_srcs = ["/img/pending.png", "/img/wipi1.png", "/img/done2.png"];
const status_alt = ["Not Started", "In Progess", "Completed"];

let list_item_count = 0;

function getInput() {
	const taskname = document.querySelector(".taskname .plus");
	const duedate = document.querySelector(".duedate .plus");

	taskname.innerHTML = `<input type="text" />`;
	duedate.innerHTML = `<input onblur=addItemToList(${list_item_count}) type="text" />`;

	taskname.removeAttribute("onclick");
	taskname.querySelector("input").focus();
}

function addItemToList() {
	const buttons = document.querySelector(".buttons .plus");
	const status = document.querySelector(".status .plus");
	const taskname = document.querySelector(".taskname .plus");
	const duedate = document.querySelector(".duedate .plus");
	const inputs = document.querySelectorAll("input");
	const value = inputs[0].value.trim();

	if (!value) {
		taskname.setAttribute("onclick", "getInput()");
		taskname.innerHTML = "➕";
		duedate.innerHTML = "";
		return;
	}

	list_item_count++;

	// update 'plus' content
	buttons.innerHTML += `
        <button>
            <img src="../img/delete.png" />
        </button>
        <button>
            <img src="../img/pencil.png" />
        </button>
    `;
	taskname.innerText = `${inputs[0].value}`;
	status.setAttribute("onclick", `updateStatusOfItem(${list_item_count})`);
	status.innerHTML = `
        <img src="${img_srcs[0]}" 
             alt="${status_alt[0]}"
             title="${status_alt[0]}" />
    `;
	duedate.innerText = `${inputs[1].value}`;

	// update class
	const plus_item = document.querySelectorAll(".plus");
	plus_item[0].className = `item n${list_item_count} butt`;
	plus_item[1].className = `item n${list_item_count} stat_img`;
	plus_item[2].className = `item n${list_item_count}`;
	plus_item[3].className = `item n${list_item_count}`;

	// add new 'plus' item
	const columns = document.querySelectorAll(".column");
	columns[0].innerHTML += '<li class="plus"></li>';
	columns[1].innerHTML += '<li class="plus"></li>';
	columns[2].innerHTML += '<li class="plus" onclick="getInput()">➕</li>';
	columns[3].innerHTML += '<li class="plus"></li>';

	addEventListenersToItems();
    
	console.debug("before add: ", localStorage);
	localStorage.setItem(
		list_item_count,
		JSON.stringify([img_srcs[0], inputs[0].value, inputs[1].value])
	);
	console.debug("after add: ", localStorage);
}

function deleteItemInList(list_item_count) {
	document.querySelector(`.item.n${list_item_count}`).innerHTML = "";
	localStorage.removeItem(list_item_count);
}

function editItemInList(list_item_count) {
	const item = document.querySelector(`.item_${list_item_count}`);
	const taskname = document.querySelector(
		`.item_${list_item_count} .taskname`
	).textContent;
	const due_date = document.querySelector(
		`.item_${list_item_count} .due_date`
	).textContent;

	item.innerHTML = `
        <span class="status"></span>
        <span class="taskname">
            <input id="taskname"
                type="text"
                value="${taskname}">
        </span>
        <span class="due_date">
            <input id="due_date"
                type="text"
                value="${due_date}" 
                onblur="updateItemInList(${list_item_count}, '${taskname}')">
        </span>
    `;

	document.querySelector("input#taskname").focus();
}

function updateItemInList(list_item_count, taskname) {
	const item = document.querySelector(`.item_${list_item_count}`);
	const inputs = document.querySelectorAll("input");

	inputs[0].value = inputs[0].value.trim() ? inputs[0].value : taskname;

	item.innerHTML = `    `;

	localStorage.setItem(
		list_item_count,
		JSON.stringify([
			img_srcs[curr_status_no % 3],
			inputs[0].value,
			inputs[1].value,
		])
	);
}

function updateStatusOfItem(n) {
	const status = document.querySelector(`.status .item.n${n}`);
	const taskname = document.querySelector(`.taskname .item.n${n}`);
	let curr_status_no = img_srcs.indexOf(JSON.parse(localStorage[n])[0]);
	curr_status_no = ++curr_status_no % 3;

	status.innerHTML = `
        <img src="${img_srcs[curr_status_no]}" 
             alt="${status_alt[curr_status_no]}"
             title="${status_alt[curr_status_no]}" />`;

	if (curr_status_no % 3 === 2) {
		taskname.style.textDecoration = "line-through";
	} else {
		taskname.style.textDecoration = "none";
	}

	let toopus = JSON.parse(localStorage.getItem(`${n}`));
	toopus[0] = img_srcs[curr_status_no];
	localStorage.setItem(n, JSON.stringify(toopus));

	console.debug("curr status = ", localStorage.getItem(`${n}`));
}

function addButtons(n) {
	const goobus = document.querySelector(".buttons");

	for (let cnt = 0; cnt < n; cnt++) {
		const li = document.createElement("li");
		const del_button = document.createElement("button");
		const edit_button = document.createElement("button");
		const del_button_img = document.createElement("img");
		const edit_button_img = document.createElement("img");

		del_button_img.setAttribute("src", "../img/delete.png");
		edit_button_img.setAttribute("src", "../img/pencil.png");

		li.className = `item n${cnt + 1} butt`;
		goobus.appendChild(li);

		li.appendChild(del_button);
		li.appendChild(edit_button);
		del_button.appendChild(del_button_img);
		edit_button.appendChild(edit_button_img);
	}
}

function loadItemsIntoList() {
	const columns = document.querySelectorAll(`.column`);
	let key = 0;

	for (const _ in localStorage) {
		list_item_count++;
		key++;
		if (Object.hasOwnProperty.call(localStorage, _)) {
			const item_arr = JSON.parse(localStorage[key]);
			const stat_naem = status_alt[img_srcs.indexOf(item_arr[0])];
			console.debug(key, "item_arr: ", item_arr);

			const curr_stotus = img_srcs.indexOf(item_arr[0]);
			const txt_dec = curr_stotus == 2 ? "line-through" : "none";

			columns[0].innerHTML += `
                <li class="item n${list_item_count} butt">
                    <button>
                        <img src="../img/delete.png" />
                    </button>
                    <button>
                        <img src="../img/pencil.png" />
                    </button>
                </li>
            `;
			columns[1].innerHTML += `
                <li class="item n${list_item_count} stat_img"
                    onclick=updateStatusOfItem(${list_item_count})>
                    <img src="${item_arr[0]}" 
                        alt="${stat_naem}"
                        title="${stat_naem}" />
                </li>
            `;
			columns[2].innerHTML += `
                <li class="item n${list_item_count}"
                    style="text-decoration: ${txt_dec}">
                    ${item_arr[1]}
                </li>
            `;
			columns[3].innerHTML += `
                <li class="item n${list_item_count}">
                    ${item_arr[2]}
                </li>
            `;
		}
	}
}

function addEventListenersToItems() {
	const list_items = document.querySelectorAll(".item");

	list_items.forEach((li) => {
		// console.debug("  li:", li);
		li.addEventListener("mouseenter", (event) => {
			const buttos = document.querySelector(
				`.${event.target.classList[1]}.butt`
			);
			console.debug("  entert: ", buttos);
			buttos.classList.add("iAmWhatTheyCallLegallyBlind");
		});

		li.addEventListener("mouseleave", (event) => {
			const buttos = document.querySelector(
				`.${event.target.classList[1]}.butt`
			);
			console.debug("  leavd: ", buttos);
			buttos.classList.remove("iAmWhatTheyCallLegallyBlind");

			console.debug("***************");
		});
	});
}

document.addEventListener("DOMContentLoaded", () => {
	console.log("LOADED");
	if (localStorage.length) {
		loadItemsIntoList();
	}

	const columns = document.querySelectorAll(`.column`);
	columns[0].innerHTML += '<li class="plus"></li>';
	columns[1].innerHTML += '<li class="plus"></li>';
	columns[2].innerHTML += '<li class="plus" onclick="getInput()">➕</li>';
	columns[3].innerHTML += '<li class="plus"></li>';

	list_item_count = document.querySelectorAll(".column .item").length / 4;
	console.debug("list_item_count = ", list_item_count);
	console.log("DONE LOADED");

	addEventListenersToItems();
});
