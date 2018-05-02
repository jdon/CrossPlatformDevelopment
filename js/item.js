var currentItem;
function setID(ID,el)
{
    console.log("testiad");
    if(imageClicked)
    {
        console.log("Image Clicked");
        imageClicked = false;
    }else
        {
            console.log($(el).attr('id'));
            //window.open("#item");
            currentItem = ID;
            document.location="index.html#item";
            showItem(ID,1);
            //alert(ID);
        }

}
$( "a" ).on( "click", function( event ) {

    console.log("clicked");
    // Prevent the usual navigation behavior
    event.preventDefault();

    // Alter the url according to the anchor's href attribute, and
    // store the data-foo attribute information with the url
    $.mobile.navigate( this.attr( "href" ), { foo: this.attr( "data-foo" ) });

    // Hypothetical content alteration based on the url. E.g, make
    // an ajax request for JSON data and render a template into the page.
    alterContent( this.attr( "href" ) );
});
