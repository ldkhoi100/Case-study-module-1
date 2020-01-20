var libraryBook = libraryBook || {};

libraryBook.drawTable = function() {
    $.ajax({
        url: "http://localhost:3000/Book",
        method: "GET",
        dataType: "json",
        success: function (data) {
            $('#LibraryBook').empty();
            $.each(data, function(i, v){
                function editDate(date){
                //Định dạng dd-mm-yyyy
                let today = new Date(date);
                let dd = String(today.getDate()).padStart(2, '0');
                let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
                let yyyy = today.getFullYear();
                today = dd + '/' + mm + '/' + yyyy;
                return today;
                };

                function checkDate(value) {
                    if(value=="")
                    return "";
                    else
                    return editDate(value);
                };
                
                $('#LibraryBook').append(
                    "<tr>" + 
                        "<td>" + (i+1) + "</td>" + //Serial
                        "<td>" + v.IDBook + "</td>" + 
                        "<td>" + v.Title + "</td>" + 
                        "<td><img src='" + v.Avatar + "' width='60px' height='78px' /></td>" + 
                        "<td>" + v.Author + "</td>" + 
                        "<td>" + v.CategoryClass.Name + "</td>" + 
                        "<td>" + v.StatusCheck.Name + "</td>" + 
                        "<td>" + v.Borrower + "</td>" + 
                        "<td>" + checkDate(v.BorrowDate) + "</td>" + 
                        "<td>" + checkDate(v.PayDay) + "</td>" + 
                        "<td>" + 
                            "<a href='javascript:;' title ='Edit Book' onclick='libraryBook.get("+ v.id +")' ><i class='fa fa-edit' style='font-size:25px; color:red; margin-right:5px'></i></a> " +
                            "<a href='javascript:;' title ='Delete Book' onclick='libraryBook.delete("+ v.id +")' ><i class='fa fa-trash' style='font-size:26px; color:blueviolet;'></i></a>" +
                        "</td>" + 
                    "</tr>"
                ); 
            });
            //Gọi hàm DataTable
            $('#myTable').DataTable({
                destroy: true,
                columnDefs : [
                    {
                        "targets": [3,10],
                        "orderable" : false
                    }
                    
                ]
            });
        }
    });
};

libraryBook.openModal = function() {
    libraryBook.reset();
    $('#setStatus').attr("hidden","true");
    $('#update').text("Create New Book");
    $('#addEditLibraryBook').modal('show');
}

libraryBook.save = function() {
    if($('#formAddEditLibraryBook').valid()){
        if($('#id').val() == 0){
            var bookObj = {};
            bookObj.IDBook = $('#IDBook').val();
            bookObj.Title = $('#Title').val();
            bookObj.Avatar = $('#Avatar').val();
            bookObj.Author = $('#Author').val();
            bookObj.Category = $('#CategoryID').val();
            bookObj.Borrower = $('#Borrower').val();
            bookObj.BorrowDate = $('#BorrowDate').val();
            bookObj.PayDay = $('#PayDay').val();

            var CategoryObj = {};
            CategoryObj.id = $("#CategoryID").val();
            CategoryObj.Name = $("#CategoryID option:selected").html();
            bookObj.CategoryClass = CategoryObj;

            var StatusObj = {};
            StatusObj.id = "2";
            StatusObj.Name = "Rảnh rỗi";
            bookObj.StatusCheck = StatusObj;

            $.ajax({
                url: "http://localhost:3000/Book",
                method : "POST",
                dataType : "json",
                contentType : "application/json",
                data : JSON.stringify(bookObj),
                success : function(data){
                    $('#addEditLibraryBook').modal('hide');
                    libraryBook.drawTable();
                }
            });
        }
        else{
            var bookObj = {};
            bookObj.IDBook = $('#IDBook').val();
            bookObj.Title = $('#Title').val();
            bookObj.Avatar = $('#Avatar').val();
            bookObj.Author = $('#Author').val();
            bookObj.Category = $('#CategoryID').val();
            bookObj.Status = $('#Status').val();
            bookObj.Borrower = $('#Borrower').val();
            bookObj.BorrowDate = $('#BorrowDate').val();
            bookObj.PayDay = $('#PayDay').val();
            bookObj.id = $('#id').val();

            var CategoryObj = {};
            CategoryObj.id = $("#CategoryID").val();
            CategoryObj.Name = $("#CategoryID option:selected").html();
            bookObj.CategoryClass = CategoryObj;

            var StatusObj = {};
            StatusObj.id = $("#Status").val();
            StatusObj.Name = $("#Status option:selected").html();
            bookObj.StatusCheck = StatusObj;

            $.ajax({
                url: "http://localhost:3000/Book/" + bookObj.id,
                method : "PUT",
                dataType : "json",
                contentType : "application/json",
                data : JSON.stringify(bookObj),
                success : function(data){
                    $('#addEditLibraryBook').modal('hide');
                    libraryBook.drawTable();
                }
            });
        }
    }
    location.reload();
};

