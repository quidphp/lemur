/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// backToTop
// script for a component which brings back to the top of the page
Component.backToTop = function()
{
    Component.scrollChange.call(this);
    
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
        const scrollTop = $(window).scrollTop();
        triggerCustom(this,(scrollTop === 0)? 'backToTop:hide':'backToTop:show');
    })
    .trigger('scroll:change');
    
    return this;
}