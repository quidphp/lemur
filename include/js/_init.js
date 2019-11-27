"use strict";

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

// globals
// declare global variables

// objet qui contient toutes les méthodes
var quid = {
    base: {},
    main: {},
    core: {},
    component: {}
};

// uniqueInt
// retourne un int jamais utilisé, utile pour générer des ids unique
quid.uniqueInt = (function(value)
{
    var i = 0;
    return function() {
        return i++;
    };
})();

// callThis
// appele une méthode pour tous les objets
Object.defineProperty(Object.prototype, 'callThis', {value: function(callable) {
    var args = [];
    for (var i = 0; i < arguments.length; i++) {
        if(i > 0)
        args.push(arguments[i]);
    }
    return callable.apply(this,args);
}});

// permet de lancer un événement custom (triggerCustom)
// cette événement ne bubble pas
HTMLElement.prototype.triggerCustomEvent = function(type,data) {
    var init = {
        bubbles: false,
        cancelable: false,
        detail: data
    };
    var event = new CustomEvent(type,init);
    
    $(this).each(function(index, el) {
        this.dispatchEvent(event);
    });
    
    return this;
}