/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// scrollChange
// permet de notifier une node du changement de scroll
quid.component.scrollChange = function(persistent)
{
    var $this = $(this);
    var type = (persistent === true)? 'scroll':'scroll.document-mount';
    $(window).on(type, function(event) {
        event.stopPropagation();
        $this.trigger('scroll:change');
    });
    
    return this;
}