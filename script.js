let myBookList = JSON.parse(localStorage.getItem("myBookList")) || [];
let myFolders = JSON.parse(localStorage.getItem("myFolders")) || ["General", "Work", "Personal", "Study"];
let currentFolder = "All";


const addCurrentBtn = document.getElementById("addCurrent");
const addManualBtn = document.getElementById("addManual");
const formBox = document.getElementById("addBox");
const saveBtn = document.getElementById("saveBtn");
const titleInput = document.getElementById("title");
const urlInput = document.getElementById("url");
const folderSelect = document.getElementById("folder");
const listBox = document.getElementById("bookList");
const searchInput = document.getElementById("search");


const folderList = document.getElementById("folderList");
const newFolderName = document.getElementById("newFolderName");
const createFolderBtn = document.getElementById("createFolderBtn");
const folderArrow = document.getElementById("folderArrow");
const folderSection = document.getElementById("folderSection");


function initFolders() {
  if (!folderList) return;
  folderList.innerHTML = "";
  const all = document.createElement("li");
  all.textContent = "All";
  all.classList.add("active");
  all.addEventListener("click", () => setFolder("All"));
  folderList.appendChild(all);

  myFolders.forEach(f => {
    const li = document.createElement("li");
    li.textContent = f;
    li.addEventListener("click", () => setFolder(f));
    folderList.appendChild(li);
  });

  folderSelect.innerHTML = myFolders.map(f => `<option value="${f}">${f}</option>`).join("");
}

function setFolder(folderName) {
  currentFolder = folderName;
  document.querySelectorAll("#folderList li").forEach(li => li.classList.remove("active"));
  document.querySelectorAll("#folderList li").forEach(li => {
    if (li.textContent === folderName) li.classList.add("active");
  });
  displayBookmarks(searchInput.value, currentFolder);
}


if (createFolderBtn) {
  createFolderBtn.addEventListener("click", () => {
    const name = newFolderName.value.trim();
    if (!name) return alert("Enter folder name");
    if (myFolders.includes(name)) return alert("Folder already exists!");
    myFolders.push(name);
    localStorage.setItem("myFolders", JSON.stringify(myFolders));
    newFolderName.value = "";
    initFolders();
  });
}


if (folderArrow) {
  folderArrow.addEventListener("click", () => {
    const list = folderList;
    list.style.display = list.style.display === "block" ? "none" : "block";
    folderArrow.classList.toggle("open");
  });
}


if (addCurrentBtn) {
  addCurrentBtn.addEventListener("click", () => {
    formBox.classList.remove("hidden");
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      titleInput.value = tab.title || "";
      urlInput.value = tab.url || "";
    });
  });
}


if (addManualBtn) {
  addManualBtn.addEventListener("click", () => {
    titleInput.value = "";
    urlInput.value = "";
    formBox.classList.remove("hidden");
  });
}


if (saveBtn) {
  saveBtn.addEventListener("click", () => {
    const t = titleInput.value.trim();
    const u = urlInput.value.trim();
    if (!t || !u) {
      alert("Please fill out title and URL");
      return;
    }

    const item = {
      title: t,
      url: u,
      folder: folderSelect.value,
    };

    myBookList.push(item);
    localStorage.setItem("myBookList", JSON.stringify(myBookList));
    formBox.classList.add("hidden");
    displayBookmarks(searchInput.value, currentFolder);
  });
}


function displayBookmarks(filterTxt = "", folderFilter = "All") {
  let filtered = myBookList.filter(b =>
    (b.title.toLowerCase().includes(filterTxt.toLowerCase()) ||
      b.folder.toLowerCase().includes(filterTxt.toLowerCase())) &&
    (folderFilter === "All" ? true : b.folder === folderFilter)
  );

  if (!filtered.length) {
    listBox.innerHTML = "<p style='color:#555;font-size:13px;'>No bookmarks yet.</p>";
    return;
  }

  listBox.innerHTML = "";
  filtered.forEach((b, index) => {
    const div = document.createElement("div");
    div.className = "bookmark";
    div.innerHTML = `
      <div>
        <a href="${b.url}" target="_blank">${b.title}</a><br>
        <small>${b.folder}</small>
      </div>
      <div>
        <select class="moveSel" data-id="${index}">
          <option disabled selected>Move</option>
          ${myFolders.map(f => `<option value="${f}">${f}</option>`).join("")}
        </select>
        <button data-id="${index}" class="removeBtn">🗑️</button>
      </div>
    `;
    listBox.appendChild(div);
  });

  
  document.querySelectorAll(".removeBtn").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      myBookList.splice(id, 1);
      localStorage.setItem("myBookList", JSON.stringify(myBookList));
      displayBookmarks(searchInput.value, currentFolder);
    });
  });

  
  document.querySelectorAll(".moveSel").forEach(sel => {
    sel.addEventListener("change", () => {
      const id = sel.getAttribute("data-id");
      const newFolder = sel.value;
      myBookList[id].folder = newFolder;
      localStorage.setItem("myBookList", JSON.stringify(myBookList));
      displayBookmarks(searchInput.value, currentFolder);
    });
  });
}


if (searchInput) {
  searchInput.addEventListener("input", () => {
    displayBookmarks(searchInput.value, currentFolder);
  });
}

initFolders();
displayBookmarks();