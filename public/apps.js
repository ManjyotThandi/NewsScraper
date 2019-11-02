console.log("LOLOLOL")
$(document).on("click","p", function(){
    console.log("LOOOL")
    $("#notes").empty();
    var thisId = $(this).attr("data-id")

    // Make an ajax request for article using ID attr
    $.ajax({
        method: "GET",
        url: "/articles/" + thisId
    }).then(function(data){
        console.log("We finished" + data)
    })
})

// this is to post a comment
$(document).on("click","#savenote", function(){
    var thisId = $(this).attr("data-id");
    $.ajax({
        method: "POST",
        url: "/articles/" + thisId,
        data: {
          // Value taken from title input
          title: $("#titleinput").val(),
          // Value taken from note textarea
          body: $("#bodyinput").val()
        }
      })
        // With that done
        .then(function(data) {
          // Log the response
          console.log(data);
          // Empty the notes section
          $("#notes").empty();
        });
    
      // Also, remove the values entered in the input and textarea for note entry
      $("#titleinput").val("");
      $("#bodyinput").val("");
    });