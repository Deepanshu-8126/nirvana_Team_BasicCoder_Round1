// store all bookmarks locally
let bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];

// get all HTML elements
const addCurrent = document.getElementById("addCurrent");
const addManual = document.getElementById("addManual");
const addBox = document.getElementById("addBox");
const saveBtn = document.getElementById("saveBtn");
const title = document.getElementById("title");
const url = document.getElementById("url");
const folder = document.getElementById("folder");
const bookList = document.getElementById("bookList");
const search = document.getElementById("search");

// ---------- ADD CURRENT TAB -------------
if (addCurrent) {
  addCurrent.addEventListener("click", () => {
    try {
      addBox.classList.remove("hidden");
      // query current tab (Chrome API)
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        const activeTab = tabs[0];
        if (activeTab) {
          title.value = activeTab.title || "";
          url.value = activeTab.url || "";
        }
      });
    } catch (err) {
      console.error("Cannot fetch current tab:", err);
      alert("Chrome permissions missing for tabs.");
    }
  });
}

// ---------- ADD MANUAL LINK -------------
if (addManual) {
  addManual.addEventListener("click", () => {
    title.value = "";
    url.value = "";
    addBox.classList.remove("hidden");
  });
}

// ---------- SAVE BOOKMARK -------------
if (saveBtn) {
  saveBtn.addEventListener("click", () => {
    const titleVal = title.value.trim();
    const urlVal = url.value.trim();
    const folderVal = folder.value;

    if (!titleVal || !urlVal) {
      alert("Please enter both Title and URL");
      return;
    }

    const newBookmark = {
      title: titleVal,
      url: urlVal,
      folder: folderVal,
    };

    bookmarks.push(newBookmark);
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));

    addBox.classList.add("hidden");
    renderList();
  });
}

// ---------- RENDER FUNCTION -------------
function renderList(filterText = "") {
  if (!bookList) return;
  const filtered = bookmarks.filter(
    (b) =>
      b.title.toLowerCase().includes(filterText.toLowerCase()) ||
      b.folder.toLowerCase().includes(filterText.toLowerCase())
  );

  if (filtered.length === 0) {
    bookList.innerHTML = "<p>No bookmarks found.</p>";
    return;
  }

  const html = filtered
    .map(
      (b, i) => `
    <div class="bookmark">
      <div>
        <a href="${b.url}" target="_blank">${b.title}</a><br>
        <small>${b.folder}</small>
      </div>
      <button class="delBtn" data-index="${i}">🗑️</button>
    </div>
  `
    )
    .join("");
  bookList.innerHTML = html;

  // delete buttons handle
  document.querySelectorAll(".delBtn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const index = e.target.getAttribute("data-index");
      deleteBookmark(index);
    });
  });
}

// ---------- DELETE BOOKMARK -------------
function deleteBookmark(index) {
  if (!confirm("Delete this bookmark?")) return;
  bookmarks.splice(index, 1);
  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  renderList();
}

// ---------- SEARCH WORKS -------------
if (search) {
  search.addEventListener("input", () => renderList(search.value));
}

// initial render
renderList();