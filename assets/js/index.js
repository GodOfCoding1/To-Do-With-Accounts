$("#add_user").submit(function() {
    alert("data given to database succesfully");
});

$("#update_user").submit(function(event) {
    event.preventDefault();
    var data = {};

    var array = $(this).serializeArray();
    $.map(array, function(n, i) {
        data[n["name"]] = n["value"];
    });

    var request = {
        url: `http://localhost:3000/api/users/${data.id}`,
        method: "PUT",
        data: data,
    };

    $.ajax(request).done(function(response) {
        alert("data updated succesfully");
    });
});

if (window.location.pathname == "/") {
    $ondelete = $(".delete_user_Button");
    $ondelete.click(function() {
        var id = $(this).attr("data-id");
        var request = {
            url: `http://localhost:3000/api/users/${id}`,
            method: "DELETE",
        };
        if (confirm("Do u want to delete?")) {
            $.ajax(request).done(function(response) {
                alert("data deleted succesfully");
                location.reload();
            });
        }
    });
}