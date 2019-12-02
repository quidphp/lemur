/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// focusSlide
// permet de slideDown/up une target lors du focus sur une node
Component.focusSlide = function(target) 
{
    if($(this).length === 1 && target instanceof jQuery)
    {
        $(this).on('focus',function() {
            target.slideDown("fast");
        })
        .on('focusout',function() {
            target.slideUp("fast");
        });
    }
    
    return this;
}