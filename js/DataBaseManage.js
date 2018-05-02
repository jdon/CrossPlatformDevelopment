var db = null;


var Table_Items = "items";
var Item_id = "_id";
var ItemName = "itemname";
var ItemDescription = "description";
var ItemImageName = "ItemImageName";
var LowestPrice = "LowestPrice";
var AveragePrice = "AveragePrice";
var ItemSearchURL = "ItemSearchURL";
var GPSForeignKEY = "GPSForeignKEY";
var Table_GPS = "GPS";
var GPS_id = "GPS_id";
var GPSLAT = "GPSLAT";
var GPSLONG = "GPSLONG";
var PostCode = "PostCode";
var DB_Version = 14;
var DB_Name = "items.db";

function setupDB()
{
    db = window.sqlitePlugin.openDatabase({
        name: 'itemDB.db',
        location: 'default',
        androidDatabaseImplementation: 2
    });
}
function createDB()
{
    var CreateItemTable = "CREATE TABLE IF NOT EXISTS" + Table_Items + "(" +
    Item_id + " INTEGER PRIMARY KEY AUTOINCREMENT, " +
    ItemName + " TEXT, " +
    ItemDescription + " TEXT, " +
    ItemImageName + " TEXT, " +
    LowestPrice + " TEXT, " +
    AveragePrice + " TEXT, " +
    ItemSearchURL + " TEXT, " +
    GPSForeignKEY + " INTEGER FOREIGNKEY" +
    ");";

    var CreateGPSTable = "CREATE TABLE IF NOT EXISTS" + Table_GPS + "(" +
    GPS_id + " INTEGER PRIMARY KEY AUTOINCREMENT, " +
    GPSLAT + " TEXT, " +
    GPSLONG + " TEXT, " +
    PostCode + " TEXT " +
    ");";
    db.transaction(function(tx) {
        tx.executeSql(CreateItemTable);
        tx.executeSql(CreateGPSTable);
        tx.executeSql('INSERT INTO DemoTable VALUES (?,?)', ['Betty', 202]);
    }, function(error) {
        console.log('Transaction ERROR: ' + error.message);
    }, function() {
        console.log('Populated database OK');
    });
}