document.addEventListener('DOMContentLoaded', () => {
    getAllBooks();
    document.getElementById('addBookForm').addEventListener('submit', addBook);
});

// Base API URL
const baseUrl = 'http://localhost:5000/api/v1/library';

// Function to fetch and display all books
async function getAllBooks() {
    try {
        const response = await axios.get(`${baseUrl}/books`);
        const books = response.data.data;
        displayBooks(books);
    } catch (error) {
        console.error('Error fetching books:', error);
    }
}

// Function to display books in the DOM
function displayBooks(books) {
    const booksList = document.getElementById('booksList');
    booksList.innerHTML = '';
    books.forEach(book => {
        const bookItem = document.createElement('div');
        bookItem.innerHTML = `
            <p><strong>${book.title}</strong> by ${book.author}</p>
            <button onclick="viewBook('${book._id}')">View Details</button>
        `;
        booksList.appendChild(bookItem);
    });
}

// Function to search books
async function searchBooks() {
    const searchQuery = document.getElementById('searchQuery').value;
    try {
        const response = await axios.get(`${baseUrl}/books/search`, { params: { search: searchQuery } });
        const books = response.data.data;
        displayBooks(books);
    } catch (error) {
        console.error('Error searching books:', error);
    }
}

// Function to view a single book
async function viewBook(bookId) {
    try {
        const response = await axios.get(`${baseUrl}/books/${bookId}`);
        const book = response.data.data;
        displaySingleBook(book);
    } catch (error) {
        console.error('Error fetching book details:', error);
    }
}

// Function to display a single book's details
function displaySingleBook(book) {
    const selectedBook = document.getElementById('selectedBook');
    selectedBook.innerHTML = `
        <h3>${book.title}</h3>
        <p>Author: ${book.author}</p>
        <p>Published Year: ${book.publishedInYear}</p>
        <p>Genre: ${book.genre}</p>
        <p>Copies Available: ${book.copies}</p>
        <button onclick="toggleAvailability('${book._id}')">${book.available ? 'Mark Unavailable' : 'Mark Available'}</button>
        <button onclick="showUpdateForm('${book._id}')">Update Details</button>
    `;
    document.getElementById('updateBookForm').style.display = 'block';
}

// Function to toggle book availability
async function toggleAvailability(bookId) {
    try {
        const response = await axios.patch(`${baseUrl}/books/${bookId}/toggle-availability`);
        alert(response.data.message);
        getAllBooks();
    } catch (error) {
        console.error('Error toggling availability:', error);
    }
}

// Function to show update form
function showUpdateForm(bookId) {
    document.getElementById('updateBookForm').setAttribute('data-book-id', bookId);
}

// Function to add a new book
async function addBook(event) {
    event.preventDefault();

    const formData = new FormData();
    formData.append('title', document.getElementById('title').value);
    formData.append('author', document.getElementById('author').value);
    formData.append('publishedInYear', document.getElementById('publishedInYear').value);
    formData.append('genre', document.getElementById('genre').value);
    formData.append('copies', document.getElementById('copies').value);
    formData.append('CoverImage', document.getElementById('CoverImage').files[0]);
    formData.append('pdfLink', document.getElementById('pdfLink').files[0]);

    try {
        const response = await axios.post(`${baseUrl}/books`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        alert('Book added successfully!');
        getAllBooks();
    } catch (error) {
        console.error('Error adding book:', error);
    }
}

// Function to update book details
async function updateBook() {
    const bookId = document.getElementById('updateBookForm').getAttribute('data-book-id');
    const updatedDetails = {
        title: document.getElementById('updateTitle').value,
        author: document.getElementById('updateAuthor').value,
        publishedInYear: document.getElementById('updatePublishedInYear').value
    };

    try {
        const response = await axios.patch(`${baseUrl}/books/${bookId}`, updatedDetails);
        alert('Book updated successfully!');
        getAllBooks();
    } catch (error) {
        console.error('Error updating book:', error);
    }
}

// Function to delete a book
async function deleteBook() {
    const bookId = document.getElementById('updateBookForm').getAttribute('data-book-id');

    try {
        const response = await axios.delete(`${baseUrl}/books/${bookId}`);
        alert('Book deleted successfully!');
        getAllBooks();
    } catch (error) {
        console.error('Error deleting book:', error);
    }
}
