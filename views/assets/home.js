// client side
// when DOM is ready
let lastId = 0;

$(() => {
    // load all users
    requestUsers();

    // submit event handler
    $('#submitButton').click(() => {
        const user = {
            name: $('input[name=name]').val(),
            email: $('input[name=email]').val(),
            phone: $('input[name=phone]').val(),
        }
        
        // --------- production version ------------
        // // if email is valid
        // if (validateUser(user)) {
        //     // model -> send data to server side
        //     sendUser(user);
        //     // view -> show confirm-page
        //     showDetailPage(user);
        //     // view -> reset add-page previous input value
        //     $('#add-page input').val("");
        // }

        // test version
        // model -> send data to server side
        sendUser(user);
        // view -> show confirm-page
        showDetailPage(user);
        // view -> reset add-page previous input value
        $('#add-page input').val("");

    })

    // index button -> show home-page
    $('#listButton').click(showHomePage)
    // new button -> show add-page
    $('#newButton').click(showAddPage)
})


function requestUsers() {
    // get existed data from server side
    $.ajax({
        type: 'GET',
        url: 'api/user',
        // returned json type supposed to be json
        dataType: 'json',
    })
    .done(successHandler)
    .fail(errorHandler)

}


function sendUser(user) {
    $.ajax({
        type: 'POST',
        url: 'api/user',
        // send data
        data: JSON.stringify(user),
        // send data type
        contentType: 'application/json',
        dataType: 'json',
    })
    .done(successHandler)
    .fail(errorHandler)
}


function deleteUser(id) {
    $.ajax({
        type: 'DELETE',
        url: `api/user/${id}`,
        data: JSON.stringify(id),
        contentType: 'application/json',
        dataType: 'json',
    })
    .done(successHandler)
    .fail(errorHandler)
}


function successHandler(users) {
    console.log(`Response has ${users.length} users`)
    var $table = $( "<table border='1'><tr><th>ID</th><th>Name</th><th>Email</th><th>Phone</th></table>" );
    for ( let index = 0; index < users.length; index++ ) {
        const user = users[index]
        const $line = $( "<tr></tr>" )
        $line.append( $( "<td></td>" ).html( user.id ) )
        $line.append( $( "<td></td>" ).html( user.name ) )
        $line.append( $( "<td></td>" ).html( user.email ) )
        $line.append( $( "<td></td>" ).html( user.phone ) )
        $table.append( $line )

        lastId = user.id;
    }

    $('#table').empty()
    $table.appendTo( $('#table') )
}


function errorHandler(jqXHR, textStatus, error) {
    $('#output').val("textStatus: " + textStatus + ". server error: " + error)
}


function showHomePage() {
    $("#home-page").show();
    $("#add-page").hide();
    $("#detail-page").hide();
}


function showAddPage() {
    $("#home-page").hide();
    $("#add-page").show();
    $("#detail-page").hide();
}


function showDetailPage(user) {
    // empty previous content
    $('#detail-page').empty()
    // append info to detail-page
    $('#detail-page').append( $("<h3></h3>").text("Contact") ) 
    $('#detail-page').append( $("<p></p>").text(`Name: ${user.name}`) )
    $('#detail-page').append( $("<p></p>").text(`Email: ${user.email}`) )
    $('#detail-page').append( $("<p></p>").text(`Phone: ${user.phone}`) )
    // add edit button
    $('#detail-page').append( $("<button></button>").text('EDIT') )




    // add delete button
    const deleteButton = $("<button></button>").text('DELETE');
    deleteButton.click(() => {
        const choice = confirm("Are you sure to delete this contact member?")
        if (choice == true) {
            // ---------------- go to server side, find and delete ------------
            deleteUser(lastId);
        }
    })

    $('#detail-page').append(deleteButton)

    // change the visibility
    $("#home-page").hide();
    $("#add-page").hide();
    $("#detail-page").show();
}
function validateUser(user) {
    // validate name
    if (user.name.length == 0) {
        alert('Invalid name, please re-enter');
        return false;
    }
    // validate email
    let reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    if (reg.test(user.email) == false) {
        alert('Invalid email address, please re-enter');
        return false;
    }
    // validate phone number
    reg = /^[\+]?[(]?[2-9]{1}\d{2}[)]?[-\s\.]?[2-9]{1}\d{2}[-\s\.]?[0-9]{4,6}$/im
    if (reg.test(user.phone) == false) {
        alert('Invalid phone number, please re-enter');
        return false;
    }
    // all done
    return true;
}