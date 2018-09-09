$(document).ready(function(e) {  
    sign_up_submit();
 });

 function sign_up_submit(){
    $("#sign-up").submit(function (e) {
        e.preventDefault();
        let username = $("#inputEmail").val();
        let password = $("#inputPassword").val();
        let first = $("#inputFirstName").val();
        let last = $("#inputLastName").val();
        sign_in_req(username,password,first,last);
    });
 }

 function sign_in_req(username,password,first,last){
     let payload = {
        username:username,
        password:password,
        first:first,
        last:last
     }; 

     $.ajax({
        headers: {
            'Content-Type': 'application/json'
        },
        data: JSON.stringify(payload),
        dataType: 'json',
        success: function (res) {
            res = JSON.parse(JSON.stringify(res));
            if(!res.posted){
                let message = res.message;
                $("#error > #error-p").text(message);
            }else{
                $.cookie("username", username, 1);
                console.log(window.location.host + '/search');
                window.location = "search"
            }
        },
        error: function (err) {
            $("#error > #error-p").text("Error");
        },
        processData: false,
        type: 'POST',
        url: 'http://localhost:8000/api/signUp'
      })
 }