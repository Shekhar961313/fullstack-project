if (localStorage.getItem("cloudSession") !== "active") {
    window.location.href = "index.html";
}

const user = JSON.parse(localStorage.getItem("cloudUser"));
const greeting = document.getElementById("greeting");

const hour = new Date().getHours();
let text = "Welcome";

if (hour < 12) text = "Good Morning";
else if (hour < 18) text = "Good Afternoon";
else text = "Good Evening";

greeting.innerText = `${text}, ${user.name}`;

let files = JSON.parse(localStorage.getItem("cloudFiles")) || [];
const fileList = document.getElementById("fileList");
const fileInput = document.getElementById("fileInput");

function saveFiles() {
    localStorage.setItem("cloudFiles", JSON.stringify(files));
}

function renderFiles() {
    fileList.innerHTML = "";

    files.forEach((file, index) => {
        const card = document.createElement("div");
        card.classList.add("file-card");

        card.innerHTML = `
            <div class="file-name">${getIcon(file.name)} ${file.name}</div>
            <div class="file-size">${(file.size/1024/1024).toFixed(2)} MB</div>
            <button class="delete-btn" onclick="deleteFile(${index})">Delete</button>
        `;

        fileList.appendChild(card);
    });

    updateStorage();
}

function getIcon(name) {
    const ext = name.split(".").pop().toLowerCase();
    if (["png","jpg","jpeg"].includes(ext)) return "🖼";
    if (["pdf"].includes(ext)) return "📄";
    if (["doc","docx"].includes(ext)) return "📘";
    return "📁";
}

function deleteFile(index) {
    files.splice(index,1);
    saveFiles();
    renderFiles();
}

function updateStorage() {
    const total = files.reduce((sum,f)=>sum+f.size,0);
    const mb = (total/1024/1024).toFixed(2);
    document.getElementById("usedStorage").innerText = mb + " MB";

    const percent = (mb/500)*100;
    document.getElementById("progressFill").style.width = percent+"%";
}

fileInput.addEventListener("change", e => {
    Array.from(e.target.files).forEach(file=>{
        files.push({name:file.name,size:file.size});
    });
    saveFiles();
    renderFiles();
});

function logout() {
    localStorage.removeItem("cloudSession");
    window.location.href = "index.html";
}

renderFiles();