libraryBook.delete = function(id) {
    bootbox.confirm({
        title: "Delete Book!",
        message: "Do you want delete this book? This cannot be undone.",
        buttons: {
            cancel: {
                label: '<i class="fa fa-times"></i>No'
            },
            confirm: {
                label: '<i class="fa fa-check"></i>Yes'
            }
        },
        callback: function (result) {
            if(result){
                $.ajax({
                    url : "http://localhost:3000/Book/" + id,
                    method : "DELETE",
                    dataType : "json",
                    success : function(data){
                        libraryBook.drawTable();
                        location.reload();
                    }
                });
            }
        }
    });
};

libraryBook.get = function(id) { //Hàm edit
    $.ajax({
        url : "http://localhost:3000/Book/" + id,
        method : "GET", //Lấy dữ liệu về
        dataType : "json",
        success : function(data) {
            $('#setStatus').removeAttr("hidden");
            $('#update').text("Edit book");
            $('#IDBook').val(data.IDBook);
            $('#Title').val(data.Title);
            $('#Avatar').val(data.Avatar);
            $('#showAvatar').attr('src', $('#Avatar').val());
            $('#Author').val(data.Author);
            $('#CategoryID').val(data.Category);
            $('#Status').val(data.StatusCheck.id);
            $('#Borrower').val(data.Borrower);
            $('#BorrowDate').val(data.BorrowDate);
            $('#PayDay').val(data.PayDay);
            $('#id').val(data.id);

            var validator = $('#formAddEditLibraryBook').validate();
            validator.resetForm();
            $('#addEditLibraryBook').modal('show');
        }
    });
};

libraryBook.uploadAvatar = function(input){
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $('#Avatar').val(e.target.result);
        };
        reader.readAsDataURL(input.files[0]);
    }
};

libraryBook.reset = function() {
    $('#IDBook').val('');
    $('#Title').val('');
    $('#Avatar').val('');
    $('#showAvatar').attr('src', '');
    $('#Author').val('');
    $('#CategoryID').val('');
    $('#Status').val('');
    $('#Borrower').val('');
    $('#BorrowDate').val('');
    $('#PayDay').val('');
    $('#id').val('0');
    var validator = $('#formAddEditLibraryBook').validate();
    validator.resetForm();
};

libraryBook.initCategoryClass = function() {
    $.ajax({
        url : "http://localhost:3000/Classes",
        method : "GET",
        dataType : "json",
        success : function (data) {
            $('#CategoryID').empty();
            $.each(data, function(i, v){ 
                $('#CategoryID').append(
                    "<option value='" + v.id + "'>"+ v.Name +"</option>"
                ); 
            });
        }
    });
};

libraryBook.initStatus = function() {
    $.ajax({
        url : "http://localhost:3000/StatusCheck",
        method : "GET",
        dataType : "json",
        success : function (data) {
            $('#Status').empty();
            $.each(data, function(i, v){ 
                $('#Status').append(
                    "<option value='" + v.id + "'>"+ v.Name +"</option>"
                ); 
            });
        }
    });
};

libraryBook.init = function(){ //Khi trang tải lên, thì những gì trong init này sẽ chạy cùng lúc khi nó tải
    libraryBook.drawTable();
    libraryBook.initCategoryClass();
    libraryBook.initStatus();
};

$(document).ready(function () { //Khi chạy xong xuôi thì tải trang lên
    libraryBook.init();
});