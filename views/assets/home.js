// client side
// when DOM is ready
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
        
        // if email is valid
        if (validateEmail(user.email) && validatePhone(user.phone)) {
            // model -> send data to server side
            sendUser(user);
        
            // view -> show confirm-page
            showDetailPage();
        }
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
    }

    $('#table').empty()
    $table.appendTo( $('#table') )
}

function errorHandler(jqXHR, textStatus, error) {
    $('#output').val("textStatus: " + textStatus + ". server error: " + error)
}

function showHomePage() {
    document.getElementById('home-page').style.display = "block";
    document.getElementById('add-page').style.display = "none";
    document.getElementById('detail-page').style.display = "none";
}

function showAddPage() {
    document.getElementById('home-page').style.display = "none";
    document.getElementById('add-page').style.display = "block";
    document.getElementById('detail-page').style.display = "none";
}

function showDetailPage() {
    document.getElementById('home-page').style.display = "none";
    document.getElementById('add-page').style.display = "none";
    document.getElementById('detail-page').style.display = "block";
}

function validateEmail(emailField) {
    let reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;

    if (reg.test(emailField) == false) {
        alert('Invalid email address, please re-enter');
        return false;
    }

    return true;
}

function validatePhone(phoneField) {
    let reg = /^[\+]?[(]?[2-9]{1}\d{2}[)]?[-\s\.]?[2-9]{1}\d{2}[-\s\.]?[0-9]{4,6}$/im

    if (reg.test(phoneField) == false) {
        alert('Invalid phone number, please re-enter');
        return false;
    }

    return true;
}