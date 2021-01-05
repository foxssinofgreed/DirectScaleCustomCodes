/* This code multiplies each value in rank information widget's card pop-up for Austalian Users */
if( document.readyState !== 'loading' ) {
// DO NOT DELETE OR PUBLISH THIS SCRIPT
// MAIN INTERVAL
    var temp0 = 0;
    var temp1 = 0;
    var intervalForZero = setInterval(startForZero, 503);
    function startForZero() {
        if( location.href === "https://office2.businessbombshells.team/app.html#/Home" && temp0 === 0){
            startForFunctionOne(); //main function on MultiplyValueForRankInformationWidget
            temp0 = 1;
            //console.log('Calling 1')
        }
        if(( location.href === 'https://office2.businessbombshells.team/app.html#/ReportCenter/View/LineOverview' || location.href === "https://office2.businessbombshells.team/app.html#/ReportCenter/View/TeamBreakdownbyPosition" || location.href === "https://office2.businessbombshells.team/app.html#/ReportCenter/View/TeamOverview") && temp1 === 0){
            setTimeout(() => {
                startForFunctionTwo(); //main function on ReportCenterCurrencyChangeAU
            }, 2000);
            temp1 = 1;
            //console.log('Calling 2')
        }//console.log('Main Interval Is working')
    }
    function startForFunctionOne(){
        MyFunctionsmw = {
            onlyP: function(){
                if ($("body > div.ds-flipper__modals.ds-flipper__modals--active > div > div.card.card--dark.ds-flipper__back > div.card-body.card_flipper_scroll > div > span:nth-child(2) > p > span.no-wrap-word > span")[0].innerHTML.match(/\d+/g).length == 3){
                    var a = ($("body > div.ds-flipper__modals.ds-flipper__modals--active > div > div.card.card--dark.ds-flipper__back > div.card-body.card_flipper_scroll > div > span:nth-child(2) > p > span.no-wrap-word > span")[0].innerHTML.match(/\d+/g)[0] + $("body > div.ds-flipper__modals.ds-flipper__modals--active > div > div.card.card--dark.ds-flipper__back > div.card-body.card_flipper_scroll > div > span:nth-child(2) > p > span.no-wrap-word > span")[0].innerHTML.match(/\d+/g)[1]) * 0.2;
                    var b = " / ";
                    var c = math.multiply($("body > div.ds-flipper__modals.ds-flipper__modals--active > div > div.card.card--dark.ds-flipper__back > div.card-body.card_flipper_scroll > div > span:nth-child(2) > p > span.no-wrap-word > span")[0].innerHTML.match(/\d+/g)[2] , 1.2).toFixed(1);
                    $('.m-l-10.ng-binding.ng-scope')[0].innerHTML = a + b + c;
                }
                else{
                    var a2 = math.multiply($("body > div.ds-flipper__modals.ds-flipper__modals--active > div > div.card.card--dark.ds-flipper__back > div.card-body.card_flipper_scroll > div > span:nth-child(2) > p > span.no-wrap-word > span")[0].innerHTML.match(/\d+/g)[0], 1.2).toFixed(1);
                    var b2 = " / ";
                    var c2 = math.multiply($("body > div.ds-flipper__modals.ds-flipper__modals--active > div > div.card.card--dark.ds-flipper__back > div.card-body.card_flipper_scroll > div > span:nth-child(2) > p > span.no-wrap-word > span")[0].innerHTML.match(/\d+/g)[1], 1.2).toFixed(1);
                    $('.m-l-10.ng-binding.ng-scope')[0].innerHTML = a2 + b2 + c2;
                }
            },
            both: function(){
                if ($("body > div.ds-flipper__modals.ds-flipper__modals--active > div > div.card.card--dark.ds-flipper__back > div.card-body.card_flipper_scroll > div > span:nth-child(3) > p > span.no-wrap-word > span")[0].innerHTML.match(/\d+/g).length == 3){
                    var a3 = ($("body > div.ds-flipper__modals.ds-flipper__modals--active > div > div.card.card--dark.ds-flipper__back > div.card-body.card_flipper_scroll > div > span:nth-child(3) > p > span.no-wrap-word > span")[0].innerHTML.match(/\d+/g)[0] + $("body > div.ds-flipper__modals.ds-flipper__modals--active > div > div.card.card--dark.ds-flipper__back > div.card-body.card_flipper_scroll > div > span:nth-child(3) > p > span.no-wrap-word > span")[0].innerHTML.match(/\d+/g)[1]) * 0.2;
                    var b3 = " / ";
                    var c3 = math.multiply($("body > div.ds-flipper__modals.ds-flipper__modals--active > div > div.card.card--dark.ds-flipper__back > div.card-body.card_flipper_scroll > div > span:nth-child(3) > p > span.no-wrap-word > span")[0].innerHTML.match(/\d+/g)[2], 1.2).toFixed(1);
                    $('.m-l-10.ng-binding.ng-scope')[1].innerHTML = a3 + b3 + c3;
                }
                else {
                    var a4 = math.multiply($("body > div.ds-flipper__modals.ds-flipper__modals--active > div > div.card.card--dark.ds-flipper__back > div.card-body.card_flipper_scroll > div > span:nth-child(3) > p > span.no-wrap-word > span")[0].innerHTML.match(/\d+/g)[0], 1.2).toFixed(1);
                    var b4 = " / ";
                    var c4 = math.multiply($("body > div.ds-flipper__modals.ds-flipper__modals--active > div > div.card.card--dark.ds-flipper__back > div.card-body.card_flipper_scroll > div > span:nth-child(3) > p > span.no-wrap-word > span")[0].innerHTML.match(/\d+/g)[1], 1.2).toFixed(1);
                    $('.m-l-10.ng-binding.ng-scope')[1].innerHTML = a4 + b4 + c4;
                }

            }
        }

        var intervalOne = setInterval(startOne, 203);
        function startOne() {
            if($('.ds-flipper__modals.ds-flipper__modals--active').length == 1){
                mainOne();
                clearInterval(intervalOne);
            }
            //console.log('Working Int 1, waiting for pop-up to open');
        }

        var intervalTwo = setInterval(startTwo, 213);
        clearInterval(intervalTwo);
        //console.log('FirstClearing');
        function startTwo() {
            if($('.ds-flipper__modals.ds-flipper__modals--active').length == 0){
                intervalOne = setInterval(startOne, 203);
                clearInterval(intervalTwo);
                //console.log('Calling Int1');
            }
            //console.log('Working Int 2, waiting for pop-up to close');
        }

        function mainOne() {
            intervalTwo = setInterval(startTwo, 213);
            var intervalMult = setInterval(startMult, 33);
            function startMult() {
                if ($("body > div.ds-flipper__modals.ds-flipper__modals--active > div > div.card.card--dark.ds-flipper__back > div.card-body.card_flipper_scroll > div > span:nth-child(1)")[0] != null && $("body > div.ds-flipper__modals.ds-flipper__modals--active > div > div.card.card--dark.ds-flipper__back > div.card-body.card_flipper_scroll > div > span:nth-child(2)")[0] != null && $("body > div.ds-flipper__modals.ds-flipper__modals--active > div > div.card.card--dark.ds-flipper__back > div.card-body.card_flipper_scroll > div > span:nth-child(3)")[0] == null){
                    MyFunctionsmw.onlyP();
                    clearInterval(intervalMult);
                    //console.log('Multiplication is done on PS, Calling Int2');
                }
                if ($("body > div.ds-flipper__modals.ds-flipper__modals--active > div > div.card.card--dark.ds-flipper__back > div.card-body.card_flipper_scroll > div > span:nth-child(1)")[0] != null && $("body > div.ds-flipper__modals.ds-flipper__modals--active > div > div.card.card--dark.ds-flipper__back > div.card-body.card_flipper_scroll > div > span:nth-child(2)")[0] != null && $("body > div.ds-flipper__modals.ds-flipper__modals--active > div > div.card.card--dark.ds-flipper__back > div.card-body.card_flipper_scroll > div > span:nth-child(3)")[0] != null){
                    setTimeout(() => {
                        MyFunctionsmw.onlyP();
                        clearInterval(intervalMult);
                    }, 10);
                    MyFunctionsmw.both();
                    clearInterval(intervalMult);
                    //console.log('Multiplication is done on both, Calling Int2');
                }
                if ($("body > div.ds-flipper__modals.ds-flipper__modals--active > div > div.card.card--dark.ds-flipper__back > div.card-body.card_flipper_scroll > div > span:nth-child(1)")[0] != null && $("body > div.ds-flipper__modals.ds-flipper__modals--active > div > div.card.card--dark.ds-flipper__back > div.card-body.card_flipper_scroll > div > span:nth-child(2)")[0] == null && $("body > div.ds-flipper__modals.ds-flipper__modals--active > div > div.card.card--dark.ds-flipper__back > div.card-body.card_flipper_scroll > div > span:nth-child(3)")[0] == null){
                    clearInterval(intervalMult);
                    //console.log('Nothing to Multiply, Calling Int2');
                }
            }
        }
    }
}