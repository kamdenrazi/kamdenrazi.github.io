console.log("App Loaded")

// ------------------------------------------- users --------------------------------------------------
var startLoginButton = document.querySelector("#startLogin")
var startSignUpButton = document.querySelector("#startSignUp")

var mainStartButtons = document.querySelector("#startButtons")
var mainAllTasks = document.querySelector("#mainAllTasks")
var mainLogin = document.querySelector("#mainLogin")
var mainSignUP = document.querySelector("#mainSignUp")

mainAllTasks.style.display = "none";
mainLogin.style.display = "none";
mainSignUP.style.display = "none";

var loginButton = document.querySelector("#loginLogin")
var loginEmailBox = document.querySelector("#loginEmail")
var loginPasswordBox = document.querySelector("#loginPassword")


var signUpButton = document.querySelector("#signUpButton")
var signUpEmailBox = document.querySelector("#signUpEmail")
var signUpFirstNameBox = document.querySelector("#signUpFirstName")
var signUpLastNameBox = document.querySelector("#signUpLastName")
var signUpPasswordBox = document.querySelector("#signUpPassword")

signUpButton.onclick = function(){
    signUpServerGO(signUpEmailBox.value, signUpFirstNameBox.value, signUpLastNameBox.value, signUpPasswordBox.value);
}

loginButton.onclick = function(){
    loginServerGO(loginEmailBox.value, loginPasswordBox.value);
}


// ------------------------------------------ Tasks ----------------------------------------------------
var addTaskBtn = document.querySelector("#saveTaskBtn");
var newTaskBtn = document.querySelector("#newTaskButton")

var newTaskItems = document.querySelector(".newTask");

var taskInputBox = document.querySelector("#task")
var dueDateInputBox = document.querySelector("#dueDate")
var priorityInputBox = document.querySelector("#priority")
var progressInputBox = document.querySelector("#progress")
var referenceInputBox = document.querySelector("#reference")

startSignUpButton.onclick = function(){
    mainSignUP.style.display = "block";
    mainStartButtons.style.display = "none";
}

startLoginButton.onclick = function(){
    mainLogin.style.display = "block";
    mainStartButtons.style.display = "none";
}

loadTasksFromServer()

function createTaskOnServer(task, dueDate, priority, progress, reference){
    var taskData = (
    "task=" + encodeURIComponent(task) 
    + "&dueDate=" + encodeURIComponent(dueDate) 
    + "&priority=" + encodeURIComponent(priority) 
    + "&progress=" + encodeURIComponent(progress) 
    + "&reference=" + encodeURIComponent(reference));
    //console.log(taskData)

    fetch("http://localhost:8080/tasks", { 
        method: "POST",
        body: taskData,
        credentials: 'include',
        headers: {"Content-Type": "application/x-www-form-urlencoded"}

     }).then(function(){
         console.log("successfully added")
         loadTasksFromServer();
         
        })
    newTaskItems.style.display = "none";
    console.log("NewItems should disapear")
    newTaskBtn.style.display = "block";
}

function updateTaskOnServer(taskID, task, dueDate, priority, progress, reference){
    var taskData = (
    "task=" + encodeURIComponent(task) 
    + "&dueDate=" + encodeURIComponent(dueDate) 
    + "&priority=" + encodeURIComponent(priority) 
    + "&progress=" + encodeURIComponent(progress) 
    + "&reference=" + encodeURIComponent(reference));
    //console.log(taskData)

    fetch("http://localhost:8080/tasks/" + taskID, {
        method: "PUT",
        body: taskData,
        credentials: 'include',
        headers: {"Content-Type": "application/x-www-form-urlencoded"}

    }).then(function(){
        loadTasksFromServer();
    })

}

function deleteTaskOnServer(taskID){
    fetch("http://localhost:8080/tasks/" + taskID,{
    method: "DELETE",
    credentials: 'include',
    }).then(function() {
        loadTasksFromServer();
    })
}

function loadTasksFromServer(){ // need to call

    fetch("http://localhost:8080/tasks",{
    credentials: 'include',
    
    }).then(function(response) {

        if( response.status == 401){
            // show login/register divs
            // hide resourse list/divs/ect
            return
        }

        response.json().then(function (dataFromServer){

            console.log("tasks from server ", dataFromServer);
            mainAllTasks.style.display = "block";
            mainStartButtons.style.display = "none";
            printOutEachTask(dataFromServer)

        }); 
    });
}

