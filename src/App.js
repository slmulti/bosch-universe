import { useEffect, useState } from "react";
import supabase from "./supabase";
import "./style.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/loginPage";
import Success from "./pages/successPage";
import { useNavigate } from "react-router-dom";

function App() {
    const [showForm, setShowForm] = useState(false);
    const [books, setBooks] = useState([]);
    const [owns, setOwns] = useState([false]);
    const [isLoading, setIsLoading] = useState(false);
    const [currentSeries, setCurrentSeries] = useState("all");

    const SERIES = [
        { name: "Harry Bosch", color: "#3b82f6" },
        { name: "Jack McEvoy", color: "#16a34a" },
        { name: "Terry McCaleb", color: "#ef4444" },
        { name: "Mickey Haller", color: "#eab308" },
        { name: "Renée Ballard", color: "#db2777" },
        // { name: "Spare1", color: "#14b8a6" },
        // { name: "Spare2", color: "#f97316" },
        // { name: "Spare3", color: "#8b5cf6" },
    ];

    //========================================================================================================

    // //using useEffect to pull all the books form supabase and display in console

    // useEffect(function () {
    //     async function getBooks() {
    //         let { data: books, error } = await supabase
    //             .from("books")
    //             .select("*");
    //         console.log(books);
    //     }
    //     getBooks();
    // }, []);

    //========================================================================================================

    //using useEffect to pull all the books form supabase and display in browser
    useEffect(
        function () {
            async function getBooks() {
                //display loading screen whilst fetching data
                setIsLoading(true);
                //select all books from supabase
                let query = supabase.from("books").select("*");
                //however if a book series is selected only show them => using supabase .eq
                if (currentSeries !== "all") {
                    query = query.eq("bookSeries", currentSeries);
                    console.log(currentSeries);
                }

                //order books by publication year
                const { data: books, error } = await query.order(
                    "bookPubYear",
                    {
                        ascending: true,
                    }
                );

                // checking books coming through
                console.log(books);

                //error handling
                if (!error) setBooks(books);
                else alert("There was a problem getting data");

                //hide loading message
                setIsLoading(false);
            }
            getBooks();

            // async function getOwns() {
            //     // setIsLoading(true);
            //     let query = supabase.from("owns").select("*");
            //     const { data: owns, error } = await query.order("id", {
            //         ascending: true,
            //     });
            //     // console.log(owns[0]);
            //     const x = owns[0];
            //     console.log(x.own);

            //     if (!error) setOwns(owns);
            //     else alert("There was a problem getting data");

            //     setIsLoading(false);
            // }
            // getOwns();
        },
        [currentSeries]
    );

    //========================================================================================================

    return (
        <>
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/success" element={<Success />} />
                </Routes>
            </Router>
            {/* display the header */}
            <Header showForm={showForm} setShowForm={setShowForm} />
            {showForm ? (
                <NewBookForm setBooks={setBooks} setShowForm={setShowForm} />
            ) : null}
            <main className="main">
                <SeriesFilters setCurrentSeries={setCurrentSeries} />
                {isLoading ? (
                    <Loader />
                ) : (
                    <BookList books={books} setBooks={setBooks} />
                )}
            </main>
        </>
    );

    //========================================================================================================

    function Loader() {
        return <p className="message">Loading...</p>;
    }

    //========================================================================================================

    function Header({ showForm, setShowForm }) {
        const appTitle = "Bosch Universe";
        return (
            <header className="header">
                <div className="logo">
                    <img src="MC.jpg" alt="Michael Connoly Logo" />
                    <h1>{appTitle}</h1>
                </div>
                <button
                    className="btn btn-large btn-open"
                    onClick={() => setShowForm((show) => !show)}
                >
                    {showForm ? "Close" : "Add new Bosch Book"}
                </button>
            </header>
        );
    }

    //========================================================================================================

    //make sure givenURL is valid and will go somewhere from stacked overflow

    function isValidHttpUrl(string) {
        let url;
        try {
            url = new URL(string);
        } catch (_) {
            return false;
        }
        return url.protocol === "http:" || url.protocol === "https:";
    }

    //========================================================================================================

    function NewBookForm({ setBooks, setShowForm }) {
        const [bookName, setBookName] = useState("");
        const [bookDescription, setBookDescription] = useState("");
        const [bookImg, setBookImg] = useState("");
        const [bookPubYear, setBookPubYear] = useState("");
        const [bookSource, setBookSource] = useState("http://example.com"); //change to ""
        const [bookSeries, setBookSeries] = useState("");
        const [isUploading, SetIsUploading] = useState(false); //styling set to off
        const bookNameLength = bookName.length;
        const bookDescriptionLength = bookDescription.length;
        // const bookPubYearLength = bookPubYear.length;

        async function handleSubmit(e) {
            //Prevent browser reload
            e.preventDefault();
            console.log(bookName, bookDescription, bookPubYear, bookSeries);

            //before uploading data make sure it is valid
            if (
                bookName &&
                bookDescription &&
                bookImg &&
                bookPubYear &&
                isValidHttpUrl(bookSource) &&
                bookSeries &&
                bookNameLength <= 30 &&
                bookDescriptionLength <= 1000
                // bookPubYearLength <= 4 //might ditch
            ) {
                //uploading formating
                SetIsUploading(true);
                //what to add to supabase
                const { data: newBook, error } = await supabase
                    .from("books")
                    .insert([
                        {
                            bookName,
                            bookDescription,
                            bookImg,
                            bookPubYear,
                            bookSource,
                            bookSeries,
                        },
                    ])
                    .select();
                //remove styling for upload
                SetIsUploading(false);
                //add the new book to ui/state
                if (!error) setBooks((books) => [newBook[0], ...books]);
            } else {
                alert("Please take care to enter details again");
            }
            //reset input
            setBookName("");
            setBookDescription("");
            setBookSource("http://example.com");
            setCurrentSeries("all");

            //close form
            setShowForm(false);
        }

        return (
            <form className="book-form" onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Enter Book Name Here..."
                    value={bookName}
                    onChange={(e) => setBookName(e.target.value)}
                    disabled={isUploading}
                />
                <span>{30 - bookNameLength}</span>
                <input
                    type="text"
                    placeholder="Enter Book Description Here..."
                    value={bookDescription}
                    onChange={(e) => setBookDescription(e.target.value)}
                    disabled={isUploading}
                />
                <span>{1000 - bookDescriptionLength}</span>
                <input
                    type="text"
                    placeholder="Enter Book Image URL Here..."
                    value={bookImg}
                    onChange={(e) => setBookImg(e.target.value)}
                    disabled={isUploading}
                />
                <input
                    type="text"
                    placeholder="Enter Year the Book was Published Here..."
                    value={bookPubYear}
                    onChange={(e) => setBookPubYear(e.target.value)}
                    disabled={isUploading}
                />
                <input
                    type="text"
                    placeholder="Enter Amazon URL Here..."
                    value={bookSource}
                    onChange={(e) => setBookSource(e.target.value)}
                    disabled={isUploading}
                />
                <select
                    value={bookSeries}
                    onChange={(e) => setBookSeries(e.target.value)}
                    disabled={isUploading}
                >
                    <option value="">Choose Book Series</option>
                    {SERIES.map((ser) => (
                        <option key={ser.name} value={ser.name}>
                            {ser.name.toUpperCase()}
                        </option>
                    ))}
                </select>
                <button className="btn btn-large" disabled={isUploading}>
                    Post
                </button>
            </form>
        );
    }

    //========================================================================================================

    function SeriesFilters({ setCurrentSeries }) {
        return (
            <aside>
                <ul>
                    <li className="series">
                        <button
                            className="btn btn-all-series"
                            onClick={() => setCurrentSeries("all")}
                        >
                            All
                        </button>
                    </li>
                    {SERIES.map((ser) => (
                        <li key={ser.name} className="series">
                            <button
                                className="btn btn-series"
                                style={{ backgroundColor: ser.color }}
                                onClick={() => setCurrentSeries(ser.name)}
                            >
                                {ser.name}
                            </button>
                        </li>
                    ))}
                </ul>
            </aside>
        );
    }

    //========================================================================================================

    function BookList({ books, setBooks }) {
        if (books.length === 0) {
            return <p className="message">No Books in this Series yet!</p>;
        } else {
            return (
                <section>
                    <ul className="books-list">
                        {books.map((book) => (
                            <Book
                                key={book.id}
                                book={book}
                                setBooks={setBooks}
                                setOwns={setOwns}
                            />
                        ))}
                        {/* {console.log(owns.map((arr) => arr.own))} */}
                    </ul>
                    <p>
                        There are {books.length} books in the database. Add any
                        that are missing!
                    </p>
                </section>
            );
        }
    }

    //========================================================================================================

    function Book({ book, setBooks, setOwns }) {
        const [bookRating, setBookRating] = useState("0");

        async function handleOwn(columnName) {
            const { data: updatedBook, error } = await supabase
                .from("books")
                .update({ own: !book.own })
                .eq("id", book.id)
                .select();

            console.log(updatedBook);

            if (!error)
                setBooks((books) =>
                    books.map((b) => (b.id === book.id ? updatedBook[0] : b))
                );
        }

        async function handleRead(columnName) {
            const { data: updatedBook, error } = await supabase
                .from("books")
                .update({ read: !book.read })
                .eq("id", book.id)
                .select();

            console.log(updatedBook);

            if (!error)
                setBooks((books) =>
                    books.map((b) => (b.id === book.id ? updatedBook[0] : b))
                );
        }

        async function handleRating(ratingValue) {
            const { data: updatedBook, error } = await supabase
                .from("books")
                .update({ bookRating: ratingValue })
                .eq("id", book.id)
                .select();

            console.log(updatedBook);

            if (!error)
                setBooks((books) =>
                    books.map((b) => (b.id === book.id ? updatedBook[0] : b))
                );
        }

        const handleDelete = async () => {
            const { data, error } = await supabase
                .from("books")
                .delete()
                .eq("id", book.id)
                .select();

            if (error) {
                console.log(error);
            }
            if (data) {
                alert(`${data[0].bookName} has been deleted`);

                //should be able to change local state here and update booklist without recalling the API, dirty solution

                //display loading screen whilst fetching data
                setIsLoading(true);
                //select all books from supabase
                let query = supabase.from("books").select("*");
                //however if a book series is selected only show them => using supabase .eq
                if (currentSeries !== "all") {
                    query = query.eq("bookSeries", currentSeries);
                    console.log(currentSeries);
                }

                //order books by publication year
                const { data: books, error } = await query.order(
                    "bookPubYear",
                    {
                        ascending: true,
                    }
                );

                // checking books coming through
                console.log(books);

                //error handling
                if (!error) setBooks(books);
                else alert("There was a problem getting data");

                //hide loading message
                setIsLoading(false);
            }
        };

        return (
            <li className="book">
                <img src={book.bookImg} alt="Book Image" className="bookImg" />
                <div className="bookDetails">
                    <div className="bookTitleAndOrder">
                        <h2>{book.bookName}</h2>
                        <p className="order">
                            {/* Book {book.id} of {books.length} */}
                            Book {books.indexOf(book) + 1} of {books.length}
                            {/* {console.log(books.indexOf(book) + 1)} */}
                        </p>
                    </div>

                    <p>{book.bookDescription}</p>
                    <div>
                        <b>{book.bookPubYear}</b>
                        <a
                            className="source"
                            href={book.bookSource}
                            target="_blank"
                        >
                            (Amazon)
                        </a>
                        <h3>
                            Own:{"    "}
                            {book.own ? (
                                <button
                                    className="ownread-buttons own-btn"
                                    onClick={() => handleOwn("own")}
                                >
                                    ✔
                                </button>
                            ) : (
                                <button
                                    className="ownread-buttons"
                                    onClick={() => handleOwn("own")}
                                >
                                    ⛔
                                </button>
                            )}
                            {/* {console.log(owns[0].own)}; */}
                            {/* {console.log(owns)} */}
                            Read:{"    "}
                            {book.read ? (
                                <button
                                    className="ownread-buttons own-btn"
                                    onClick={() => handleRead("own")}
                                >
                                    ✔
                                </button>
                            ) : (
                                <button
                                    className="ownread-buttons"
                                    onClick={() => handleRead("own")}
                                >
                                    ⛔
                                </button>
                            )}
                            {/* {console.log(owns.read)} */}
                            Rating: {book.bookRating}
                            {" ⭐"}
                            <select
                                value={bookRating}
                                onChange={(e) => handleRating(e.target.value)}
                            >
                                <option value="0">Choose A Rating</option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                            </select>
                        </h3>
                    </div>

                    <span
                        className="series"
                        onClick={() => {
                            setCurrentSeries(book.bookSeries);
                        }}
                        style={{
                            backgroundColor: SERIES.find(
                                (ser) => ser.name === book.bookSeries
                            ).color,
                        }}
                    >
                        {book.bookSeries}
                    </span>
                </div>

                <div>
                    <button className="delete-btn" onClick={handleDelete}>
                        🗑
                    </button>
                </div>
            </li>
        );
    }

    //========================================================================================================
}

export default App;
