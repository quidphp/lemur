/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

// colsSorter
// script for the col sorter component of the general page of the CMS
quid.component.colsSorter = function()
{
    // alias
    var setFunc = quid.event.setFunc;
    var triggerFunc = quid.event.triggerFunc;
    var aelOnce = quid.event.addEventListenerOnce;
    var triggerCustom = quid.event.triggerCustom;
    
    
    // bindings
    quid.component.clickOpenWithTrigger.call(this,".trigger");
    
    // func
    setFunc(this,'colsSorter:getPopup', function() {
        return $(this).find(".popup");
    });
    
    setFunc(this,'colsSorter:getCheckboxes', function() {
        return $(this).find("input[type='checkbox']");
    });
    
    setFunc(this,'colsSorter:getCheckedCheckboxes', function() {
        return triggerFunc(this,'colsSorter:getCheckboxes').filter(':checked');
    });
    
    setFunc(this,'colsSorter:getButton', function() {
        return triggerFunc(this,'colsSorter:getPopup').find("button[name='cols']");
    });
    
    setFunc(this,'colsSorter:isValid', function() {
        var r = false;
        var checkboxes = triggerFunc(this,'colsSorter:getCheckboxes');
        
        return triggerFuncEqual(checkboxes,true,'validate:isValid');
    });
    
    setFunc(this,'colsSorter:getCheckedSet', function() {
        var button = triggerFunc(this,'colsSorter:getButton');
        var checkbox = triggerFunc(this,'colsSorter:getCheckedCheckboxes');
        
        return quid.node.valueSeparator(checkbox,button.data('separator'),true);
    });
    
    setFunc(this,'colsSorter:isCurrent',function() {
        var button = triggerFunc(this,'colsSorter:getButton');
        var set = triggerFunc(this,'colsSorter:getCheckedSet');
        
        return (set === button.data('current'))? true:false;
    });
    
    
    // setup
    aelOnce(this,'component:setup', function() {
        bindColsPopup.call(this);
        bindColsCheckboxes.call(this);
        bindColsButton.call(this);
    });
    
    
    // bindColsPopup
    var bindColsPopup = function() {
        var $this = $(this);
        var popup = triggerFunc(this,'colsSorter:getPopup');
        
        quid.component.verticalSorter.call(popup,".choice",'.choice-in');
        
        popup.on('verticalSorter:stop', function() {
            triggerCustom(this,'popup:validate');
        })
        .on('popup:validate', function() {
            var checkboxes = triggerFunc($this,'colsSorter:getCheckboxes');
            triggerCustom(checkboxes,'validate:trigger');
        })
        .on('popup:invalid', function() {
            $(this).attr('data-validate','invalid');
        })
        .on('popup:valid', function() {
            $(this).removeAttr("data-validate");
            
            if(!triggerFunc($this,'colsSorter:isCurrent'))
            $(this).attr('data-validate','valid');
        });
    };
    
    // bindColsCheckboxes
    var bindColsCheckboxes = function() {
        var checkboxes = triggerFunc(this,'colsSorter:getCheckboxes');
        var popup = triggerFunc(this,'colsSorter:getPopup');
        
        quid.component.inputValidate.call(checkboxes);
        
        checkboxes.on('validate:invalid', function() {
            triggerCustom(popup,'popup:invalid');
        })
        .on('validate:valid', function() {
            triggerCustom(popup,'popup:valid');
        });
    };
    
    // bindColsButton
    var bindColsButton = function() {
        var $this = $(this);
        var button = triggerFunc(this,'colsSorter:getButton');
        
        quid.component.block.call(button,'click');
        
        button.on('click', function(event) {
            redirect.call(this,event);
        });
        
        var redirect = function(clickEvent) {
            var set = triggerFunc($this,'colsSorter:getCheckedSet');
            var href = quid.node.dataHrefReplaceChar(this,set);
            
            if(quid.str.isNotEmpty(href) && href !== quid.request.relative())
            {
                triggerCustom(this,'block');
                triggerCustom(document,'document:go',href,clickEvent);
            }
        }
    };
        
    return this;
}