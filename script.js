$(document).ready(function() {

  function searchBooks() {

    let query = $("#search").val();

    if (query === "") {
      $("#results").html("<h2>Enter a book name</h2>");
      return;
    }

    $("#results").html("<h2>⏳ Loading...</h2>");

    $.ajax({
      url: "https://www.googleapis.com/books/v1/volumes?q=" + query + "&maxResults=10",
      method: "GET",

      success: function(data) {

        $("#results").html("");

        if (!data.items) {
          $("#results").html("<h2>No books found 😢</h2>");
          return;
        }

        data.items.forEach(function(book) {

          let info = book.volumeInfo;

          let title = info.title || "No title";
          let authors = info.authors ? info.authors.join(", ") : "Unknown";
          let image = info.imageLinks
            ? info.imageLinks.thumbnail
            : "https://via.placeholder.com/150";

          $("#results").append(`
            <div class="book"
              data-title="${title}"
              data-authors="${authors}"
              data-desc="${info.description || 'No description'}"
              data-date="${info.publishedDate || 'Unknown'}"
              data-publisher="${info.publisher || 'Unknown'}"
              data-pages="${info.pageCount || 'N/A'}"
              data-lang="${info.language || 'N/A'}"
              data-preview="${info.previewLink || '#'}"
            >
              <img src="${image}">
              <h4>${title}</h4>
              <p>${authors}</p>
              <button class="like">❤️ Like</button>
            </div>
          `);

        });
      },

      error: function() {
        $("#results").html("<h2>Error loading 😢</h2>");
      }

    });

  }

  // Click
  $("#btn").click(searchBooks);

  // Enter
  $("#search").keypress(function(e) {
    if (e.which == 13) {
      searchBooks();
    }
  });

  // Like
  $(document).on("click", ".like", function(e) {
    e.stopPropagation();
    $(this).text("❤️ Liked!");
  });

  // Show popup
  $(document).on("click", ".book", function() {

    let html = `
      <h2>${$(this).data("title")}</h2>
      <p><b>Author:</b> ${$(this).data("authors")}</p>
      <p><b>Description:</b> ${$(this).data("desc")}</p>
      <p><b>Date:</b> ${$(this).data("date")}</p>
      <p><b>Publisher:</b> ${$(this).data("publisher")}</p>
      <p><b>Pages:</b> ${$(this).data("pages")}</p>
      <p><b>Language:</b> ${$(this).data("lang")}</p>
      <a href="${$(this).data("preview")}" target="_blank">📖 Read Preview</a>
    `;

    $("#details").html(html);
    $("#popup").fadeIn();
  });

  // Close popup
  $("#close").click(function() {
    $("#popup").fadeOut();
  });

});