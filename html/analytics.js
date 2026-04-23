let files = JSON.parse(localStorage.getItem("cloudFiles")) || [];

/* TYPE */
function getType(name) {
    let ext = name.split(".").pop().toLowerCase();
    if (["jpg","png","jpeg"].includes(ext)) return "Images";
    if (ext === "pdf") return "PDF";
    if (["doc","docx"].includes(ext)) return "Docs";
    return "Others";
}

/* STATS */
let stats = { Images:0, PDF:0, Docs:0, Others:0 };
let totalSize = 0;

files.forEach(file => {
    let type = getType(file.name);
    stats[type]++;

    totalSize += (file.size || 0) / (1024*1024);
});

/* TEXT */
document.getElementById("totalFiles").innerText = files.length;
document.getElementById("imageCount").innerText = stats.Images;
document.getElementById("pdfCount").innerText = stats.PDF;
document.getElementById("docCount").innerText = stats.Docs;

/* PIE */
new Chart(document.getElementById("fileChart"), {
    type: "pie",
    data: {
        labels: ["Images","PDF","Docs","Others"],
        datasets: [{
            data: [stats.Images, stats.PDF, stats.Docs, stats.Others]
        }]
    }
});

/* STORAGE */
let maxStorage = 1000;
let percent = (totalSize / maxStorage) * 100;

document.getElementById("storageText").innerText =
    totalSize.toFixed(2) + " MB used of " + maxStorage + " MB";

/* STORAGE CHART */
new Chart(document.getElementById("storageChart"), {
    type: "doughnut",
    data: {
        datasets: [{
            data: [percent, 100 - percent],
            backgroundColor: ["#3b82f6", "#e5e7eb"]
        }]
    },
    options: {
        cutout: "70%",
        plugins: { legend: { display:false } }
    }
});

/* RECENT */
let list = document.getElementById("recentFiles");

files.slice(-5).reverse().forEach(f => {
    let li = document.createElement("li");
    li.innerText = f.name;
    list.appendChild(li);
});