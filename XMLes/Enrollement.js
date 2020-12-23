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
            let poggers = 0;
            for(let iccr = 0; iccr < DownlineIDsss.length; iccr++){
                let AssosiateIDs = DownlineIDsss[iccr];
                $(function() {
                    let params = {
                        // Request parameters
                    };

                    $.ajax({
                        url: "https://vast-hamlet-17171.herokuapp.com/https://dsapi.directscale.com/v1/customers/" + AssosiateIDs + "?" + $.param(params),
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
                            if (data.EnrollerId == paramsID){
                                poggers++;
                            }
                            console.log("PoggerNum: " + poggers);
                        })
                        .fail(function() {
                            alert("error");
                        });
                });

            }
            console.log("Final: " + poggers);
        })
        .fail(function() {
            console.log("error");
        });


});
