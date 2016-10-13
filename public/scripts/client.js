$(function () {
  getBooks();
  $('#book-list').on('click', '.delete', deleteBook);
  $('#book-list').on('click', '.update', displayUpdate);
  $('#book-list').on('submit', 'form', updateServer);
  $('#book-form').on('submit', addBook);
  $('.form-toggle').on('click', displayForm);
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
  var books = response;
  books.sort(function (a, b) {
    return parseFloat(a.id) - parseFloat(b.id);
  });

  var $list = $('#book-list');
  $list.empty();
  books.forEach(function (book) {
    var $li = $('<li class="col-xs-12 col-sm-6 col-md-4 col-lg-3"></li>');
    $li.append('<p><strong>' + book.title + '</strong></p>');
    $li.append('<p><em>' + book.author + '</em></p>');
    var date = new Date(book.published);
    $li.append('<p>Published: <time>' + date.toDateString() + '</time></p>');
    $li.append('<p>Edition: ' + book.edition + '</p>');
    $li.append('<p>Publisher: ' + book.publisher + '</p>');
    $li.append('<button class="delete ' + book.id + '">Delete</button>');
    $li.append('<button class="update ' + book.id + '">Update</button>');
    $li.append('<form class="container-fluid" id="form' + book.id + '" style="display: none;"><div class="form-group"><label for="title">Title:</label><input type="text" id="title" name="title" class="form-control" /></div><div class="form-group"><label for="author">Author:</label><input type="text" id="author" name="author" class="form-control" /></div><div class="form-group"><label for="published">Published:</label><input type="date" id="published" name="published"  class="form-control"/></div><div class="form-data"><label for="edition">Edition: </label><input type="number" id="edition" name="edition" class="form-control" /></div><div class="form-data"><label for="Publisher">Publisher: </label><input type="text" id="publisher" name="publisher" class="form-control" /></div><button type="submit" id="' + book.id + '" class="btn btn-default update">Update</button></form>');
    $list.append($li);
  });
}

function displayUpdate() {
  console.log('this is working');
  var id = $(this).attr('class').split(' ');
  console.log(id);
  console.log($('#form' + id[1]));

  $('#form' + id[1]).slideToggle();
};

function displayForm() {
  $('#book-form').slideToggle();
}

function updateServer(event) {
  event.preventDefault();
  console.log('This is: ', $(this));
  var id = $(this).attr('id').replace(/[a-z]/g, '');
  var bookData = $(this).serialize();
  console.log(bookData);
  $.ajax({
    type: 'PUT',
    url: '/books/update',
    data: bookData + '&id=' + id,
    success: getBooks,
  });

  $(this).find('input').val('');
}

function deleteBook() {
  var id = $(this).attr('class').split(' ');
  $.ajax({
    type: 'DELETE',
    url: '/books',
    data: { id: id[1] },
    success: getBooks,
  });
}

function addBook(event) {
  event.preventDefault();
  console.log('this: ', $(this));
  var bookData = $(this).serialize();

  $.ajax({
    type: 'POST',
    url: '/books/add',
    data: bookData,
    success: getBooks,
  });

  $(this).find('input').val('');
}
