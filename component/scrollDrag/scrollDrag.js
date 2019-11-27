"use strict";

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// scrollDrag
// component to allow scrolling while dragging with the mouse
quid.component.scrollDrag = function(option) {
    
    // settings
    var $settings = quid.base.obj.replace({
        selector: null,
        targetTag: null,
        dividor: 4
    },option);
    
    // resizeChange
    quid.main.window.resizeChange.call(this);
    
    // triggerHandler
    $(this).on('scrollDrag:can', function() {
        return ($(this).attr('data-grabbable') == 1)? true:false;
    })
    .on('scrollDrag:required', function() {
        return (($(this).triggerHandler('scrollDrag:getChildren').width() - $(this).width()) > 0)? true:false;
    })
    .on('scrollDrag:getChildren', function() {
        return $(this).children().first();
    })
    
    // trigger
    .on('resize:change', function() {
        $(this).trigger('scrollDrag:refresh');
    })
    .on('scrollDrag:refresh', function() {
        if($(this).triggerHandler('scrollDrag:required'))
        $(this).attr('data-grabbable',1);
        else
        $(this).removeAttr('data-grabbable');
    })
    .on('scrollDrag:stop', function() {
        $(this).data('cursorDown',false);
        $(this).removeAttr('data-status');
    })
    
    // mouse
    .on('mousemove', $settings.selector, function(event) {
        var $this = $(event.delegateTarget);
        if($this.data('cursorDown') === true)
        {
            var newY = (($this.data('cursorPositionY') - event.pageY) / $settings.dividor);
            var newX = (($this.data('cursorPositionX') - event.pageX) / $settings.dividor);
            $this.scrollTop($this.scrollTop() + newY); 
            $this.scrollLeft($this.scrollLeft() + newX);
        }
    })
    .on('mousedown', $settings.selector, function(event) {
        var $this = $(event.delegateTarget);
        if($this.triggerHandler('scrollDrag:can') && $this.triggerHandler('scrollDrag:required') && event.which === 1)
        {
            var target = $(event.target);
            
            if(target.length && ($settings.targetTag == null || target.tagName() === $settings.targetTag))
            {
                $this.data('cursorDown',true);
                $this.data('cursorPositionY',event.pageY);
                $this.data('cursorPositionX',event.pageX);
                $this.attr('data-status','grabbing');
            }
        }
    })
    .on('mouseup', $settings.selector, function(event) {
        var $this = $(event.delegateTarget);
        $this.trigger('scrollDrag:stop');
    })
    .on('mouseout', $settings.selector, function(event) {
        event.stopPropagation();
    })
    
    // setup
    .on('component:setup', function() {
        var $this = $(this);
        $(this).data('cursorDown',false);
        $(this).data('cursorPositionY',0);
        $(this).data('cursorPositionX',0);
        
        $(document).on('mouseout.document-mount', function() {
            $this.trigger('scrollDrag:stop');
        });
        
        $(this).trigger('scrollDrag:refresh');
    });
    
    return this;
}