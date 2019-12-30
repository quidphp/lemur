/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// scrollDrag
// component to allow scrolling while dragging with the mouse
Component.ScrollDrag = function(option) 
{    
    // not empty
    if(Vari.isEmpty(this)) 
    return null;
    
    
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
            return (getAttr(this,'data-grabbable') == 1)? true:false;
        },
        
        required: function() {
            const children = trigHdlr(this,'scrollDrag:getChildren');
            const dimensionEle = Ele.getDimension(children);
            const dimensionThis = Ele.getDimension(this);
            return ((dimensionEle.width - dimensionThis.width) > 0)? true:false;
        },
        
        getChildren: function() {
            const childs = Nod.children(this);
            return Arr.find(childs,function() {
                return Ele.isVisible(this);
            });
        },
        
        refresh: function() {
            if(trigHdlr(this,'scrollDrag:required'))
            setAttr(this,'data-grabbable',1);
            else
            setAttr(this,'data-grabbable',0);
        },
        
        stop: function() {
            setData(this,'scrollDrag-cursorDown',false);
            setAttr(this,'data-status','ready');
        }
    });
    
    
    // event
    ael(this,'resize:change',function() {
        trigHdlr(this,'scrollDrag:refresh');
    });
    
    
    // delegate
    aelDelegate(this,'mousemove',$option.selector,function(event) {
        const delegate = event.delegateTarget;
        
        if(getData(delegate,'scrollDrag-cursorDown') === true)
        {
            const delY = getData(delegate,'scrollDrag-cursorPositionY');
            const delX = getData(delegate,'scrollDrag-cursorPositionX');
            const scroll = Ele.getScroll(delegate);
            const delTop = scroll.top;
            const delLeft = scroll.left;
            const newY = ((delY - event.pageY) / $option.dividor);
            const newX = ((delX - event.pageX) / $option.dividor);
            Ele.setScroll(delegate,(delTop + newY),(delLeft + newX));
        }
    });
    
    aelDelegate(this,'mousedown',$option.selector,function(event) {
        const delegate = event.delegateTarget;
        const target = event.target;
        
        if(trigHdlr(delegate,'scrollDrag:can') && trigHdlr(delegate,'scrollDrag:required') && event.which === 1)
        {
            if($option.targetTag == null || Ele.isTag(target,$option.targetTag))
            {
                setData(delegate,'scrollDrag-cursorDown',true);
                setData(delegate,'scrollDrag-cursorPositionY',event.pageY);
                setData(delegate,'scrollDrag-cursorPositionX',event.pageX);
                setAttr(delegate,'data-status','grabbing');
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
        
        setData(this,'scrollDrag-cursorDown',false);
        setData(this,'scrollDrag-cursorPositionY',0);
        setData(this,'scrollDrag-cursorPositionX',0);
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