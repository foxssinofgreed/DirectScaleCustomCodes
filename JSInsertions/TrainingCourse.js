$(document).ready(function(){
    let LinkCurrentPKPKPK = window.location.href;
    let TestVar = $(window).width();
    if(TestVar >= 700){
        $('.content__circlesdetails .m-secondary-sidebar').css('max-width', '80%');
    }
    else{
        $('.content__circlesdetails .m-secondary-sidebar').css('max-width', '100%');
    }
    /*
    function makefuncwork(){
        console.log('I am working');
    }

    if(LinkCurrentPKPKPK === "https://office2.businessbombshells.team/app.html#/CirclesDetails"){
        ChangeFormatTrainingCourse();
    }*/
});