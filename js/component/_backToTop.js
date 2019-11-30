/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// backToTop
// script for a component which brings back to the top of the page
quid.component.backToTop = function()
{
    quid.component.scrollChange.call(this);
    
    $(this).on('click', function(event) {
        $("html,body").stop(true,true).animate({scrollTop: 0}, 500);
    })
    .on('backToTop:show', function(event) {
        $(this).addClass('active');
    })
    .on('backToTop:hide', function(event) {
        $(this).removeClass('active');
    })
    .on('scroll:change', function(event) {
        var scrollTop = $(window).scrollTop();
        $(this).trigger((scrollTop === 0)? 'backToTop:hide':'backToTop:show');
    })
    .trigger('scroll:change');
    
    return this;
}