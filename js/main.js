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
var db = null;

var storage;

function alertDismissed() {
    // do something
}

function setup() {
    // load local storage and throw stuff on screen
    setupDB();
    storage = window.localStorage;
    value = JSON.parse(storage.getItem("Items")); // Pass a key name to get its value.
    //storage.removeItem("Items");
    if (value != null)
    {
        for(i = 0; i < value.length;i++)
        {
            showItem(i,0);
            //break so it only adds one item.
        }
    }
    //alert("Device Ready");
}

function showItem(ID,type){
    //alert(ID);
    items = JSON.parse(storage.getItem("Items"));
    //alert(items);
    item = items[ID];
    //alert(item);
    title = item.title[0];
    pictureURL = item.pictureURLSuperSize[0];
    if(type == 0)
    {
        //alert("adding Item");
        //home page
        $('#ProductList ul').append(
        '<li class="ui-li-has-thumb">'+
        '<a class="ui-btn ui-btn-icon-right ui-icon-carat-r" href="#item" onclick="setID('+ID+')">'+
        '<img src="'+pictureURL+'">'+
        '<h2>'+title+'</h2>'+
        '<p>Broken Bells</p>'+
        '</a>'+
        '</li>'
        );
    }else
    {
        //Item page
        $("#ItemPic").replaceWith('<img src="'+pictureURL+'"/>');
        $("#ItemName").replaceWith( "<p>"+title+"</p>" );
        $("#ItemDescription").replaceWith( "<p>"+"Drink"+"</p>" );
        $("#ItemPrice").replaceWith( "<p>"+"£69"+"</p>" );
    }
}

function addItem(tesd)
{
    var value = storage.getItem("Items"); // Pass a key name to get its value.
    //alert("Adding Item");
    ID = 0;
    if(value == null || value == undefined)
    {
        alert("First");
        // no values so make layout
        var array = [];
        array.push(tesd);
        ite = JSON.stringify(array);
        storage.setItem("Items", ite);
        
        //alert("Added 1 item" + ite);
    }else
    {
        //alert("Second");
        ite = JSON.parse(value);
        ID = ite.length;
        ite.push(tesd);
        item = JSON.stringify(ite);
        storage.setItem("Items", item);;
        //alert("Added 2 item" + item);
    }
    showItem(ID,0);
};

function scanBCode()
{
    cordova.plugins.barcodeScanner.scan(
        function (result) {
          if(result != null)
          {
            LookupProduct(result.text);
          }
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
};
function LookupProduct(EAN)
{
    url = lookupURL + EAN;
    $.getJSON(url).success(function(result)
    {
        $.each(result, function(i, field){
            data = field;
            stat = data[0].ack[0];
            if(stat != null){
                if(stat == "Success"){
                    if(data[0].searchResult[0].item != null){
                        items = data[0].searchResult[0].item;
                        tesd = items[0];
                        addItem(tesd);
                        for(i = 0; i < items.length;i++)
                        {
                            //break so it only adds one item.
                            break;
                        }
                        //scroll to bottom of page
                        $("html, body").animate({ scrollTop: $(document).height() }, "slow");
                    }else
                    {
                        alert("Could not find product");
                    }
                }else
                {
                    alert("Search unsucessful");
                }
            }else
            {
                alert("Unable to connect");
            }
        });
    }).error(function(jqXhr, textStatus, error)
    {
        alert(textStatus);
    })
}