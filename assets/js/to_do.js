globalThis.totalTodo = 0;
globalThis.totalSubTask = 0;
let todo_dict = {};

function update_GlobalID() {
    todo_dict["GlobalID"] = totalTodo;
}

function add_update_New_Todo(id, task_array) {
    let json_of_array = JSON.stringify(task_array);
    todo_dict[id] = json_of_array;
}

function showLocal() {
    console.log(todo_dict);
}

function clear_all() {
    todo_dict = {};
    localStorage.clear();
    save_cloud();
    location.reload();
}

function addTask() {
    var input = document.getElementById("input");
    if (!input.value) {
        return alert("task cannot be blank");
    } else {
        totalTodo++;

        addTodo(input.value, totalTodo);

        input.value = "";
    }
}

function removeTodo(id) {
    todo = document.getElementById("_" + id);
    todo.remove();
    delete todo_dict[id];
}

function addTodo(task, id) {
    //adding to local storage
    update_GlobalID();
    add_update_New_Todo(id, [task]);

    //yes
    main_conatiner = document.getElementById("conatiner-for-todo");
    todo_container = document.createElement("div");
    todo_container.setAttribute("id", "_" + id);
    todo_container.setAttribute("style", `width:100%`);
    todo_container.innerHTML = `<div style="display: flex; flex-direction: column" class="
    main-todo-box
    mt-4
    border
    py-8
    px-8
    mx-auto
    bg-white
    rounded-lg
    shadow-md
    space-y-2
    sm:py-4
    sm:flex
    sm:items-center
    sm:space-y-0 sm:space-x-6
  "><div style="
   justify-content: space-between;
   vertical-align: middle;
   display: flex;
   flex-direction: row;
   width:100%;
 " class="main-todo-name text-lg text-black font-semibold">
     <p>${task}</p>
     <div style="display: flex; flex-direction: row">
         <button id="two" style="
       float: right;
       vertical-align: middle;
       height: 24px;
       margin-bottom: 4px;
     " class="
       ml-6
       rounded-lg
       shadow-md
       text-white
       bg-gray-500
       hover:bg-gray-700
     ">
     <span  class="material-icons-outlined" onclick="removeTodo(${id})"> close </span></button
   >
     </div>
     
 </div><div class="add-task self-center sm:items-center">
 <input id="add_sub_input_${id}"
   class="px-4  m-4 shadow-md rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
   placeholder="Add Sub-Task"
 />
 <button
  id="three"
   onclick="addSubTask1(${id})"
   style=' vertical-align: baseline; height:24px '
   class="ml-2 rounded-lg shadow-md text-white bg-green-500 hover:bg-green-700"
 >
   <span
     style=' vertical-align: middle '
     class="material-icons-outlined"
   >
     done
   </span>
 </button>
</div></div>`;
    main_conatiner.appendChild(todo_container);
}

function addSubTask1(id) {
    var input = document.getElementById(`add_sub_input_${id}`);
    if (!input.value) {
        return alert("task cannot be blank");
    } else {
        totalSubTask++;
        todo_dict["Global_Sub_task"] = totalSubTask;
        addSubTask2(id, input.value, totalSubTask);
        input.value = "";
    }
}

function addSubTask2(id, text, subtask_Number) {
    todo = document.getElementById("_" + id);
    todo_box = todo.children[0];

    //adding to local storage
    task_array = JSON.parse(todo_dict[id]);
    task_array.push(text);
    add_update_New_Todo(id, task_array);

    //yes
    subTask = document.createElement("div");
    subTask.setAttribute("id", "sub" + subtask_Number);
    subTask.setAttribute("style", `width:100%; margin-left:0px`);
    subTask.innerHTML = `<div class="sub-tasks" style="
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
    margin-bottom:2px;
  ">
        <p>${text}</p>
        <div style="display: flex; flex-direction: row">
            <button
            id="four" style="
        float: right;
        vertical-align: middle;
        height: 24px;
        margin-bottom: 4px;"
        onclick="removeSubTask(${id},${subtask_Number},'${text}')"
        class="
        ml-6
        rounded-lg
        shadow-md
        text-white
        bg-gray-500
        hover:bg-gray-700
      ">
      <span class="material-icons-outlined"> close </span></button
    >
        </div>`;
    todo_box.appendChild(subTask);
}

