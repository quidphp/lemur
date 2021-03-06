/*
 * This file is part of the QuidPHP package <https://quidphp.com>
 * Author: Pierre-Philippe Emond <emondpph@gmail.com>
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// inputFiles
// script with logic for the file upload component of the CMS
Component.InputFiles = function()
{
    // not empty
    if(Vari.isEmpty(this)) 
    return null;
    
    
    // components
    Component.Base.call(this);
    
    
    // handler
    setHdlr(this,'inputFiles:getBlock',function() {
        return qsa(this,'.file-block');
    })
    
    
    // setup
    aelOnce(this,'component:setup',function() {
        bindBlock.call(this);
        
        const blocks = trigHdlr(this,'inputFiles:getBlock');
        trigSetup(blocks);
    });
    
    
    // bindBlock 
    const bindBlock = function() 
    {
        const blocks = trigHdlr(this,'inputFiles:getBlock');
        
        // handler
        setHdlrs(blocks,'block:',{
            getAction: function() {
                return qsa(this,".action");
            },
            
            getCancelAction: function() {
                return qs(this,".message .close",true);
            },
            
            getInputFile: function() {
                return qs(this,"input[type='file']",true);
            },
            
            getInputHidden: function() {
                return qs(this,"input[type='hidden']",true); 
            },
            
            getActionText: function() {
                return qs(this,".action-text",true);
            }
        });
        
        // bind
        aelOnce(blocks,'component:setup',function() {
            bindBlockAction.call(this);
            bindBlockCancelAction.call(this);
        });
    }
    
    
    // bindBlockAction
    const bindBlockAction = function() 
    {
        const block = this;
        const mediaAction = trigHdlr(block,'block:getAction');
        const input = trigHdlr(block,'block:getInputFile');
        const hidden =  trigHdlr(block,'block:getInputHidden');
        const actionText = trigHdlr(block,'block:getActionText');
        Component.Confirm.call(mediaAction,'click');

        ael(mediaAction,'confirm:yes',function() {
            const value = trigHdlr(hidden,'input:getValueJson');
            value.action = getAttr(this,'data-action');
            const text = getAttr(this,'data-text');
            
            toggleAttr(block,'data-action',true);
            setHtml(actionText,text);
            
            trigHdlr(hidden,'input:enable');
            trigHdlr(hidden,'input:setValue',value);
        });
    }
    
    
    // bindBlockCancelAction
    const bindBlockCancelAction = function() 
    {
        const block = this;
        const mediaCancelAction = trigHdlr(block,'block:getCancelAction');
        const input = trigHdlr(block,'block:getInputFile');
        const hidden =  trigHdlr(block,'block:getInputHidden');
        const actionText = trigHdlr(block,'block:getActionText');
        
        ael(mediaCancelAction,'click',function() {
            const value = trigHdlr(hidden,'input:getValueJson');
            value.action = null;
            
            toggleAttr(block,'data-action',false);
            setHtml(actionText,null);
            
            trigHdlr(hidden,'input:disable');
            trigHdlr(hidden,'input:setValue',value);
        });
    }
    
    return this;
}