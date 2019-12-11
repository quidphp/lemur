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
        assert(Obj.length(allHandlers(bodyNode)) === 10);
        assert(trigHandler(bodyNode,'blockEvent:isRegistered','test:suite'));
        assert(trigHandler(bodyNode,'blockEvent:isUnblocked','test:suite'));
        assert(!trigHandler(bodyNode,'blockEvent:isBlocked','test:suite'));
        assert(i === 0);
        trigEvt(bodyNode,'test:suite');
        assert(i === 1);
        assert(i2 === 1);
        trigHandler(bodyNode,'blockEvent:block-all');
        assert(trigHandler(bodyNode,'blockEvent:isBlocked','test:suite'));
        trigEvt(bodyNode,'test:suite');
        trigEvt(bodyNode,'test:suite');
        assert(i === 1);
        assert(i2 === 3);
        trigHandler(bodyNode,'blockEvent:unblock','test:suite');
        trigEvt(bodyNode,'test:suite');
        assert(i === 2);
        trigHandler(bodyNode,'blockEvent:unregister','test:suite');
        assert(Obj.isEqual(trigHandler(bodyNode,'blockEvent:getObj'),{}));
        assert(!trigHandler(bodyNode,'blockEvent:isBlocked','test:suite'));
        assert(!trigHandler(bodyNode,'blockEvent:isRegistered','test:suite'));
        trigEvt(bodyNode,'test:suite');
        assert(i === 3);
        assert(i2 === 5);
        rel(bodyNode,'handlerRel');
        rel(bodyNode,handlerRel2);
        rel(htmlNode,handlerRelHtml);
        trigEvt(bodyNode,'test:suite');
        assert(i2 === 5);
        assert(i === 3);
        
        // burger
        
        // carousel
        
        // clickOpen
        
        // clickOpenAjax
        
        // clickOpenAjaxAnchor
        
        // clickOpenBase
        
        // clickOpenInputAjax
        
        // clickOpenTrigger
        
        // clickOpenTriggerBase
        
        // clickOutside
        
        // clickPrint
        
        // clickRemove
        
        // com
        
        // confirm
        
        // doc
        
        // feed
        
        // feedSearch
        
        // filter
        
        // form
        
        // hashChange
        
        // input
        Component.Input.call(inputNode);
        assert(trigHandler(inputNode,'input:isBinded'));
        assert(!trigHandler(inputNode,'input:isEmpty'));
        assert(!trigHandler(inputNode,'input:isDisabled'));
        assert(trigHandler(inputNode,'input:getValue') === '2');
        assert(trigHandler(inputNode,'input:getValueInt') === 2);
        trigHandler(inputNode,'input:setValue',3);
        assert(trigHandler(inputNode,'input:getValue') === '3');
        trigEvt(inputNode,'input:disable');
        assert(trigHandler(inputNode,'input:isDisabled'));
        assert(trigEvt(inputNode,'input:enable') == null);
        assert(!trigHandler(inputNode,'input:isDisabled'));
        trigHandler(inputNode,'input:setValue','2');
        
        // inputNumeric
        
        // inputNumericHref
        
        // inputSearch
        
        // inputSearchHref
        
        // keyboard
        
        // keyboardArrow
        
        // keyboardEnter
        
        // keyboardEscape
        
        // keyboardTab
        
        // modal
        
        // resizeChange
        
        // scrollChange
        
        // searchAutoInfo
        
        // sorter
        
        // timeout
        i = 0;
        Component.Timeout.call(bodyNode,'test:suite',100);
        ael(bodyNode,'test:suite',function() { i++; });
        ael(bodyNode,'timeout:test:suite',function() {
            assert(i == 1);
        });
        trigEvt(bodyNode,'test:suite');
        assert(i === 1);
        
        // validate
        assert(trigHandler(inputNode,'validate:isBinded'));
        assert(trigHandler(inputNode,'validate:getValue') === '2');
        assert(trigHandler(inputNode,'validate:isRequired'));
        assert(trigHandler(inputNode,'validate:getRequired') === '1');
        assert(trigHandler(inputNode,'validate:getPattern') === '^[0-9-]+$');
        assert(!trigHandler(inputNode,'validate:isEmpty'));
        assert(trigHandler(inputNode,'validate:isValid'));
        assert(trigHandler(inputNode,'validate:isNotEmptyAndValid'));
        assert(trigHandler(inputNode,'validate:process'));
        assert(trigHandler(inputNode,'validate:required'));
        assert(trigHandler(inputNode,'validate:pattern'));
        assert(trigHandler(inputNode,'validate:trigger'));
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