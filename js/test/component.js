/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// include
// script to test the component.js file
Test.Component = function()
{   
    let r = true;
    
    try 
    {
        // prepare
        let newHtml = "<form method='post' action=''>";
        newHtml += "<input type='text' value='2' name='test-suite' data-required='1' data-pattern='^[0-9\-]+$' />";
        newHtml += "<input type='submit' name='test-submit' value='' />";
        newHtml += "</form>";
        const htmlNode = Nod.scopedQuery(document,'html');
        const bodyNode = Nod.scopedQuery(htmlNode,'body');
        Ele.prepend(bodyNode,newHtml);
        const formNode = Nod.scopedQuery(bodyNode,"> form");
        const inputNode = Nod.scopedQuery(bodyNode,"> form > input[name='test-suite']");
        
        // absolutePlaceholder
        
        // addRemove
        
        // ajax
        
        // ajaxBlock
        
        // alert
        
        // anchorCorner
        
        // background
        
        // backToTop
        
        // base
        
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
        assert(Obj.length(allHdlr(bodyNode)) === 10);
        assert(trigHdlr(bodyNode,'blockEvent:isRegistered','test:suite'));
        assert(trigHdlr(bodyNode,'blockEvent:isUnblocked','test:suite'));
        assert(!trigHdlr(bodyNode,'blockEvent:isBlocked','test:suite'));
        assert(i === 0);
        trigEvt(bodyNode,'test:suite');
        assert(i === 1);
        assert(i2 === 1);
        trigHdlr(bodyNode,'blockEvent:blockAll');
        assert(trigHdlr(bodyNode,'blockEvent:isBlocked','test:suite'));
        trigEvt(bodyNode,'test:suite');
        trigEvt(bodyNode,'test:suite');
        assert(i === 1);
        assert(i2 === 3);
        trigHdlr(bodyNode,'blockEvent:unblock','test:suite');
        trigEvt(bodyNode,'test:suite');
        assert(i === 2);
        trigHdlr(bodyNode,'blockEvent:unregister','test:suite');
        assert(Obj.isEqual(trigHdlr(bodyNode,'blockEvent:getObj'),{}));
        assert(!trigHdlr(bodyNode,'blockEvent:isBlocked','test:suite'));
        assert(!trigHdlr(bodyNode,'blockEvent:isRegistered','test:suite'));
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
        
        // calendar
        
        // carousel
        
        // clickOpen
        
        // clickOpenAjax
        
        // clickOpenAjaxAnchor
        
        // clickOpenInputAjax
        
        // clickOpenTrigger
        
        // clickOpenTriggerBase
        
        // clickOutside
        
        // confirm
        
        // doc
        
        // enumSet
        
        // fakeSelect
        
        // feed
        
        // feedSearch
        
        // filter
        
        // focusable
        
        // form
        
        // hashChange
        
        // history
        
        // hrefReplaceChar
        
        // initOpenClose
        
        // input
        Component.Input.call(inputNode);
        assert(trigHdlr(inputNode,'input:isBinded'));
        assert(!trigHdlr(inputNode,'input:isEmpty'));
        assert(!trigHdlr(inputNode,'input:isDisabled'));
        assert(trigHdlr(inputNode,'input:getValue') === '2');
        assert(trigHdlr(inputNode,'input:getValueInt') === 2);
        trigHdlr(inputNode,'input:setValue',3);
        assert(trigHdlr(inputNode,'input:getValue') === '3');
        trigHdlr(inputNode,'input:disable');
        assert(trigHdlr(inputNode,'input:isDisabled'));
        assert(trigHdlr(inputNode,'input:enable') == null);
        assert(!trigHdlr(inputNode,'input:isDisabled'));
        trigHdlr(inputNode,'input:setValue','2');
        
        // inputCalendar
        
        // inputGroup
        
        // inputNumeric
        
        // inputNumericHref
        
        // inputNumericRange
        
        // inputSearch
        
        // inputSearchHref
        
        // keyboard
        
        // keyboardArrow
        
        // keyboardEnter
        
        // keyboardEscape
        
        // modal
        
        // modalMailto
        
        // navHash
        
        // navIndex
        
        // resizeChange
        
        // scrollChange
        
        // scrollDrag
        
        // scroller
        
        // searchAutoInfo
        
        // searchSlide
        
        // sorter
        
        // tabs
        
        // tabsNav
        
        // timeout
        i = 0;
        Component.Timeout.call(bodyNode,'test:suite',100);
        ael(bodyNode,'test:suite',function() { i++; });
        ael(bodyNode,'timeout:test:suite',function() {
            assert(i == 1);
        });
        trigEvt(bodyNode,'test:suite');
        assert(i === 1);
        
        // tinymce
        
        // tooltip
        
        // validate
        assert(trigHdlr(inputNode,'validate:isBinded'));
        assert(trigHdlr(inputNode,'validate:getValue') === '2');
        assert(trigHdlr(inputNode,'validate:isRequired'));
        assert(trigHdlr(inputNode,'validate:getRequired') === '1');
        assert(trigHdlr(inputNode,'validate:getPattern') === '^[0-9-]+$');
        assert(!trigHdlr(inputNode,'validate:isEmpty'));
        assert(trigHdlr(inputNode,'validate:isValid'));
        assert(trigHdlr(inputNode,'validate:isNotEmptyAndValid'));
        assert(trigHdlr(inputNode,'validate:process'));
        assert(trigHdlr(inputNode,'validate:required'));
        assert(trigHdlr(inputNode,'validate:pattern'));
        assert(trigHdlr(inputNode,'validate:trigger'));
        assert(Ele.getAttr(inputNode,'data-validate') === 'valid');
        assert(Ele.getAttr(inputNode,'data-empty') === '0');
        
        // validatePrevent
        
        // window
        
        // windowUnload
        
        // cleanup 
        Ele.remove(formNode);
    } 
    
    catch (e) 
    {
        r = false;
        logError(e);
    } 
    
    return r;
}