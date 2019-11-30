/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// resizeChange
// permet de notifier une ou plusieurs nodes du redimensionnement de l'écran
Quid.Component.resizeChange = function(persistent)
{
    var $this = $(this);
    var type = (persistent === true)? 'resize':'resize.document-mount';
    $(window).on(type, function(event) {
        event.stopPropagation();
        $this.trigger('resize:change');
    });
    
    return this;
}