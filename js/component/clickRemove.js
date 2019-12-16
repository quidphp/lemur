/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// clickRemove
// component that fades out and removes itself on click
Component.ClickRemove = function()
{
    // not empty
    if(Vari.isEmpty(this)) 
    return null;
    
    
    // event
    ael(this,'click',function() {
        $(this).fadeOut('slow',function() {
            $(this).remove();
        });
    });
    
    return this;
}