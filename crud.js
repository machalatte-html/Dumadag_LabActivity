
const API_URL = "https://6abc6a175121d616d90b8da2.mockapi.io/student";


const studentsPage = document.getElementById("studentsPage");
const formPage = document.getElementById("formPage");

const studentTable = document.getElementById("studentTable");
const loading = document.getElementById("loading");
const status = document.getElementById("status");

const studentForm = document.getElementById("studentForm");

const studentId = document.getElementById("studentId");
const studentNumber = document.getElementById("studentNumber")
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const courseInput = document.getElementById("course");

const formTitle = document.getElementById("formTitle");

const navButtons = document.getElementById("navButtons");
const addButtonContainer = document.getElementById("addButtonContainer");
const formButtons = document.getElementById("formButtons");


function createNavigation() {

    navButtons.innerHTML = "";

    const container = document.createElement("div");

    container.classList.add("nav-buttons");


    // Students Button
    const studentsButton = document.createElement("button");

    studentsButton.textContent = "Students";

    studentsButton.classList.add("nav-btn","active");

    studentsButton.id = "studentsNav";


    studentsButton.addEventListener("click", function () {

        showPage("students");

    });


    // Add Student Button
    const addButton = document.createElement("button");

    addButton.textContent = "Add Student";

    addButton.classList.add("nav-btn");

    addButton.id = "addNav";


    addButton.addEventListener("click", function () {

        prepareAddForm();

        showPage("form");

    });


    container.appendChild(studentsButton);
    container.appendChild(addButton);

    navButtons.appendChild(container);
}

function createAddButton() {

    addButtonContainer.innerHTML = "";
    const button = document.createElement("button");
    button.textContent = "+ Add Student";
    button.classList.add("primary-btn");
    button.addEventListener("click", function () {
        prepareAddForm();
        showPage("form");
    });
    addButtonContainer.appendChild(button);
}

function createFormButtons() {
    formButtons.innerHTML = "";

    // Submit Button
    const submitButton = document.createElement("button");
    submitButton.type = "submit";
    submitButton.id = "submitBtn";
    submitButton.textContent = "Add Student";
    submitButton.classList.add("primary-btn");

    // Cancel Button
    const cancelButton = document.createElement("button");
    cancelButton.type = "button";
    cancelButton.textContent = "Cancel";
    cancelButton.classList.add("secondary-btn");
    cancelButton.addEventListener("click", function () {
        resetForm();
        showPage("students");

    });

    formButtons.appendChild(submitButton);
    formButtons.appendChild(cancelButton);
}

function showPage(page) {

    if (page === "students") {
        studentsPage.classList.remove("hidden");
        formPage.classList.add("hidden");
        updateNavigation("students");
        getStudents();
    }

    if (page === "form") {
        studentsPage.classList.add("hidden");
        formPage.classList.remove("hidden");
        updateNavigation("form");
    }
}



function updateNavigation(page) {

    const studentsNav = document.getElementById("studentsNav");
    const addNav = document.getElementById("addNav");
    studentsNav.classList.remove("active");
    addNav.classList.remove("active");


    if (page === "students") {
        studentsNav.classList.add("active");
    }


    if (page === "form") {
        addNav.classList.add("active");
    }
}


function showStatus(message, type) {

    status.textContent = message;

    status.className = type;

    status.style.display = "block";


    setTimeout(function () {

        status.style.display = "none";

        status.className = "";

    }, 3000);
}

async function getStudents() {

    loading.style.display = "block";


    try {

        const response = await fetch(API_URL);


        if (!response.ok) {

            throw new Error(
                "Unable to load student records."
            );

        }


        const students = await response.json();
        displayStudents(students);


    } catch (error) {
        studentTable.innerHTML = "";
        showStatus(error.message,"error");
    } finally {
        loading.style.display = "none";
    }
}


