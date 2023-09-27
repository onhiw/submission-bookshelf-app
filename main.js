const SAVED_EVENT = 'savedEvent';
const STORAGE_KEY = 'BOOKSHELF_APPS';

const books = [];
const RENDER_EVENT = 'renderEvent';

function isStorageExist() {
    if (typeof (Storage) === undefined) {
        alert("Browser kamu tidak mendukung web storage");
        return false;
    }
    return true;
};

function saveData() {
    if (isStorageExist()) {
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
};

document.addEventListener(SAVED_EVENT, function () {
    console.log(localStorage.getItem(STORAGE_KEY));
});

function loadData() {
    const dataLocal = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(dataLocal);

    if (data !== null) {
        for (const book of data) {
            books.push(book);
        }
    }
    document.dispatchEvent(new Event(RENDER_EVENT));
};

function addBook() {
    const inputBookTitle = document.getElementById("inputBookTitle").value;
    const inputBookAuthor = document.getElementById("inputBookAuthor").value;
    const inputBookYear = document.getElementById("inputBookYear").value;
    const inputBookIsComplete = document.getElementById("inputBookIsComplete");

    let isCompleted;
    isCompleted = inputBookIsComplete.checked ? true : false;

    books.push({ id: +new Date(), title: inputBookTitle, author: inputBookAuthor, year: Number(inputBookYear), isCompleted: isCompleted, });

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
};

document.addEventListener(RENDER_EVENT, function () {
    const incompleteBookshelfList = document.getElementById("incompleteBookshelfList");
    incompleteBookshelfList.innerHTML = "";

    const completeBookshelfList = document.getElementById("completeBookshelfList");
    completeBookshelfList.innerHTML = "";

    for (let book of books) {
        let row = createBook(book);
        if (!book.isCompleted) {
            incompleteBookshelfList.append(row);
        } else {
            completeBookshelfList.append(row);
        }

    }
});

function createBook(dataBook) {
    const title = document.createElement("h3");
    title.innerHTML = dataBook.title;

    const author = document.createElement("p");
    author.innerHTML = `Penulis : ${dataBook.author}`;

    const year = document.createElement("p");
    year.innerHTML = `Tahun : ${dataBook.year}`;

    const article = document.createElement("article");
    article.classList.add("book_item");

    const action = document.createElement("div");
    action.classList.add("action")

    article.append(title, author, year);

    if (!dataBook.isCompleted) {
        const readItem = document.createElement("button");
        readItem.classList.add("green");
        readItem.innerHTML = "Selesai dibaca";

        readItem.addEventListener("click", function () {
            readBookCompleted(dataBook.id);
        });

        const deleteItem = document.createElement("button");
        deleteItem.classList.add("red");
        deleteItem.innerHTML = "Hapus buku";

        deleteItem.addEventListener("click", function () {
            removeBookCompleted(dataBook.id);
        });

        action.append(readItem, deleteItem);
        article.append(action);
    } else {
        const readItem = document.createElement("button");
        readItem.classList.add("green");
        readItem.innerHTML = "Belum selesai dibaca";

        readItem.addEventListener("click", function () {
            unreadBookCompleted(dataBook.id);
        });

        const deleteItem = document.createElement("button");
        deleteItem.classList.add("red");
        deleteItem.innerHTML = "Hapus buku";

        deleteItem.addEventListener("click", function () {
            removeBookCompleted(dataBook.id);
        });

        action.append(readItem, deleteItem);
        article.append(action);
    }

    return article;
}

document.addEventListener("DOMContentLoaded", function () {

    const saveData = document.getElementById("inputBook");
    saveData.addEventListener("submit", function (e) {
        e.preventDefault();
        addBook();
    });

    const searchData = document.getElementById("searchBook");
    searchData.addEventListener("submit", function (e) {
        e.preventDefault();
        searchBook();
    });

    if (isStorageExist()) {
        loadData();
    }
});

function readBookCompleted(bookId) {
    const book = books.filter(book => book.id === bookId);

    book[0].isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
};

function unreadBookCompleted(bookId) {
    const book = books.filter(book => book.id === bookId);

    book[0].isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
};

function removeBookCompleted(bookId) {
    const book = books.filter(book => book.id === bookId);

    books.splice(book, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
};

function searchBook() {
    const searchBookTitle = document.getElementById("searchBookTitle").value;
    const booksSearch = books.filter(book => book.title.toLowerCase().includes(searchBookTitle.toLowerCase()));

    const incompleteBookshelfList = document.getElementById("incompleteBookshelfList");
    incompleteBookshelfList.innerHTML = "";

    const completeBookshelfList = document.getElementById("completeBookshelfList");
    completeBookshelfList.innerHTML = "";

    for (let book of booksSearch) {
        let row = createBook(book);
        if (!book.isCompleted) {
            incompleteBookshelfList.append(row);
        } else {
            completeBookshelfList.append(row);
        }

    }
}