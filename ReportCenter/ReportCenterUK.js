/* This code adds $ sign to each value and multiplies them by 2 to get Australian dollar currency */
if( document.readyState !== 'loading' ) {
    // DO NOT DELETE OR PUBLISH THIS SCRIPT
    // MAIN INTERVAL
    var temp0 = 0;
    var intervalForZero = setInterval(startForZero, 503);
    function startForZero() {
        if(( location.href === 'https://office2.businessbombshells.team/app.html#/ReportCenter/View/LineOverview' || location.href === "https://office2.businessbombshells.team/app.html#/ReportCenter/View/TeamBreakdownbyPosition" || location.href === "https://office2.businessbombshells.team/app.html#/ReportCenter/View/TeamOverview") && temp0 === 0){
            setTimeout(() => {
                startForFunctionOne(); //main function on ReportCenterCurrencyChangeAU
            }, 2000);
            temp0 = 1;
            //console.log('Calling 1')
        }//console.log('Main Interval Is working')
    }
    function startForFunctionOne(){
        MyFunctions = {
            LOforTS: function () {
                let mainArray = $("#col4.p-r-10.ng-scope t.ng-binding.ng-scope");
                let results = $("div.col-lg-3.col-md-3.col-sm-8.ng-binding.p-t-15")[0].textContent.replace(/\D+/g, "");
                for (let i = 0; i < results; i++) {
                    if (mainArray[i] != null) {
                        mainArray[i].innerHTML = '£' + math.multiply(mainArray[i].innerHTML, 1).toFixed(2);
                    }
                }
            },
            LOforPS: function () {
                let mainArray = $("#col6.p-r-10.ng-scope t.ng-binding.ng-scope");
                let results = $("div.col-lg-3.col-md-3.col-sm-8.ng-binding.p-t-15")[0].textContent.replace(/\D+/g, "");
                for (let i = 0; i < results; i++) {
                    if (mainArray[i] != null) {
                        mainArray[i].innerHTML = '£' + math.multiply(mainArray[i].innerHTML, 1).toFixed(2);
                    }
                }
            },
            LOforNCRV: function () {
                let mainArray = $("#col7.p-r-10.ng-scope t.ng-binding.ng-scope");
                let results = $("div.col-lg-3.col-md-3.col-sm-8.ng-binding.p-t-15")[0].textContent.replace(/\D+/g, "");
                for (let i = 0; i < results; i++) {
                    if (mainArray[i] != null) {
                        mainArray[i].innerHTML = '£' + math.multiply(mainArray[i].innerHTML, 1).toFixed(2);
                    }
                }
            },
            TBBPforTS: function () {
                let mainArray = $("#col5.p-r-10.ng-scope t.ng-binding.ng-scope");
                let results = $("div.col-lg-3.col-md-3.col-sm-8.ng-binding.p-t-15")[0].textContent.replace(/\D+/g, "");
                for (let i = 0; i < results; i++) {
                    if (mainArray[i] != null) {
                        mainArray[i].innerHTML = '£' + math.multiply(mainArray[i].innerHTML, 1).toFixed(2);
                    }
                }
            },
            TBBPforPS: function () {
                let mainArray = $("#col7.p-r-10.ng-scope t.ng-binding.ng-scope");
                let results = $("div.col-lg-3.col-md-3.col-sm-8.ng-binding.p-t-15")[0].textContent.replace(/\D+/g, "");
                for (let i = 0; i < results; i++) {
                    if (mainArray[i] != null) {
                        mainArray[i].innerHTML = '£' + math.multiply(mainArray[i].innerHTML, 1).toFixed(2);
                    }
                }
            },
            TOforPS: function () {
                let mainArray = $("#col5.p-r-10.ng-scope t.ng-binding.ng-scope");
                let results = $("div.col-lg-3.col-md-3.col-sm-8.ng-binding.p-t-15")[0].textContent.replace(/\D+/g, "");
                for (let i = 0; i < results; i++) {
                    if (mainArray[i] != null) {
                        mainArray[i].innerHTML = '£' + math.multiply(mainArray[i].innerHTML, 1).toFixed(2);
                    }
                }
            }
        }
        var urlLO = 'https://office2.businessbombshells.team/app.html#/ReportCenter/View/LineOverview';
        var urlTBBP = 'https://office2.businessbombshells.team/app.html#/ReportCenter/View/TeamBreakdownbyPosition';
        var urlTO = 'https://office2.businessbombshells.team/app.html#/ReportCenter/View/TeamOverview';
        var tableng = 0;
        setTimeout(() => {
            tableng = $("#col4.p-r-10.ng-scope t.ng-binding.ng-scope").length;
        }, 110);
        var CounturlLO = 0;
        var CounturlTBBP = 0;
        var CounturlTO = 0;
        setInterval(function () {
            if (window.location.href === urlLO && tableng !== $("#col4.p-r-10.ng-scope t.ng-binding.ng-scope").length) {
                setTimeout(() => {
                    MyFunctions.LOforTS();
                }, 50);
                setTimeout(() => {
                    MyFunctions.LOforPS();
                    CounturlLO += 1;
                    if (window.location.href === urlLO && CounturlLO > 1) {
                        CounturlLO -= 1;
                    }
                }, 100);
                setTimeout(() => {
                    MyFunctions.LOforNCRV();
                }, 150);
            }
            if (window.location.href === urlTBBP && tableng !== $("#col4.p-r-10.ng-scope t.ng-binding.ng-scope").length) {
                setTimeout(() => {
                    MyFunctions.TBBPforTS();
                }, 50);
                setTimeout(() => {
                    MyFunctions.TBBPforPS();
                    CounturlTBBP += 1;
                    if (window.location.href === urlTBBP && CounturlTBBP > 1) {
                        CounturlTBBP -= 1;
                    }
                }, 100);
            }
            if (window.location.href === urlTO && tableng !== $("#col4.p-r-10.ng-scope t.ng-binding.ng-scope").length) {
                setTimeout(() => {
                    MyFunctions.TOforPS();
                    CounturlTO += 1;
                    if (window.location.href === urlTO && CounturlTO > 1) {
                        CounturlTO -= 1;
                    }
                }, 50);
            }
            tableng = $("#col4.p-r-10.ng-scope t.ng-binding.ng-scope").length;
        }, 100);
    }
}