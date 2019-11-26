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
    $(this).on('input:isDisabled',  function(event) {
        return ($(this).prop('disabled') === true)? true:false;
    })
    .on('input:getValue', function(event) {
        return String($(this).val());
    })
    
    // trigger
    .on('input:disable', function(event) {
        $(this).prop('disabled',true);
    })
    .on('input:enable', function(event) {
        $(this).prop('disabled',false);
    })
    .on('input:prepareDisable', function(event) {
        $(this).trigger($(this).triggerHandler('input:isDisabled')? 'input:enable':'input:disable');
    });
    
    return this;
};