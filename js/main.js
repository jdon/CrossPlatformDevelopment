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

var storage;
var imageClicked = false;

var currentLocation = null;
var latlng = {lat: parseFloat(0), lng: parseFloat(0)};

function setup() {
    // load local storage and throw stuff on screen
    storage = window.localStorage;
    value = JSON.parse(storage.getItem("Items")); // Pass a key name to get its value.
    enableLoc = storage.getItem("EnabledLocation"); // Pass a key name to get its value.
    if(enableLoc == null)
    {
        //location has not been enabled so asked do they want it
        //navigator.notification.confirm("Would you like to use location data?", getLocation());
        getLocation();
    }
    if(enableLoc)
    {
        //it's enabled so get location
        getLocation();
    }
    //storage.removeItem("Items");
    if (value != null)
    {
        for(i = 0; i < value.length;i++)
        {
            showItem(i,0);
        }
    }
    if (window.navigator.offLine) {
        alert("Please enable internet access to get the best functionality")
    }
    $("#ProductList ul").on("taphold", function (event) {
        var eventID = $(event.target).prop("id");
        $("#"+eventID+" img").attr("src","assets/thumbnails/bin.png");
    });
    $('img').on("click",function (event) {
        var id = $(event.target).prop("id");
        var src = $(event.target).prop("src");
        var Filename= src.split('/').pop()
        if(Filename == "bin.png")
        {
            //delete the item
            $('#'+id+'').remove();
            removeItem(id);
        }
    })
    StatusBar.overlaysWebView(false);
    StatusBar.backgroundColorByHexString("#E9E9E9");
}

function removeItem(id)
{
    item = JSON.parse(storage.getItem("Items"));
    item.splice(id, 1);
    item = JSON.stringify(item);
    storage.setItem("Items", item);
}

function getLocation()
{
    storage.setItem("EnabledLocation",true);
    var onSuccess = function(position) {
        latlng.lat = position.coords.latitude;
        latlng.lng = position.coords.longitude;
        geocodeLatLng();
    };

    // onError Callback receives a PositionError object
    //
    var onError = function(error) {
        alert('code: '    + error.code    + '\n' +
            'message: ' + error.message + '\n');
    }

    navigator.geolocation.getCurrentPosition(onSuccess, onError);
}


function geocodeLatLng() {
    var geocoder = new google.maps.Geocoder;
    geocoder.geocode({'location': latlng}, function(results, status) {
        if (status === 'OK') {
            if (results[0]) {
                currentLocation = results[0].formatted_address;
            } else {
                alert.alert('Could not find address');
            }
        } else {
            alert('Could not find address');
        }
    });
}

function test(ID)
{
    imageClicked = true;
    return false;
}

function initMap(loc) {

    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 17,
        center: loc
    });

    var marker = new google.maps.Marker({
        position: loc,
        map: map,
        title: 'Scan Location'
    });
}


function showItem(ID,type){
    items = JSON.parse(storage.getItem("Items"));
    var item = items[ID];
    var title = item.title;
    var pictureURL = item.PictureURL;
    var Category = item.ItemDescription;
    var AveragePrice = item.AveragePrice;
    var LowestPrice = item.LowestPrice;
    var SearchURL = item.SearchURL;
    var Itemlatlng = item.latlng;
    var ItemcurrentLocation = item.currentLocation;
    if(type == 0)
    {
        //alert("adding Item");
        //home page
        $('#ProductList ul').append(
        '<li class="ui-li-has-thumb" id="'+ID+'">'+
        '<a id="'+ID+'"class="ui-btn ui-btn-icon-right ui-icon-carat-r"  onclick="setID('+ID+',this)">'+
        '<img id="'+ID+'" src="'+pictureURL+'" onclick="test('+ID+')"/>'+
        '<p id="'+ID+'" >'+title+'</p>'+
        '<h4 id="'+ID+'" >£'+AveragePrice+'</h4>'+
        '</a>'+
        '</li>'
        );
    }else
    {
        //Item page
        $("#ItemPic").html('<img src="'+pictureURL+'"/>');
        $("#ItemName").html( "<h5>"+title+"</h5>" );
        $("#ItemDescription").html( "<p><b>Category:      </b>"+Category+"</p>" );
        $("#AveragePrice").html(    "<p><b>Average Price</b>:£"+AveragePrice+"</p>" );
        $("#LowestPrice").html(     "<p><b>Lowest Price</b>: £"+LowestPrice+"</p>" );
        $("#EbayButton").html("<a href=\"#\" onclick=\"window.open('"+SearchURL+"', '_system');\" class=\"ui-btn ui-btn-b ui-shadow ui-corner-all\">View on Ebay</a>");
        if(Itemlatlng.lat != 0)
        {
            $("#Address").html("<p><b> Scan Location: </b>"+ItemcurrentLocation+"</p>" );
            var locString = 'geo:'+Itemlatlng.lat+','+Itemlatlng.lng+'?q='+ItemcurrentLocation;
            initMap(Itemlatlng);
        }
    }
}

