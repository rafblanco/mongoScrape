$(document).ready(function(){
    $(".comment-btn").on("click", function(){
        var id = this.data("id");
        $('[data-modal= "'+id+'"]').modal('toggle');

        // $.get("/article/:" + id, function(data){

        // })
    });
    $(".save-btn").on("click", function(){
        var comment = $(".comment-text").val()
        var id;
        $.post("/article/:" + id, {
            data: comment
        }).then(function(){
            console.log("Comment Added");
            location.reload();
        })
    });
    $(".delete-comment").on("click", function(){
        var id = this.data("comment");
        $.delete("/delete/:" + id)
        .then(function(){
            console.log("Comment deleted")
            location.reload();
        })
    })

})