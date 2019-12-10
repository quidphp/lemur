/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// include
// script to test the component.js file
const TestComponent = Test.Component = function()
{   
    let r = true;
    
    try 
    {
        // prepare
        const htmlNode = $("html").get(0);
        const bodyNode = $("body").get(0);
        $("body").prepend("<input type='text' value='2' name='test-suite' data-required='1' data-pattern='^[0-9\-]+$' />");
        const inputNode = $("body > input[name='test-suite']").get(0);
        
        // absolutePlaceholder
        
        // ajax
        
        // ajaxBlock
        
        // alert
        
        // anchorCorner
        
        // background
        
        // blockEvent
        let i = 0;
        let i2 = 0;
        ael(bodyNode,'test:suite',function() {
            i2++;
        },'handlerRel');
        
        Component.BlockEvent.call(bodyNode,'test:suite');
        const handlerRel2 = ael(bodyNode,'test:suite',function() {
            i++;
        });
        const handlerRelHtml = ael(htmlNode,'test:suite',function() {
            i++;
        });
        assert(Obj.length(allFunc(bodyNode)) === 10);
        assert(triggerFunc(bodyNode,'blockEvent:isRegistered','test:suite'));
        assert(triggerFunc(bodyNode,'blockEvent:isUnblocked','test:suite'));
        assert(!triggerFunc(bodyNode,'blockEvent:isBlocked','test:suite'));
        assert(i === 0);
        triggerEvent(bodyNode,'test:suite');
        assert(i === 1);
        assert(i2 === 1);
        triggerFunc(bodyNode,'blockEvent:block-all');
        assert(triggerFunc(bodyNode,'blockEvent:isBlocked','test:suite'));
        triggerEvent(bodyNode,'test:suite');
        triggerEvent(bodyNode,'test:suite');
        assert(i === 1);
        assert(i2 === 3);
        triggerFunc(bodyNode,'blockEvent:unblock','test:suite');
        triggerEvent(bodyNode,'test:suite');
        assert(i === 2);
        triggerFunc(bodyNode,'blockEvent:unregister','test:suite');
        assert(Obj.isEqual(triggerFunc(bodyNode,'blockEvent:getObj'),{}));
        assert(!triggerFunc(bodyNode,'blockEvent:isBlocked','test:suite'));
        assert(!triggerFunc(bodyNode,'blockEvent:isRegistered','test:suite'));
        triggerEvent(bodyNode,'test:suite');
        assert(i === 3);
        assert(i2 === 5);
        rel(bodyNode,'handlerRel');
        rel(bodyNode,handlerRel2);
        rel(htmlNode,handlerRelHtml);
        triggerEvent(bodyNode,'test:suite');
        assert(i2 === 5);
        assert(i === 3);
        
        // burger
        
        // carousel
        
        // clickOpen
        
        // clickOpenAjax
        
        // clickOpenAjaxAnchor
        
        // clickOpenBase
        
        // clickOpenTrigger
        
        // clickOpenTriggerBase
        
        // clickOutside
        
        // clickPrint
        
        // clickRemove
        
        // com
        
        // confirm
        
        // doc
        
        // feed
        
        // form
        
        // hashChange
        
        // input
        Component.Input.call(inputNode);
        assert(triggerFunc(inputNode,'input:isBinded'));
        assert(!triggerFunc(inputNode,'input:isEmpty'));
        assert(!triggerFunc(inputNode,'input:isDisabled'));
        assert(triggerFunc(inputNode,'input:getValue') === '2');
        assert(triggerFunc(inputNode,'input:getValueInt') === 2);
        triggerFunc(inputNode,'input:setValue',3);
        assert(triggerFunc(inputNode,'input:getValue') === '3');
        triggerEvent(inputNode,'input:disable');
        assert(triggerFunc(inputNode,'input:isDisabled'));
        assert(triggerEvent(inputNode,'input:enable') == null);
        assert(!triggerFunc(inputNode,'input:isDisabled'));
        triggerFunc(inputNode,'input:setValue','2');
        
        // keyboard
        
        // keyboardArrow
        
        // keyboardEnter
        
        // keyboardEscape
        
        // keyboardTab
        
        // modal
        
        // resizeChange
        
        // scrollChange
        
        // timeout
        i = 0;
        Component.Timeout.call(bodyNode,'test:suite',100);
        ael(bodyNode,'test:suite',function() { i++; });
        ael(bodyNode,'timeout:test:suite',function() {
            assert(i == 1);
        });
        triggerEvent(bodyNode,'test:suite');
        assert(i === 1);
        
        // validate
        assert(triggerFunc(inputNode,'validate:isBinded'));
        assert(triggerFunc(inputNode,'validate:getValue') === '2');
        assert(triggerFunc(inputNode,'validate:isRequired'));
        assert(triggerFunc(inputNode,'validate:getRequired') === '1');
        assert(triggerFunc(inputNode,'validate:getPattern') === '^[0-9-]+$');
        assert(!triggerFunc(inputNode,'validate:isEmpty'));
        assert(triggerFunc(inputNode,'validate:isValid'));
        assert(triggerFunc(inputNode,'validate:isNotEmptyAndValid'));
        assert(triggerFunc(inputNode,'validate:process'));
        assert(triggerFunc(inputNode,'validate:required'));
        assert(triggerFunc(inputNode,'validate:pattern'));
        assert(triggerFunc(inputNode,'validate:trigger'));
        assert(Dom.getDataAttr('validate',inputNode) === 'valid');
        assert(Dom.getDataAttr('empty',inputNode) === '0');
        
        // validatePrevent
        
        // win
        
        // cleanup 
        $(inputNode).remove();
    } 
    
    catch (e) 
    {
        r = false;
        logError(e);
    } 
    
    return r;
}