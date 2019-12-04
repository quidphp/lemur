/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// clickRemove
// component that fades out and removes itself on click
const ClickRemove = function()
{
    // nodes
    const $nodes = this;
    
    
    // event
    ael(this,'click',function() {
        $(this).fadeOut('slow',function() {
            $(this).remove();
        });
    });
    
    
    return this;
}

// export
Component.ClickRemove = ClickRemove;