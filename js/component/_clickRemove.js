/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// clickRemove
// sur click, fadeOut l'élément et ensuite efface le
Component.clickRemove = function()
{
    $(this).on('click', function(event) {
        $(this).fadeOut('slow',function() {
            $(this).remove();
        });
    });
    
    return this;
}