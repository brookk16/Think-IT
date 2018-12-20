//Hover code was taken and modified from https://jqueryui.com/tooltip/#custom-style

$(function() {
    $(document).mouseover().tooltip({
        position: {
            my: "center top-20",
            at: "center top",
            using: function(position, feedback) {
                $(this).css(position);
                $("<div>")  
                    .addClass("arrow")
                    .addClass(feedback.vertical)
                    .addClass(feedback.horizontal)
                    .appendTo(this);
            }
        }
    });
});
