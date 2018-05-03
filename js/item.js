var currentItem;
function setID(ID,el)
{
    if(imageClicked)
    {
        imageClicked = false;
    }else
        {
            currentItem = ID;
            document.location="index.html#item";
            showItem(ID,1);
        }

}