function displayStudents(students) {

    studentTable.innerHTML = "";


    if (students.length === 0) {

        const row = document.createElement("tr");
        const cell = document.createElement("td");
        cell.textContent = "No student records found.";
        cell.colSpan = 5;
        cell.style.textAlign = "center";
        row.appendChild(cell);
        studentTable.appendChild(row);
        return;
    }


    students.forEach(function (student) {

        // Create Row
        const row = document.createElement("tr");


        // ID
        const idCell = document.createElement("td");

        idCell.textContent = student.id;


        // Name
        const nameCell = document.createElement("td");

        nameCell.textContent = student.name;


        // Email
        const emailCell = document.createElement("td");

        emailCell.textContent = student.email;


        // Course
        const courseCell = document.createElement("td");

        courseCell.textContent = student.course;


        // Actions
        const actionCell = document.createElement("td");


        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.classList.add("edit-btn");


        editButton.addEventListener("click", function () {
                editStudent(student);
            }
        );


        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.classList.add("delete-btn");
        deleteButton.addEventListener("click", function () {
                deleteStudent(student.id);
            }
        );

        actionCell.appendChild(editButton);

        actionCell.appendChild(deleteButton);

        row.appendChild(idCell);

        row.appendChild(nameCell);

        row.appendChild(emailCell);

        row.appendChild(courseCell);

        row.appendChild(actionCell);

        studentTable.appendChild(row);

    });
}

function prepareAddForm() {
    studentForm.reset();
    studentId.value = "";
    formTitle.textContent = "Add Student";
    const submitButton = document.getElementById("submitBtn");
    submitButton.textContent = "Add Student";
    submitButton.disabled = false;
}


function editStudent(student) {

    studentId.value = student.id;
    nameInput.value = student.name;
    emailInput.value = student.email;
    courseInput.value = student.course;
    formTitle.textContent = "Edit Student";
    const submitButton = document.getElementById("submitBtn");
    submitButton.textContent = "Update Student";
    submitButton.disabled = false;

    showPage("form");
}

studentForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const id = studentId.value;


        const studentData = {
            name: nameInput.value.trim(),
            email: emailInput.value.trim(),
            course: courseInput.value.trim()

        };


        // Basic validation
        if (studentData.name === "" || studentData.email === "" || studentData.course === "") {
            showStatus("Please complete all fields.", "error");
            return;
        }


        const submitButton = document.getElementById("submitBtn");
        submitButton.disabled = true;

        try {

            let response;

            if (id) {

                submitButton.textContent = "Updating...";

                response = await fetch(
                    `${API_URL}/${id}`,
                    {

                        method: "PUT",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(
                                studentData
                            )

                    }
                );


                if (!response.ok) {

                    throw new Error(
                        "Unable to update student."
                    );

                }


                await response.json();


                showStatus(
                    "Student updated successfully!",
                    "success"
                );

            }

            else {

                submitButton.textContent = "Adding...";
                response = await fetch(
                    API_URL,
                    {

                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(
                                studentData
                            )
                    }
                );


                if (!response.ok) {

                    throw new Error(
                        "Unable to add student."
                    );

                }


                await response.json();


                showStatus(
                    "Student added successfully!",
                    "success"
                );

            }

            resetForm();

            showPage("students");


        } catch (error) {

            showStatus(
                error.message,
                "error"
            );

        } finally {
            submitButton.disabled = false;
            submitButton.textContent =
                "Add Student";
        }
    }
);


async function deleteStudent(id) {


    const confirmation = confirm(
        "Are you sure you want to delete this student?"
    );
    if (!confirmation) {
        return;
    }
    try {
        const response = await fetch(
            `${API_URL}/${id}`,
            {
                method: "DELETE"
            }
        );

        if (!response.ok) {

            throw new Error(
                "Unable to delete student."
            );
        }

        await response.json();

        showStatus(
            "Student deleted successfully!",
            "success"
        );


        // Get updated records from API
        await getStudents();


    } catch (error) {

        showStatus(
            error.message,
            "error"
        );

    }
}


function resetForm() {
    studentForm.reset();
    studentId.value = "";
    formTitle.textContent = "Add Student";
    const submitButton = document.getElementById("submitBtn");
    submitButton.textContent = "Add Student";
    submitButton.disabled = false;
}



createNavigation();
createAddButton();
createFormButtons();
getStudents();

