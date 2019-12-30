/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// sorter
// script with drag and drop related sorting functionnalities, uses jquery-ui
Component.Sorter = function(option) 
{    
    // not empty
    if(Vari.isEmpty(this)) 
    return null;
    
    
    // components
    Component.Base.call(this);
    
    
    // option
    const $option = Pojo.replace({
        handle: '.handle',
        draggable: ".items",
        direction: 'vertical',
        forceFallback: true,
        filter: Dom.selectorInput(false),
        preventOnFilter: false,
        animation: 150,
        onEnd: function(event) {
            trigHdlr(this.el,'sorter:end',event,this);
        }
    },option);
    
    
    // handler
    setHdlr(this,'sorter:getInst',function() {
        return getData(this,'sortable-inst');
    });
    
    
    // event
    ael(this,'component:enable',function() {
        const sortable = trigHdlr(this,'sorter:getInst');
        sortable.option('disabled',false);
    });
    
    ael(this,'component:disable',function() {
        const sortable = trigHdlr(this,'sorter:getInst');
        sortable.option('disabled',true);
    });
    
    
    // setup
    aelOnce(this,'component:setup',function() {
        const sortable = Sortable.create(this,$option);
        setData(this,'sortable-inst',sortable);
    });
    
    return this;
}