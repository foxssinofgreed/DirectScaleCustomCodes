$(function() {
    let params = {
        // Request parameters
        "tree": "{}",
        "levels": "{1}",
    };
    let paramsID = $("#AssociateAssociateIDKPI")[0].innerHTML;
    let DownlineIDsss;
    $.ajax({
        url: "https://vast-hamlet-17171.herokuapp.com/https://dsapi.directscale.com/v1/customers/" + paramsID + "/downline?" + $.param(params),
        beforeSend: function(xhrObj){
            // Request headers
            xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key","98b198fed48d4aceb8d362c2c931572d");
            xhrObj.setRequestHeader("Access-Control-Allow-Origin","*");
        },
        type: "GET",
        // Request body
        data: "{body}",
    })
        .done(function(dataLA) {
            DownlineIDsss = dataLA;
            //console.log(DownlineIDsss);
            let MoreNumbers = [];
            let MoreNames = [];
            for(let iccr = 0; iccr < DownlineIDsss.length; iccr++){
                let AssosiateIDs = DownlineIDsss[iccr];
                //console.log(AssosiateIDs);
                $(function() {
                    let params = {
                        // Request parameters
                        "date": new Date().toISOString(),
                    };

                    $.ajax({
                        url: "https://vast-hamlet-17171.herokuapp.com/https://dsapi.directscale.com/v1/customers/"+ AssosiateIDs +"/stats?" + $.param(params),
                        beforeSend: function(xhrObj){
                            // Request headers
                            xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key","98b198fed48d4aceb8d362c2c931572d");
                            xhrObj.setRequestHeader("Access-Control-Allow-Origin","*");
                        },
                        type: "GET",
                        // Request body
                        data: "{body}",
                    })
                        .done(function(data) {
                            if(data.Stats.GVKPI.Value !== 0){
                                MoreNumbers[iccr] = data.Stats.GVKPI.Value;
                                MoreNames[iccr] = data.Name + ': ' + MoreNumbers[iccr];
                                //console.log(MoreNumbers[iccr]);
                            }
                            if(iccr === DownlineIDsss.length - 1){
                                LastHope();
                            }
                        })
                        .fail(function() {
                            console.log("error");
                        });
                });
            }
            function LastHope(){
                /*
                MoreNumbers.sort(function (a, b) {
                    if (a < b) {
                        return 1;
                    } else if (a === b) {
                        return 0;
                    } else {
                        return -1;
                    }
                });
                $('#NumberOneOLeg')[0].innerHTML = $('#NumberOneOLeg')[0].innerHTML + MoreNumbers[0];
                $('#NumberTwoOLeg')[0].innerHTML = $('#NumberTwoOLeg')[0].innerHTML + MoreNumbers[1];
                $('#NumberThreeOLeg')[0].innerHTML = $('#NumberThreeOLeg')[0].innerHTML + MoreNumbers[2];
                */
                function Sortooo(a, b){
                    let parts = {
                        a: a.split(': '),
                        b: b.split(': ')
                    }
                    return parseFloat(parts.b[1]) - parseFloat(parts.a[1]);
                }
                MoreNames.sort(Sortooo);
                $('#NumberOneOLeg')[0].innerHTML = $('#NumberOneOLeg')[0].innerHTML + MoreNames[0];
                $('#NumberTwoOLeg')[0].innerHTML = $('#NumberTwoOLeg')[0].innerHTML + MoreNames[1];
                $('#NumberThreeOLeg')[0].innerHTML = $('#NumberThreeOLeg')[0].innerHTML + MoreNames[2];
                console.log(MoreNames);
            }

        })
        .fail(function() {
            console.log("error");
        });


});