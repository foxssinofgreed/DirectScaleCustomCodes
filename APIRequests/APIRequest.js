const settings = {
    "async": true,
    "crossDomain": true,
    "url": "https://api2.directscale.com/api/Customers/RankQualifications",
    "method": "POST",
    "headers": {
        "Content-Type": "application/json",
        "Referer": "https://office2.businessbombshells.team/app.html",
        "Authorization": "Bearer 3C0eT7chEdM9XRK5-h3F0RDMmAMcBatCav3mSmNjwXzUkKDjt3XYrkXPr9gZOY3YXbDAWWRIkZxLHXoo9NubKSKVw_KIb8UoXEpm0FOibrK0xT31GPTSd8iGNFEKn1RKsCPlkAqDBi-Od9h89NbyxkovkdmFA4kW3P0MzeKk4qvIkxxkJABo5X5f9JYyyPA6ayPzzKscw9PUlZRbSpp8bpt-ixJ6LjuqTyXMPSG44S-BnD_h0FhTOK5W7Z2I1gwzd1kBq4HmqlPuOmsX5TXr4inwPzENF-oSPuoWTVaq7Kgit-0GEqj2idYI7lXEDqg3KQMaDDPUGRNSwRmYNp-pQXjF5S-czTE_f-U6jM5EAR8"
    },
    "processData": false,
    "data": "{\"RankID\":\"130\",\"CustomerID\":208}"
};

$.ajax(settings).done(function (response) {
    console.log(response.Data.PayeeQualificationLegs[0][3].Actual);
});
