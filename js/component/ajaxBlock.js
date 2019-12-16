/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// ajaxBlock
// intègre la logique ajax, block et loading via une même méthode
Component.AjaxBlock = function(option)
{
    // not empty
    if(Vari.isEmpty(this)) 
    return null;
    
    
    // option
    const $option = Pojo.replace({
        ajaxEvent: 'click',
        autoUnbind: false
    },option);
    
    
    // components
    Component.BlockEvent.call(this,$option.ajaxEvent);
    Component.Ajax.call(this,$option.ajaxEvent);
    
    
    // handler
    setHdlrs(this,'ajaxBlock:',{
        
        isReady: function() {
            const node = trigHdlr(this,'ajaxBlock:getStatusNode');
            return (getAttr(node,"data-status") === 'ready')? true:false;
        },
        
        isEmptyContentNode: function() {
            return $(trigHdlr(this,'ajaxBlock:getContentNode')).is(":empty");
        },
        
        getStatusNode: function() {
            return this;
        },
        
        getContentNode: function() {
            return trigHdlr(this,'ajaxBlock:getStatusNode');
        },
        
        setContent: function(html,isError) {
            const node = trigHdlr(this,'ajaxBlock:getContentNode');
            $(node).html(html);
        },
        
        unsetContent: function() {
            const node = trigHdlr(this,'ajaxBlock:getContentNode');
            trigEvt(this,'ajaxBlock:unmountContent');
            $(node).html('');
        }
    });
    
    setHdlrs(this,'ajax:',{
        
        before: function(jqXHR,setting) {
            const node = trigHdlr(this,'ajaxBlock:getStatusNode');
            setAttr(node,'data-status','loading');
            trigHdlr(this,'blockEvent:block',$option.ajaxEvent);
            trigEvt(this,'ajaxBlock:before',jqXHR,setting);
        },
        
        error: function(parsedError,jqXHR,textStatus,errorThrown) {
            const node = trigHdlr(this,'ajaxBlock:getStatusNode');
            setAttr(node,"data-status",'error');
            
            if($option.autoUnbind === true && !trigHdlr(this,'ajaxBlock:isEmptyContentNode'))
            trigEvt(this,'ajaxBlock:unmountContent');
            
            trigHdlr(this,'ajaxBlock:setContent',parsedError,true);
            trigEvt(this,'ajaxBlock:beforeMount',parsedError,true);
            trigEvt(this,'ajaxBlock:error',parsedError,jqXHR,textStatus,errorThrown);
        },
        
        success: function(data,textStatus,jqXHR) {
            const node = trigHdlr(this,'ajaxBlock:getStatusNode');
            setAttr(node,"data-status",'ready');
            
            if($option.autoUnbind === true && !trigHdlr(this,'ajaxBlock:isEmptyContentNode'))
            trigEvt(this,'ajaxBlock:unmountContent');
            
            trigHdlr(this,'ajaxBlock:setContent',data,false);
            trigEvt(this,'ajaxBlock:beforeMount',data,false);
            trigEvt(this,'ajaxBlock:mountContent');
            trigEvt(this,'ajaxBlock:success',data,textStatus,jqXHR);
        },
        
        complete: function(jqXHR,textStatus) {
            trigHdlr(this,'blockEvent:unblock',$option.ajaxEvent);
            trigEvt(this,'ajaxBlock:complete',jqXHR,textStatus);
        }
    });
    
    
    // event
    ael(this,'ajaxBlock:mountContent',function() {
        const node = trigHdlr(this,'ajaxBlock:getContentNode');
        if(node != null)
        trigEvt(document,'doc:mountCommon',node);
    });
    
    ael(this,'ajaxBlock:unmountContent',function() {
        const node = trigHdlr(this,'ajaxBlock:getContentNode');
        if(node != null)
        trigEvt(document,'doc:unmountCommon',node);
    });
    
    return this;
}