function removeSubTask(main_id, sub_id, sub_text) {
    todo = document.getElementById("sub" + sub_id);
    todo.remove();
    //with todo_dict
    array_with_todo = JSON.parse(todo_dict[main_id]);
    array_with_todo = array_with_todo.filter((item) => item !== sub_text);
    let json_of_array = JSON.stringify(array_with_todo);
    todo_dict[main_id] = json_of_array;
}
//upadte loacl storage
const update_local = () => {
    keys_dict = Object.keys(todo_dict);
    localStorage.clear();
    keys_dict.forEach((element) => {
        console.log("each elemnt", element);
        localStorage.setItem(element, todo_dict[element]);
    });
    console.log("loacl storage after saving", localStorage);
};
//save todo to cloud

const save_cloud = async() => {
    token = window.location.href.slice(window.location.origin.length + 7);
    if (token) {
        todo_data = JSON.stringify(todo_dict);
        console.log("inside save cloud todo_data :" + todo_data);
        console.log("token :" + token);

        const response = await fetch(
            `http://localhost:3000/api/post-todo/${token}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: todo_data,
            }
        );
        console.log("data given to clud");
    }
};

//load todo from cloud

function load_cloud() {
    token = window.location.href.slice(window.location.origin.length + 7);
    if (token) {
        console.log("token :" + token);

        fetch(`http://localhost:3000/api/get-todo/${token}`)
            .then((response) => response.json())
            .then((json) => {
                const todo_data = json.to_do;
                if (todo_data) {
                    totalTodo =
                        todo_data.GlobalID !== null && todo_data.GlobalID !== undefined ?
                        todo_data.GlobalID :
                        0;
                    totalSubTask =
                        todo_data.Global_Sub_task !== null &&
                        todo_data.Global_Sub_task !== undefined ?
                        todo_data.Global_Sub_task :
                        0;

                    console.log("insdie load cloud todo_data :", todo_data);
                    let subTask_no = 0;
                    for (let i = 1; i <= totalTodo; i++) {
                        if (todo_data[i]) {
                            console.log("JSON.parse(todo_data[i])", JSON.parse(todo_data[i]));
                            array_with_todo = JSON.parse(todo_data[i]);
                            addTodo(array_with_todo[0], i);
                            for (let j = 1; j < array_with_todo.length; j++) {
                                subTask_no++;
                                addSubTask2(i, array_with_todo[j], subTask_no);
                            }
                        }
                    }
                    console.log("todo_dict after loading:", todo_dict);
                }
            });
    }
}

//main area

if (window.location.href.slice(window.location.origin.length + 7)) {
    //when logged in
    load_cloud();
} else {
    //when not logged in
    if (localStorage.length > 0) {
        totalTodo = localStorage.GlobalID;
        totalSubTask =
            localStorage.Global_Sub_task !== null &&
            localStorage.Global_Sub_task !== undefined ?
            localStorage.Global_Sub_task :
            0;
        let subTask_no = 0;
        for (let i = 0; i < localStorage.length; i++) {
            let key = localStorage.key(i);
            if (key == "GlobalID" || key == "Global_Sub_task") continue;
            array_with_todo = JSON.parse(localStorage.getItem(key));
            addTodo(array_with_todo[0], key);
            for (let j = 1; j < array_with_todo.length; j++) {
                subTask_no++;
                addSubTask2(key, array_with_todo[j], subTask_no);
            }
        }
    }
}

document
    .getElementById("save")
    .addEventListener(
        "click",
        window.location.href.slice(window.location.origin.length + 7) ?
        save_cloud :
        update_local
    );

console.log("inside front end");