$(document).ready(function(){
    $(".comment-btn").on("click", function(){
        var id = $(this).data("id")
        $(".modal").attr("modal", id)
        $(".comment-text").attr("id", id)
        $(".save-btn").attr("id", id)
        $(".modal-title").text("Comments for " + id)
        $.ajax({
            method: "GET",
            url:"/article/" + id
        })
        .then(function(data){
           var comment = data.comment;
           console.log(comment)
            for(var i = 0; i < comment.length; i++){
                $(".comment-section").append("<div>" + comment[i].body + "<button data-comment=" + comment[i]._id + " class='delete-comment'>&times;</button></div>")
            }
           $('[modal= "'+ id +'"]').modal('toggle'); 
        })

    });
    $(".save-btn").on("click", function(){

        var comment = $('.comment-text').val()
        console.log(comment)

        var id = $(this).attr("id");
        $.ajax({
            method: "POST",
            url: "/article/" + id,
            data: {body: comment}
        })
        .then(function(){
            console.log("Comment Added");
            $(".comment-text").empty()
            location.reload();
        })
    });

    $("#scrape-btn").on("click", function(){
        $.ajax({
            method: "GET",
            url: "/scrape"
          }).then(function(){
            console.log("Articles Scraped");
            location.reload()
          })
    })

})

$(document).on("click",".delete-comment", function(){
        var id = $(this).data("comment");
        $.ajax({
            method:"DELETE",
            url: "/article/" + id
        })
        .then(function(){
            console.log("Comment deleted");
            $(".modal").modal("hide");
            location.reload()
        })
})