function printOutEachTask(dataFromServer){
    var taskList = document.querySelector("#taskList")
    taskList.innerHTML = "";
    var line = document.createElement("hr")
    taskList.appendChild(line)

    dataFromServer.forEach(function(task){
        var newTask = document.createElement("li");

        var completeDiv = document.createElement("div");

        var completeButton = document.createElement("button");
        completeButton.innerHTML = "";
        completeButton.className = "completeButton"

        completeDiv.appendChild(completeButton);
        
        completeButton.onclick = function () {
            var result = confirm("Are you sure you want to are done with this task?");
            if (result) {
                console.log("delete ", task.id);
                deleteTaskOnServer(task.id)
            };
        };

        var taskItem = document.createElement("div");
        taskItem.innerHTML = task.task;
        taskItem.classList.add("task");
        completeDiv.appendChild(taskItem);

        newTask.appendChild(completeDiv);

        var dueDateItem = document.createElement("div");
        dueDateItem.innerHTML = " Days/Due: " + task.dueDate;
        dueDateItem.classList.add("dueDate");
        //dueDateItem.classList.add("dueDate", "taskDetails");
        newTask.appendChild(dueDateItem);

        var priorityItem = document.createElement("div");
        priorityItem.innerHTML = " Priority: " + task.priority;
        priorityItem.classList.add("priority");
        //priorityItem.classList.add("priority", "taskDetails");
        newTask.appendChild(priorityItem);

        var progressItem = document.createElement("div");
        progressItem.innerHTML = " Progress: " + task.progress;
        progressItem.classList.add("progress")
        //progressItem.classList.add("progress", "taskDetails")
        newTask.appendChild(progressItem);
        
        var referenceItem = document.createElement("div");
        referenceItem.innerHTML = " Class/Activity: " + task.reference;
        referenceItem.classList.add("reference");
        //referenceItem.classList.add("reference", "taskDetails");
        newTask.appendChild(referenceItem);

        // var editDiv = document.createElement("div");
        var editButton = document.createElement("button");
        editButton.innerHTML = "Edit";
        editButton.className = "editButton";
        // editDiv.appendChild(editButton)

        //pass task.item
        
        editButton.onclick = function (){
            console.log("update ", task.id)
            editButton.innerHTML = "Save";

            taskItem.innerHTML = '<input id="taskNew" value="' + task.task + '">';
            dueDateItem.innerHTML = '<input id="dueDateNew" value="' + task.dueDate + '">';
            priorityItem.innerHTML = '<input id="priorityNew" value="' + task.priority + '">';
            progressItem.innerHTML = '<input id="progressNew" value="' + task.progress + '">';
            referenceItem.innerHTML = '<input id="referenceNew" value="' + task.reference + '">';

            editButton.onclick = function (){
                var taskVal = document.querySelector("#taskNew").value;
                var dueDate = document.querySelector("#dueDateNew").value;
                var priority = document.querySelector("#priorityNew").value;
                var progress = document.querySelector("#progressNew").value;
                var reference = document.querySelector("#referenceNew").value;
                updateTaskOnServer(task.id, taskVal, dueDate, priority, progress, reference);
            };
        };

        newTask.appendChild(editButton)

        
        //newTask.appendChild(line)

        taskList.appendChild(newTask);
        var line = document.createElement("hr")
        taskList.appendChild(line)
    })
}

addTaskBtn.onclick = function() {
    //add new to do to the list
    var task = taskInputBox.value;
    var dueDate = dueDateInputBox.value;
    var priority = priorityInputBox.value;
    var progress = progressInputBox.value;
    var reference = referenceInputBox.value; 
    
    createTaskOnServer(task, dueDate, priority, progress, reference);

    taskInputBox.value = "";
    dueDateInputBox.value = "";
    priorityInputBox.value = "";
    progressInputBox.value = "";
    referenceInputBox.value = "";

}

newTaskBtn.onclick = function(){
    newTaskItems.style.display = "block";
    newTaskBtn.style.display = "none";
}

function loginServerGO(userEmail, userPassword){
    if(userEmail == "" || userPassword == ""){
        alert("One or more fields are blank. Please fill in all fields before submitting")
        return
    }
    var userData = "email=" + encodeURIComponent(userEmail) + "&password=" + encodeURIComponent(userPassword);
    console.log(userData)

    fetch("http://localhost:8080/sessions", {
        method: "POST",
        body: userData,
        credentials: "include",
        headers: {"Content-Type": "application/x-www-form-urlencoded"}

    }).then(function(response){
        console.log(response.status)
        if(response.status == 201){
            console.log("Received 201")
            mainLogin.style.display = "none";
            loadTasksFromServer()
            mainAllTasks.style.display = "block";
        }
        else{
            alert("Login Failed. Try again.")
            return
        }
    })
}

function signUpServerGO(userEmail, userFirstName, userLastName, userPassword){
    if(userEmail == "" || userPassword == "" || userFirstName == "" || userLastName == ""){
        alert("signup:One or more fields are blank. Please fill in all fields before submitting")
        return
    }
    var userData = (
        "email=" + encodeURIComponent(userEmail) + 
        "&firstName=" + encodeURIComponent(userFirstName) + 
        "&lastName=" + encodeURIComponent(userLastName) + 
        "&password=" + encodeURIComponent(userPassword));

    console.log(userData)
    fetch("http://localhost:8080/users", {
        method: "POST",
        body: userData,
        credentials: "include",
        headers: {"Content-Type": "application/x-www-form-urlencoded"}
    }).then(function(response){
        if(response.status == 201){
            alert("Successfully Created User. Please log in.")
            console.log("successfully created user")
            mainSignUP.style.display = "none";
            mainLogin.style.display = "block";
        }
        else{
            alert("User already exists. Please log in.")
            console.log("nope. bad user")
        }
        
    })

}