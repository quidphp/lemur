/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// scrollDrag
// component to allow scrolling while dragging with the mouse
const ScrollDrag = Component.ScrollDrag = function(option) 
{    
    /*
    // settings
    const $option = Pojo.replace({
        selector: null,
        targetTag: null,
        dividor: 4
    },option);
    
    // resizeChange
    Component.resizeChange.call(this);
    
    // triggerHandler
    $(this).on('scrollDrag:can',function() {
        return ($(this).attr('data-grabbable') == 1)? true:false;
    })
    .on('scrollDrag:required',function() {
        return ((trigHandler(this,'scrollDrag:getChildren').width() - $(this).width()) > 0)? true:false;
    })
    .on('scrollDrag:getChildren',function() {
        return $(this).children().get(0);
    })
    
    // trigger
    .on('resize:change',function() {
        trigEvt(this,'scrollDrag:refresh');
    })
    .on('scrollDrag:refresh',function() {
        if(trigHandler(this,'scrollDrag:required'))
        $(this).attr('data-grabbable',1);
        else
        $(this).removeAttr('data-grabbable');
    })
    .on('scrollDrag:stop',function() {
        $(this).data('cursorDown',false);
        $(this).removeAttr('data-status');
    })
    
    // mouse
    .on('mousemove', $option.selector,function(event) {
        const $this = $(event.delegateTarget);
        if($this.data('cursorDown') === true)
        {
            const newY = (($this.data('cursorPositionY') - event.pageY) / $option.dividor);
            const newX = (($this.data('cursorPositionX') - event.pageX) / $option.dividor);
            $this.scrollTop($this.scrollTop() + newY); 
            $this.scrollLeft($this.scrollLeft() + newX);
        }
    })
    .on('mousedown', $option.selector,function(event) {
        const $this = $(event.delegateTarget);
        if($this.trigHandler('scrollDrag:can') && $this.trigHandler('scrollDrag:required') && event.which === 1)
        {
            const target = $(event.target);
            
            if(target.length && ($option.targetTag == null || Dom.isTag($option.targetTag,target)))
            {
                $this.data('cursorDown',true);
                $this.data('cursorPositionY',event.pageY);
                $this.data('cursorPositionX',event.pageX);
                $this.attr('data-status','grabbing');
            }
        }
    })
    .on('mouseup', $option.selector,function(event) {
        const $this = $(event.delegateTarget);
        trigEvt($this,'scrollDrag:stop');
    })
    .on('mouseout', $option.selector,function(event) {
        event.stopPropagation();
    })
    
    // setup
    .on('component:setup',function() {
        const $this = $(this);
        $(this).data('cursorDown',false);
        $(this).data('cursorPositionY',0);
        $(this).data('cursorPositionX',0);
        
        $(document).on('mouseout.doc-mount',function() {
            trigEvt($this,'scrollDrag:stop');
        });
        
        trigEvt(this,'scrollDrag:refresh');
    });
    */
    
    return this;
}