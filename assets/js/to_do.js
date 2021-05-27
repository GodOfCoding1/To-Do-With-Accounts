globalThis.totalTodo = 0;
globalThis.totalSubTask = 0;

function update_GlobalID() {
    localStorage.GlobalID = totalTodo;
}

function add_update_New_Todo(id, task_array) {
    let json_of_array = JSON.stringify(task_array);
    localStorage.setItem(id, json_of_array);
}

function showLocal() {
    console.log(localStorage);
}

function clearLocal() {
    localStorage.clear();
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

function removeTodo(id) {
    todo = document.getElementById("_" + id);
    todo.remove();
    localStorage.removeItem(id);
}

function addSubTask1(id) {
    var input = document.getElementById(`add_sub_input_${id}`);
    if (!input.value) {
        return alert("task cannot be blank");
    } else {
        totalSubTask++;
        localStorage.Global_Sub_task = totalSubTask;
        addSubTask2(id, input.value, totalSubTask);
        input.value = "";
    }
}

function addSubTask2(id, text, subtask_Number) {
    todo = document.getElementById("_" + id);
    todo_box = todo.children[0];

    //adding to local storage
    task_array = JSON.parse(localStorage[id]);
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
    //with localStorage
    array_with_todo = JSON.parse(localStorage.getItem(main_id));
    array_with_todo = array_with_todo.filter((item) => item !== sub_text);
    let json_of_array = JSON.stringify(array_with_todo);
    localStorage.setItem(main_id, json_of_array);
}
//loading

if (localStorage.length > 0) {
    let zero = 0;
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
//for handing updation to backend

document
    .getElementById("save-cloud")
    .addEventListener("click", async function() {
        token = window.location.href.slice(window.location.origin.length + 7);
        if (token) {
            todo_data = JSON.stringify(localStorage);
            console.log("todo_data :" + todo_data);
            console.log("token :" + token);

            const response = await fetch(
                `http://localhost:3000/api/post-todo/${token}`, {
                    method: "PUT",
                    mode: "cors",
                    cache: "no-cache",
                    credentials: "same-origin",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    redirect: "follow",
                    referrerPolicy: "no-referrer",
                    body: JSON.stringify(localStorage),
                }
            );
            console.log(response);
        }
    });

// $("#save-cloud").click(function(event) {
//     token = window.location.href.slice(window.location.origin.length + 7);
//     if (token) {
//         todo_data = JSON.stringify(localStorage);
//         console.log("todo_data :" + todo_data);
//         console.log("token :" + token);

//         var request = {
//             url: `http://localhost:3000/api/post-todo/${token}`,
//             method: "PUT",
//             data: todo_data,
//             headers: { "Content-Type": "application/json" },
//         };

//         $.ajax(request).done(function(response) {
//             console.log(response);
//             console.log("done with frontend data transfer");
//         });
//     }
// });

//getting todo from cloud
$("#load-cloud").click(function(event) {
    token = window.location.href.slice(window.location.origin.length + 7);
    if (token) {
        console.log("inside load cloud");
        var request = {
            url: `http://localhost:3000/api/get-todo/${token}`,
            method: "GET",
        };

        $.ajax(request).done(function(data) {
            console.log(data);

            console.log("done with frontend data transfer");
        });
    }
});

console.log("inside front end");