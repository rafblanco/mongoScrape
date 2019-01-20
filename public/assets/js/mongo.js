$(document).ready(function(){
    $(".comment-btn").on("click", function(){
        var id = this.data("id");
        
        // $.get("/article/:" + id, function(data){

        // })
    });
    $(".save-btn").on("click", function(){
        var comment = $(".comment-text").val()
        var id;
        $.post("/article/:" +id, {
            data: comment
        }).then(function(){
            console.log("Comment Added");
            location.reload();
        })
    });

})