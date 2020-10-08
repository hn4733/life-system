var mini = true;

$(document).ready(function () {
    $('.sidebar').hover(
        () => {
            $(".sidebar").css("width", "250px");
            $("main").css("margin-left", "250px");
        },
        () => {
            $(".sidebar").css("width", "85px");
            $("main").css("margin-left", "85px");
        }
    )
});