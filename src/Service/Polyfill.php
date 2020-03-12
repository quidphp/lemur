<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Author: Pierre-Philippe Emond <emondpph@gmail.com>
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 * Readme: https://github.com/quidphp/lemur/blob/master/README.md
 */

namespace Quid\Lemur\Service;
use Quid\Main;

// polyfill
// class to integrate javascript polyfills
// 1. polyfill.io
// Array.from,Array.prototype.find,Array.prototype.fill,Array.prototype.includes,Array.prototype.keys,Array.prototype.values
// CustomEvent,Map,Object.assign,Object.is,Object.values,Set,String.prototype.endsWith,String.prototype.includes,
// String.prototype.startsWith,requestAnimationFrame, URL, smoothscroll, promise, location.origin, element.matches,
// element.closest, element.remove, element.classList, element.append, element.prepend, HTML template
// https://polyfill.io/v3/polyfill.js?flags=gated%2Calways&features=Array.from%2CArray.prototype.find%2CArray.prototype.includes%2CArray.prototype.keys%2CArray.prototype.values%2CArray.prototype.fill%2CCustomEvent%2CMap%2CObject.assign%2CObject.is%2CObject.values%2CSet%2CString.prototype.endsWith%2CString.prototype.includes%2CString.prototype.startsWith%2CrequestAnimationFrame%2CURL%2Csmoothscroll%2CPromise%2Clocation.origin%2CHTMLTemplateElement%2CElement.prototype.matches%2CElement.prototype.closest%2CElement.prototype.remove%2CElement.prototype.classList%2CElement.prototype.append%2CElement.prototype.prepend
// 2. element-qsa-scope
// https://github.com/jonathantneal/element-qsa-scope
class Polyfill extends Main\Service
{
    // config
    public static $config = [];


    // docOpenJs
    // retourne le javascript à lier en début de document
    final public function docOpenJs()
    {
        return [0=>'js/polyfill/polyfill.js',1=>'js/polyfill/qsa-scope.js'];
    }
}

// init
Polyfill::__init();
?>