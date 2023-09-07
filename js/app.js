document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("form");
  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addBooks();
  });
  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

const books = [];
const RENDER_EVENT = "render-book";
document.addEventListener(RENDER_EVENT, function () {
  const uncomlpetedBookList = document.getElementById("no-read");
  uncomlpetedBookList.innerHTML = "";

  const completedBookList = document.getElementById("done-read");
  completedBookList.innerHTML = "";

  for (const booksItem of books) {
    const booksElement = makeOutput(booksItem);
    if (!booksItem.isComlpeted) {
      uncomlpetedBookList.append(booksElement);
    } else {
      completedBookList.append(booksElement);
    }
  }
});

// Function addBooks
function addBooks() {
  const textTitle = document.getElementById("judul-buku").value;
  const textAuth = document.getElementById("penulis-buku").value;
  const textYear = document.getElementById("tahun-buku").value;

  const generateID = generateId();
  const booksObject = generateBooksObject(
    generateID,
    textTitle,
    textAuth,
    textYear,
    false
  );
  books.push(booksObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

// generateId
function generateId() {
  return +new Date();
}

// generateBooksObject
function generateBooksObject(id, title, auth, year, isComlpeted) {
  return {
    id,
    title,
    auth,
    year,
    isComlpeted,
  };
}

// Making output from inputBooks
function makeOutput(booksObject) {
  const textTitle = document.createElement("h3");
  textTitle.innerHTML = booksObject.title;
  const textAuth = document.createElement("p");
  textAuth.innerHTML = booksObject.auth;
  const textYear = document.createElement("p");
  textYear.innerHTML = booksObject.year;
  const textContainer = document.createElement("div");
  textContainer.classList.add("inner");
  textContainer
    .appendChild(textTitle)
    .appendChild(textAuth)
    .appendChild(textYear);
  const container = document.createElement("div");
  container.classList.add("item", "shadow");
  container.appendChild(textContainer);
  container.setAttribute("id", `books-${booksObject.id}`);

  if (booksObject.isComlpeted) {
    const undoButton = document.createElement("button");
    undoButton.classList.add("undo-button");

    undoButton.addEventListener("click", function () {
      undoTaskFromCompleted(booksObject.id);
    });

    const trashButton = document.createElement("button");
    trashButton.classList.add("trash-button");

    trashButton.addEventListener("click", function () {
      removeTaskFromCompleted(booksObject.id);
      showDeleteConfirmation(booksObject.id);
    });

    container.append(undoButton, trashButton);
  } else {
    const checkButton = document.createElement("button");
    checkButton.classList.add("check-button");

    checkButton.addEventListener("click", function () {
      addTaskToCompleted(booksObject.id);
    });

    container.append(checkButton);
  }

  return container;
}

function removeTaskFromCompleted(booksId) {
  const Target = findBooksIndex(booksId);

  if (Target === -1) return;

  books.splice(Target, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}
function findBooks(booksId) {
  for (const booksItem of books) {
    if (booksItem.id === booksId) {
      return booksItem;
    }
  }
  return null;
}

function findBooksIndex(booksId) {
  for (const index in books) {
    if (books[index].id === booksId) {
      return index;
    }
  }

  return -1;
}

function addTaskToCompleted(booksId) {
  const Target = findBooks(booksId);

  if (Target == null) return;

  Target.isComlpeted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function undoTaskFromCompleted(booksId) {
  const Target = findBooks(booksId);

  if (Target == null) return;

  Target.isComlpeted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

// Dialog function after deleting books from shelf
function showDeleteConfirmation(booksId) {
  const confirmation = window.confirm(
    "Are you sure want to delete this?"
  );
  if (confirmation) {
    removeTaskFromCompleted(booksId);
  }
}

// Web Storage
const SAVED_EVENT = "saved-books";
const STORAGE_KEY = "BOOKSHELF-APPS";

document.addEventListener(SAVED_EVENT, function () {
  console.log(localStorage.getItem(STORAGE_KEY));
});

function isStorageExist() /* boolean */ {
  if (typeof Storage === undefined) {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true;
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}

// Search Books Funtion
const searchButton = document.getElementById("btn-search");
searchButton.addEventListener("click", function () {
  searchBooksByTitle();
});

function searchBooksByTitle() {
  const searchBox = document.getElementById("search-box");
  const searchTerm = searchBox.value.toLowerCase();
  const uncomlpetedBookList = document.getElementById("no-read");
  const completedBookList = document.getElementById("done-read");

  for (const booksItem of books) {
    const title = booksItem.title.toLowerCase();
    const booksElement = document.getElementById(`books-${booksItem.id}`);

    if (title.includes(searchTerm)) {
      // If the title matches with the keyword
      if (!booksItem.isComlpeted) {
        uncomlpetedBookList.appendChild(booksElement);
      } else {
        completedBookList.appendChild(booksElement);
      }
    } else {
      // if the title don't matches with the keyword
      if (!booksItem.isComlpeted) {
        uncomlpetedBookList.removeChild(booksElement);
      } else {
        completedBookList.removeChild(booksElement);
      }
    }
  }
}