function addItem(tesd)
{
    var value = storage.getItem("Items"); // Pass a key name to get its value.
    //alert("Adding Item");
    ID = 0;
    if(value == null || value == undefined)
    {
        // no values so make layout
        var array = [];
        array.push(tesd);
        ite = JSON.stringify(array);
        storage.setItem("Items", ite);
        showItem(ID,0);
        $("html, body").animate({ scrollTop: $(document).height() }, "slow");
        //alert("Added 1 item" + ite);
    }else
    {
        //alert("Second");
        ite = JSON.parse(value);
        for(i = 0; i < ite.length;i++)
        {
            product = ite[i];
            if(product.EAN == tesd.EAN)
            {
                alert("Item already exists!");
                return;
            }
        }
        ID = ite.length;
        ite.push(tesd);
        item = JSON.stringify(ite);
        storage.setItem("Items", item);
        showItem(ID,0);
        $("html, body").animate({ scrollTop: $(document).height() }, "slow");
        //alert("Added 2 item" + item);
    }

};

function scanBCode()
{
    cordova.plugins.barcodeScanner.scan(
        function (result) {
          if(result.text.length >0)
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
                    if(data[0].searchResult.length > 0){
                        if(data[0].searchResult[0].item != null)
                        {
                            var SearchURL = data[0].itemSearchURL[0]
                            var items = data[0].searchResult[0].item;
                            var tesd = items[0];
                            var lowestPrice = 999999999;
                            var totalPrice = 0;
                            var product = new Object();
                            for(i = 0; i < items.length;i++)
                            {
                                item = items[i];
                                title = item.title[0];
                                //try to get a high quality image, if not use a normal image
                                if(item.pictureURLSuperSize == null)
                                {
                                    PictureURL = item.galleryURL[0];
                                }else
                                    {
                                        PictureURL = item.pictureURLSuperSize[0];
                                    }
                                var imageURL = item.galleryURL[0];
                                var sellingStatus = item.sellingStatus[0];
                                var ConvertedPrice = sellingStatus.convertedCurrentPrice[0];
                                var price = ConvertedPrice.__value__;
                                var category = item.primaryCategory[0];
                                var ItemDescription = category.categoryName[0];
                                totalPrice = totalPrice + parseInt(price);
                                if(price*10 < lowestPrice)
                                {
                                    lowestPrice = price;
                                }
                                if(i == 0)
                                {
                                    product.EAN = EAN;
                                    product.title = title;
                                    product.SearchURL = SearchURL;
                                    product.PictureURL = PictureURL;
                                    product.AveragePrice = 0;
                                    product.LowestPrice = 0;
                                    product.Category = category;
                                    product.ItemDescription = ItemDescription;
                                }
                            }
                            product.LowestPrice = lowestPrice;
                            averagePrice = (totalPrice/items.length).toFixed(2);;
                            product.AveragePrice = averagePrice;
                            if(latlng.lat != 0)
                            {
                                product.latlng = latlng;
                            }
                            if(currentLocation != null)
                            {
                                product.currentLocation = currentLocation;
                            }
                            addItem(product);

                            //scroll to bottom of page

                        }else
                            {
                                alert("Could not find product");
                            }
                    }else
                    {
                        alert("Could not find product");
                    }
                }else
                {
                    alert("Could not find product");
                }
            }else
            {
                alert("Unable to connect");
            }
        });
    }).error(function(jqXhr, textStatus, error)
    {
        alert("Unable to connect");
    })
}