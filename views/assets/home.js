// client side, when DOM is ready
$(() => {
    // load all users
    requestUsers();

    // submit event handler
    $('#add-submitButton').click(() => {
        let user = {
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
        // find user With user immediately and show on details-page
        findUserWithId(user);
        // view -> reset add-page previous input value
        $('#add-page input').val("");

    })

    // by default -> show home-page
    showHomePage();
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
        dataType: 'json',
    })
    .done(successHandler)
    .fail(errorHandler)
}

function editUser(editedUser) {
    $.ajax({
        type: 'PUT',
        url: `api/user/${editedUser.id}`,
        data: JSON.stringify(editedUser),
        // send data type
        contentType: 'application/json',
        dataType: 'json',
    })
    .done(successHandler)
    .fail(errorHandler)
}

function findUserWithId (user) {
    // get existed data from server side
    $.ajax({
        type: 'POST',
        url: 'api/user/index',
        data: JSON.stringify(user),
        contentType: 'application/json',
        dataType: 'json',
    })
    .done(showDetailPage)
    .fail(errorHandler)
}


function successHandler(users) {
    console.log(`Response has ${users.length} users`)
    if (users.length == 0) {
        var $table = $( "<table border='1'><tr><th>ID</th><th>Name</th><th>Email</th><th>Phone</th></table>" );
    } else {
        var $table = $( "<table border='1'><tr><th>ID</th><th>Name</th><th>Email</th><th>Phone</th><th></th></table>" );
        for ( let index = 0; index < users.length; index++ ) {
            const user = users[index]
            const $line = $( "<tr></tr>" )
            $line.append( $( "<td></td>" ).html( user.id ) )
            $line.append( $( "<td></td>" ).html( user.name ) )
            $line.append( $( "<td></td>" ).html( user.email ) )
            $line.append( $( "<td></td>" ).html( user.phone ) )
            // view -> add three buttons to the last td
            const detailsButton = $( "<button>/button>" ).text('DETAILS');
            const editButton = $( "<button>/button>" ).text('EDIT');
            const deleteButton = $( "<button>/button>" ).text('DELETE');
            $line.append(detailsButton); 
            $line.append(editButton); 
            $line.append(deleteButton); 
            $table.append( $line )

            // model -> details button
            detailsButton.click(() => {
                showDetailPage(users[index]);
            })

            // model -> edit button
            editButton.click(() => {
                showEditPage(users[index]);
            })

            // model -> delete button
            deleteButton.click(() => {
                const choice = confirm("Are you sure to delete this contact member?")
                if (choice == true) {
                    deleteUser(user.id);
                    showHomePage();
                }
            })
        }
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
    $("#edit-page").hide();
}


function showAddPage() {
    $("#home-page").hide();
    $("#add-page").show();
    $("#detail-page").hide();
    $("#edit-page").hide();
}



function showEditPage(user) {

    $('input[name=edit-name]:text').val(`${user.name}`);
    $('input[name=edit-email]:text').val(`${user.email}`);
    $('input[name=edit-phone]:text').val(`${user.phone}`);
    
    $('#edit-page button').remove();
    const submitButton = $("<button></button>").text('Submit');
    $('#edit-page').append(submitButton)
    submitButton.click(() => {
        let editedUser = {
            id: user.id,
            name: $('input[name=edit-name]').val(),
            email: $('input[name=edit-email]').val(),
            phone: $('input[name=edit-phone]').val(),
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
        // if validate
        $('#edit-page button').remove();
        editUser(editedUser);
        showHomePage();
    })

    $("#home-page").hide();
    $("#add-page").hide();
    $("#detail-page").hide();
    $("#edit-page").show();
}


function showDetailPage(user) {
    // empty previous content
    $('#detail-page').empty()

    // if user is not an object but JSON
    if (typeof user !== 'object') {
        // JSON parse it
        user = JSON.parse(user)
    }

    // append info to detail-page
    $('#detail-page').append( $("<h3></h3>").text("Contact") ) 
    $('#detail-page').append( $("<p></p>").text(`Name: ${user.name}`) )
    $('#detail-page').append( $("<p></p>").text(`Email: ${user.email}`) )
    $('#detail-page').append( $("<p></p>").text(`Phone: ${user.phone}`) )

    // add edit button
    const editButton = $("<button></button>").text('EDIT');
    editButton.click(() => { 
        showEditPage(user) 
    });

    $('#detail-page').append(editButton)

    // add delete button
    const deleteButton = $("<button></button>").text('DELETE');
    deleteButton.click(() => {
        const choice = confirm("Are you sure to delete this contact member?")
        if (choice == true) {
            // ---------------- go to server side, find and delete ------------
            deleteUser(user.id);
            showHomePage();
        }
    })
    $('#detail-page').append(deleteButton)

    // change the visibility
    $("#home-page").hide();
    $("#add-page").hide();
    $("#detail-page").show();
    $("#edit-page").hide();
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






