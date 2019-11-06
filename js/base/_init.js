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
    core: {}
};

// callThis pour tous les objets
Object.defineProperty(Object.prototype, 'callThis', {value: function(callable) {
    var args = [];
    for (var i = 0; i < arguments.length; i++) {
        if(i > 0)
        args.push(arguments[i]);
    }
    return callable.apply(this,args);
}});
