$(function () {
  getBooks();
  $('#book-list').on('click', '.delete', deleteBook);
  $('#book-form').on('submit', addBook);
});

function getBooks() {
  $.ajax({
    type: 'GET',
    url: '/books',
    success: displayBooks,
  });
}

function displayBooks(response) {
  console.log(response);
  var $list = $('#book-list');
  $list.empty();
  response.forEach(function (book) {
    var $li = $('<li class="col-xs-12 col-sm-6 col-md-4 col-lg-3"></li>');
    $li.append('<p><strong>' + book.title + '</strong></p>');
    $li.append('<p><em>' + book.author + '</em></p>');
    var date = new Date(book.published);
    $li.append('<p><time>' + date.toDateString() + '</time></p>');
    $li.append('<p>' + book.edition + '</p>');
    $li.append('<p>' + book.publisher + '</p>');
    $li.append('<button class="delete" id="' + book.title + '">Delete entry</button>');
    $list.append($li);
  });
}

function deleteBook() {
  var id = $(this).attr('id');
  $.ajax({
    type: 'DELETE',
    url: '/books',
    data: { title: id },
    success: getBooks,
  });
}

function addBook(event) {
  event.preventDefault();

  var bookData = $(this).serialize();

  $.ajax({
    type: 'POST',
    url: '/books',
    data: bookData,
    success: getBooks,
  });

  $(this).find('input').val('');
}
