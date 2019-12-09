/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// clickRemove
// component that fades out and removes itself on click
const ClickRemove = Component.ClickRemove = function()
{
    // event
    ael(this,'click',function() {
        $(this).fadeOut('slow',function() {
            $(this).remove();
        });
    });
    
    return this;
}