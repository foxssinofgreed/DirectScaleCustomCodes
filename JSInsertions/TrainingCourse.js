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

if( document.readyState !== 'loading' ) {
    setInterval(function (){
        let LinkCurrentPKPKPK = window.location.href;
        if(LinkCurrentPKPKPK === 'https://office2.businessbombshells.team/app.html#/CirclesDetails'){
            let TestVar = $(window).width();
            if(TestVar >= 700){
                $('.content__circlesdetails .m-secondary-sidebar').css('max-width', '75vw');
                console.log("-- Run Count --");
            }
            else{
                $('.content__circlesdetails .m-secondary-sidebar').css('max-width', '100vw');
            }
        }
    }, 2000);
    setInterval(function (){
        let LinkCurrentPKPKPK = window.location.href;
        if(LinkCurrentPKPKPK === 'https://office2.businessbombshells.team/app.html#/TrainingCourses'){
            $('.actions').css('display', 'none');
            $('.c-black .p-r-15 .ng-binding').css('color', '#FFFFFF');
            $('.c-black .p-r-15 .ng-binding').attr('style', '#ffffff !important');
        }
    }, 2000);
}