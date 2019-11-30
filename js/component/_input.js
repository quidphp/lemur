/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// input
// script with behaviours for an input component
Quid.Component.input = function() {
    
    // alias
    var setFunc = Quid.Event.setFunc;
    var triggerFunc = Quid.Event.triggerFunc;
    var ael = Quid.Event.addEventListener;
    var triggerCustom = Quid.Event.triggerCustom;
    
    // func
    setFunc(this,'input:isBinded',function() {
        return true;
    });
    
    setFunc(this,'input:isEmpty',function() {
        var value = triggerFunc(this,'input:getValue');
        return Quid.Str.isEmpty(value,true);
    });
    
    setFunc(this,'input:isNotEmpty',function() {
        var value = triggerFunc(this,'input:getValue');
        return Quid.Str.isNotEmpty(value,true);
    });
    
    setFunc(this,'input:isDisabled',function() {
        return ($(this).prop('disabled') === true)? true:false;
    });
    
    setFunc(this,'input:getValue',function(trim) {
        return Quid.Node.value(this,trim);
    });
    
    setFunc(this,'input:getValueInt',function() {
        return Quid.Number.castInt($(this).val());
    });
    
    setFunc(this,'input:getValueTrim',function() {
        return triggerFunc(this,'input:getValue',true);
    });
    
    setFunc(this,'input:setValue',function(value) {
        return $(this).val(value);
    });
    
    setFunc(this,'input:setEmpty',function() {
        return $(this).val('');
    });
    
    
    // custom
    ael(this,'input:enable',function(event) {
        $(this).prop('disabled',false);
    });
    
    ael(this,'input:disable',function(event) {
        $(this).prop('disabled',true);
    });
    
    ael(this,'input:prepareDisable',function(event) {
        $(this).trigger(triggerFunc(this,'input:isDisabled')? 'input:disable':'input:enable');
    });
    
    return this;
};