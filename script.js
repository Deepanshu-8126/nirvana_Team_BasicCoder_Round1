// --- Cross‑browser API ---
const browserAPI = typeof browser !== "undefined" ? browser : chrome;

// --- Local data ---
let myBookList = JSON.parse(localStorage.getItem("myBookList")) || [];
let myFolders = JSON.parse(localStorage.getItem("myFolders")) || ["General", "Work", "Personal", "Study"];
let currentFolder = "All";

// --- DOM Elements ---
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

// ----------------- INITIALISE FOLDERS -----------------
function initFolders() {
  if (!folderList) return;
  folderList.innerHTML = "";

  const all = document.createElement("li");
  all.textContent = "All";
  all.classList.add("active");
  all.onclick = () => setFolder("All");
  folderList.appendChild(all);

  myFolders.forEach(f => {
    const li = document.createElement("li");
    li.textContent = f;
    li.onclick = () => setFolder(f);
    folderList.appendChild(li);
  });

  folderSelect.innerHTML = myFolders.map(f => `<option value="${f}">${f}</option>`).join("");
}

function setFolder(name) {
  currentFolder = name;
  folderList.querySelectorAll("li").forEach(li => {
    li.classList.toggle("active", li.textContent === name);
  });
  displayBookmarks(searchInput.value, currentFolder);
}

// ----------------- CREATE NEW FOLDER -----------------
createFolderBtn?.addEventListener("click", () => {
  const name = newFolderName.value.trim();
  if (!name || myFolders.includes(name)) return;
  myFolders.push(name);
  localStorage.setItem("myFolders", JSON.stringify(myFolders));
  newFolderName.value = "";
  initFolders();
});

// ----------------- TOGGLE FOLDER LIST -----------------
folderArrow?.addEventListener("click", () => {
  folderList.style.display = folderList.style.display === "block" ? "none" : "block";
  folderArrow.classList.toggle("open");
});

// ----------------- ADD CURRENT TAB -----------------
addCurrentBtn?.addEventListener("click", () => {
  browserAPI.tabs.query({ active: true, currentWindow: true }).then(tabs => {
    const tab = tabs[0];
    if (!tab || !tab.url) return;
    return browserAPI.bookmarks.create({ title: tab.title, url: tab.url });
  }).then(() => {
    loadBrowserBookmarks();
  }).catch(err => console.error("Bookmark API error:", err));
});

// ----------------- LOAD SYSTEM BOOKMARKS -------------
function loadBrowserBookmarks() {
  if (!browserAPI.bookmarks || !browserAPI.bookmarks.getTree) return;
  browserAPI.bookmarks.getTree().then(tree => {
    const flat = [];
    (function walk(nodes) {
      for (const n of nodes) {
        if (n.url) flat.push(n);
        if (n.children) walk(n.children);
      }
    })(tree);
    renderSystemBookmarks(flat);
  });
}

function renderSystemBookmarks(items) {
  listBox.innerHTML = "";
  if (!items.length) {
    listBox.innerHTML = "<p>No browser bookmarks found.</p>";
    return;
  }

  items.forEach(b => {
    const div = document.createElement("div");
    div.className = "bookmark";
    div.innerHTML = `
      <div>
        <a href="${b.url}" target="_blank">${b.title}</a>
        <small>Browser Bookmark</small>
      </div>
      <button class="delBtn" data-id="${b.id}">🗑️</button>
    `;
    listBox.appendChild(div);
  });

  // delete system bookmarks
  listBox.querySelectorAll(".delBtn").forEach(btn => {
    btn.onclick = () => {
      const id = btn.dataset.id;
      browserAPI.bookmarks.remove(id).then(loadBrowserBookmarks);
    };
  });
}

// ----------------- ADD MANUAL BOOKMARK ---------------
addManualBtn?.addEventListener("click", () => {
  titleInput.value = "";
  urlInput.value = "";
  formBox.classList.remove("hidden");
});

// ----------------- SAVE LOCAL ENTRY -----------------
saveBtn?.addEventListener("click", () => {
  const t = titleInput.value.trim();
  const u = urlInput.value.trim();
  if (!t || !u) return;

  myBookList.push({ title: t, url: u, folder: folderSelect.value });
  localStorage.setItem("myBookList", JSON.stringify(myBookList));
  formBox.classList.add("hidden");
  displayBookmarks(searchInput.value, currentFolder);
});

// ----------------- DISPLAY LOCAL BOOKMARKS -----------
function displayBookmarks(filterTxt = "", folderFilter = "All") {
  const data = myBookList.filter(
    b =>
      (b.title.toLowerCase().includes(filterTxt.toLowerCase()) ||
        b.folder.toLowerCase().includes(filterTxt.toLowerCase())) &&
      (folderFilter === "All" ? true : b.folder === folderFilter)
  );

  listBox.innerHTML = "";
  if (!data.length) {
    listBox.innerHTML = "<p style='color:#555;font-size:13px;'>No local bookmarks yet.</p>";
    return;
  }

  data.forEach((b, i) => {
    const div = document.createElement("div");
    div.className = "bookmark";
    div.innerHTML = `
      <div>
        <a href="${b.url}" target="_blank">${b.title}</a><br>
        <small>${b.folder}</small>
      </div>
      <div>
        <select class="moveSel" data-id="${i}">
          <option disabled selected>Move</option>
          ${myFolders.map(f => `<option value="${f}">${f}</option>`).join("")}
        </select>
        <button class="removeBtn" data-id="${i}">🗑️</button>
      </div>
    `;
    listBox.appendChild(div);
  });

  // Move bookmark between folders
  listBox.querySelectorAll(".moveSel").forEach(sel => {
    sel.onchange = () => {
      const id = sel.dataset.id;
      const newFolder = sel.value;
      myBookList[id].folder = newFolder;
      localStorage.setItem("myBookList", JSON.stringify(myBookList));
      displayBookmarks(searchInput.value, currentFolder);
    };
  });

  // Delete local bookmark
  listBox.querySelectorAll(".removeBtn").forEach(btn => {
    btn.onclick = () => {
      const id = btn.dataset.id;
      myBookList.splice(id, 1);
      localStorage.setItem("myBookList", JSON.stringify(myBookList));
      displayBookmarks(searchInput.value, currentFolder);
    };
  });
}

// ----------------- SEARCH -----------------
searchInput?.addEventListener("input", () =>
  displayBookmarks(searchInput.value, currentFolder)
);

// ----------------- INIT -----------------
initFolders();
displayBookmarks();
loadBrowserBookmarks();