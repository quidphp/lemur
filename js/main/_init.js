"use strict";

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

// init
// initialize main utilities

// globale 
quid.main = {};

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

// callThisEach
// appele une méthode pour chaque propriété de l'objet 
// retourne this
Object.defineProperty(Object.prototype, 'callThisEach', {value: function() {
    var args = Array.prototype.slice.call(arguments);
    $(this).each(function(index, el) {
        this.callThis.apply(this,args);
    });
    
    return this;
}});