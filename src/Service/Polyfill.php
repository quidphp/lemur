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
// class to integrate required for javascript
// 1. polyfill.io
// Array.from,Array.prototype.find,Array.prototype.includes,Array.prototype.keys,Array.prototype.values,CustomEvent,Map,Object.assign,Object.is,Object.values,Set,String.prototype.endsWith,String.prototype.includes,String.prototype.startsWith,requestAnimationFrame
// https://polyfill.io/v3/polyfill.js?flags=gated%2Calways&features=Map%2CSet%2CrequestAnimationFrame%2CObject.values%2CObject.is%2CObject.assign%2CArray.from%2CArray.prototype.keys%2CArray.prototype.values%2CArray.prototype.includes%2CArray.prototype.find%2CString.prototype.includes%2CString.prototype.startsWith%2CString.prototype.endsWith%2CCustomEvent
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
        return [0=>'js/vendor/polyfill/polyfill.js',1=>'js/vendor/polyfill/qsa-scope.js'];
    }
}

// init
Polyfill::__init();
?>