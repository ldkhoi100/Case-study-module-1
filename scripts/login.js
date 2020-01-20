function check(form) {
    if(form.userid.value == "admin" && form.pswrd.value == "admin"){
        alert('Welcome to Library Book, Khôi!');
        window.open('http://127.0.0.1:5500/libraryBook.html')
        window.close('http://127.0.0.1:5500/index.html');
    }
    else if(form.userid.value == "" || form.pswrd.value == ""){
        alert('Please input username and password!');
    }
    else{
        alert("Wrong Password!")
    }
}