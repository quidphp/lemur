"use strict";

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// input
// script with behaviours for an input component
quid.core.input = function() {
    
    // triggerHandler
    $(this).on('input:isBinded', function(event) {
        return true;
    })
    .on('input:isDisabled',  function(event) {
        return ($(this).prop('disabled') === true)? true:false;
    })
    .on('input:getValue', function(event) {
        return quid.base.str.cast($(this).val());
    })
    .on('input:getValueTrim', function(event) {
        return quid.base.str.trim($(this).triggerHandler('input:getValue'));
    })
    
    // trigger
    .on('input:enable', function(event) {
        $(this).prop('disabled',false);
    })
    .on('input:disable', function(event) {
        $(this).prop('disabled',true);
    })
    .on('input:prepareDisable', function(event) {
        $(this).trigger($(this).triggerHandler('input:isDisabled')? 'input:disable':'input:enable');
    });
    
    return this;
};