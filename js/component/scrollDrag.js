/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// scrollDrag
// component to allow scrolling while dragging with the mouse
const ScrollDrag = Component.ScrollDrag = function(option) 
{    
    // option
    const $option = Pojo.replace({
        selector: null,
        targetTag: null,
        dividor: 4
    },option);
    
    
    // components
    Component.ResizeChange.call(this);
    
    
    // handler
    setHdlrs(this,'scrollDrag:',{
        can: function() {
            return ($(this).attr('data-grabbable') == 1)? true:false;
        },
        
        required: function() {
            const children = trigHdlr(this,'scrollDrag:getChildren');
            return (($(children).width() - $(this).width()) > 0)? true:false;
        },
        
        getChildren: function() {
            return $(this).children(":visible").get(0);
        },
        
        refresh: function() {
            if(trigHdlr(this,'scrollDrag:required'))
            $(this).attr('data-grabbable',1);
            else
            $(this).attr('data-grabbable',0);
        },
        
        stop: function() {
            $(this).data('scrollDrag-cursorDown',false);
            $(this).attr('data-status','ready');
        }
    });
    
    
    // event
    ael(this,'resize:change',function() {
        trigHdlr(this,'scrollDrag:refresh');
    });
    
    
    // delegate
    aelDelegate(this,'mousemove',$option.selector,function(event) {
        const delegate = event.delegateTarget;
        
        if($(delegate).data('scrollDrag-cursorDown') === true)
        {
            const delY = $(delegate).data('scrollDrag-cursorPositionY');
            const delX = $(delegate).data('scrollDrag-cursorPositionX');
            const delTop = $(delegate).scrollTop();
            const delLeft = $(delegate).scrollLeft();
            const newY = ((delY - event.pageY) / $option.dividor);
            const newX = ((delX - event.pageX) / $option.dividor);
            $(delegate).scrollTop(delTop + newY); 
            $(delegate).scrollLeft(delLeft + newX);
        }
    });
    
    aelDelegate(this,'mousedown',$option.selector,function(event) {
        const delegate = event.delegateTarget;
        const target = event.target;
        
        if(trigHdlr(delegate,'scrollDrag:can') && trigHdlr(delegate,'scrollDrag:required') && event.which === 1)
        {
            if($option.targetTag == null || Dom.isTag($option.targetTag,target))
            {
                $(delegate).data('scrollDrag-cursorDown',true);
                $(delegate).data('scrollDrag-cursorPositionY',event.pageY);
                $(delegate).data('scrollDrag-cursorPositionX',event.pageX);
                $(delegate).attr('data-status','grabbing');
            }
        }
    });
    
    aelDelegate(this,'mouseup',$option.selector,function(event) {
        const delegate = event.delegateTarget;
        trigHdlr(delegate,'scrollDrag:stop');
    });
    
    aelDelegate(this,'mouseout',$option.selector,function(event) {
        event.stopPropagation();
    })
    
    
    // setup
    aelOnce(this,'component:setup',function() {
        const $this = this;
        
        $(this).data('scrollDrag-cursorDown',false);
        $(this).data('scrollDrag-cursorPositionY',0);
        $(this).data('scrollDrag-cursorPositionX',0);
        trigHdlr(this,'scrollDrag:refresh');
        
        bindDocument.call(this);
    });
    
    
    // bindDocument
    const bindDocument = function()
    {
        const $this = this;
        
        // document
        const handler = ael(document,'mouseout',function() {
            trigHdlr($this,'scrollDrag:stop');
        });
        
        aelOnce(document,'doc:unmountPage',function() {
            rel(document,handler);
        });
    }
    
    return this;
}