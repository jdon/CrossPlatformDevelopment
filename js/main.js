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

function alertDismissed() {
    // do something
}

function setup() {
    // load local storage and throw stuff on screen
    console.log(cordova.file);
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
    console.log(items.length);
    //alert(items);
    var item = items[ID];
    console.log("ID:"+ID);
    console.log("Title:"+item.title);
    //alert(item);
    var title = item.title;
    var pictureURL = item.PictureURL;
    var Category = item.ItemDescription;
    var AveragePrice = item.AveragePrice;
    var LowestPrice = item.LowestPrice;
    var SearchURL = item.SearchURL;
    console.log("search URL"+SearchURL);
    console.log("type:"+type);
    if(type == 0)
    {
        //alert("adding Item");
        //home page
        $('#ProductList ul').append(
        '<li class="ui-li-has-thumb">'+
        '<a class="ui-btn ui-btn-icon-right ui-icon-carat-r" href="#item" onclick="setID('+ID+')">'+
        '<img src="'+pictureURL+'">'+
        '<p>'+title+'</p>'+
        '<h4>£'+AveragePrice+'</h4>'+
        '</a>'+
        '</li>'
        );
    }else
    {
        //Item page
        $("#ItemPic").html('<img src="'+pictureURL+'"/>');
        $("#ItemName").html( "<h5>"+title+"</h5>" );
        $("#ItemDescription").html( "<p>Category:      "+Category+"</p>" );
        $("#AveragePrice").html(    "<p>Average Price:£"+AveragePrice+"</p>" );
        $("#LowestPrice").html(     "<p>Lowest Price: £"+LowestPrice+"</p>" );
        $("#EbayButton").html("<a href=\"#\" onclick=\"window.open('"+SearchURL+"', '_system');\" class=\"ui-btn ui-btn-b ui-shadow ui-corner-all\">View on Ebay</a>");
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
        storage.setItem("Items", item);
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
                                //console.log("Adding items")
                                item = items[i];
                                //console.log(item)
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
                                //console.log("Adding items 2")
                                if(price*10 < lowestPrice)
                                {
                                    console.log("Lowest Price: "+price);
                                    lowestPrice = price;
                                }
                                if(i == 0)
                                {
                                    product.title = title;
                                    product.SearchURL = SearchURL;
                                    product.PictureURL = PictureURL;
                                    product.AveragePrice = 0;
                                    product.LowestPrice = 0;
                                    product.Category = category;
                                    product.ItemDescription = ItemDescription;
                                }
                                //console.log("Adding items 3")
                            }
                            console.log("finished loop")
                            product.LowestPrice = lowestPrice;
                            console.log(totalPrice);
                            averagePrice = (totalPrice/items.length).toFixed(2);;
                            console.log(averagePrice);
                            product.AveragePrice = averagePrice;
                            console.log("calling add Item")
                            addItem(product);

                            //scroll to bottom of page
                            $("html, body").animate({ scrollTop: $(document).height() }, "slow");
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