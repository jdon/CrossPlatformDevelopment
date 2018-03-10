// use when testing phone gap as will not get fired in browser
document.addEventListener("deviceready", setup, false);
lookupURL = "http://svcs.ebay.com/services/search/FindingService/v1?" +
            "OPERATION-NAME=findItemsByKeywords&" +
            "SERVICE-NAME=FindingService&" +
            "SERVICE-VERSION=1.0.0&" +
            "GLOBAL-ID=EBAY-GB&" +
            "SECURITY-APPNAME=" + "Jonathan-studentP-PRD-a5d8a3c47-37a93118" + "&" +
            "RESPONSE-DATA-FORMAT=JSON&" +
            "sortOrder=PricePlusShippingLowest&" +
            "outputSelector=PictureURLSuperSize&" +
"keywords=";

function alertDismissed() {
    // do something
}

function setup() {
    //navigator.notification.alert(
    //    'You are the winner!',
    //    alertDismissed,
    //    'Game Over',
    //    'Done'
    //);
};
function scanBCode()
{
    cordova.plugins.barcodeScanner.scan(
        function (result) {
          LookupProduct(result.text);
        },
        function (error) {
          alert("Scanning failed: " + error);
        },
        {
          preferFrontCamera : false, // iOS and Android
          showFlipCameraButton : false, // iOS and Android
          showTorchButton : true, // iOS and Android
          torchOn: false, // Android, launch with the torch switched on (if available)
          saveHistory: false, // Android, save scan history (default false)
          prompt : "Place a barcode inside the scan area", // Android
          resultDisplayDuration: 0, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
          formats : "EAN_8,EAN_13", // default: all but PDF_417 and RSS_EXPANDED
          orientation : "landscape", // Android only (portrait|landscape), default unset so it rotates with the device
          disableAnimations : true, // iOS
          disableSuccessBeep: false // iOS and Android
        }
    );
}
function LookupProduct(EAN)
{
    url = lookupURL + EAN
    $.getJSON(url).success(function(result)
    {
        $.each(result, function(i, field){
            data = field;
            stat = data[0].ack[0];
            if(stat != null){
                if(stat == "Success"){
                    if(data[0].searchResult[0].item != null){
                        items = data[0].searchResult[0].item;
                        for(i = 0; i < items.length;i++)
                        {
                            item = items[i];
                            title = item.title[0];
                            pictureURL = item.pictureURLSuperSize[0];
                            
                            $('#ProductList ul').append(
                            '<li class="ui-li-static ui-body-inherit ui-li-has-thumb">'+
                            '<img src="'+pictureURL+'">'+
                            '<h2>'+title+'</h2>'+
                            '<p>Broken Bells</p>'+
                            '</li>'
                            );
                        }
                        //scroll to bottom of page
                        $("html, body").animate({ scrollTop: $(document).height() }, "slow");
                    }else
                    {
                        alert("Could not find product")
                    }
                }
            }else
            {
                alert("Unable to connect")
            }
        });
    }).error(function(jqXhr, textStatus, error)
    {
        alert('error')
    })
}