<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package <https://quidphp.com>
 * Author: Pierre-Philippe Emond <emondpph@gmail.com>
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Service;
use Quid\Main;
use Quid\Routing;

// polyfill
// class to integrate javascript polyfills
class Polyfill extends Main\Service
{
    // trait
    use Routing\_service;


    // config
    protected static array $config = [
        'github'=>['https://github.com/Financial-Times/polyfill-service','https://github.com/jonathantneal/element-qsa-scope'],
        'paths'=>[
            'basename'=>null,
            'serverFrom'=>'[vendorFront]/vendor/%basename%',
            'serverTo'=>'[publicJs]/%basename%',
            'public'=>'js/%basename%'],
        'mode'=>null // choix ie11 ou edge

        // ie11
        // Array.from,Array.prototype.find,Array.prototype.fill,Array.prototype.includes,Array.prototype.keys,Array.prototype.values
        // CustomEvent,Map,Object.assign,Object.is,Object.values,Set,String.prototype.endsWith,String.prototype.includes,
        // String.prototype.startsWith,requestAnimationFrame, URL, smoothscroll, promise, location.origin, element.matches,
        // element.closest, element.remove, element.classList, element.append, element.prepend, HTML template
        // https://polyfill.io/v3/polyfill.js?version=3.53.1&flags=gated%2Calways&features=Array.from%2CArray.prototype.find%2CArray.prototype.includes%2CArray.prototype.keys%2CArray.prototype.values%2CArray.prototype.fill%2CCustomEvent%2CMap%2CObject.assign%2CObject.is%2CObject.values%2CSet%2CString.prototype.endsWith%2CString.prototype.includes%2CString.prototype.startsWith%2CrequestAnimationFrame%2CURL%2Csmoothscroll%2CPromise%2Clocation.origin%2CHTMLTemplateElement%2CElement.prototype.matches%2CElement.prototype.closest%2CElement.prototype.remove%2CElement.prototype.classList%2CElement.prototype.append%2CElement.prototype.prepend

        // edge
        // URL, smoothscroll
        // https://polyfill.io/v3/polyfill.js?version=3.53.1&flags=gated%2Calways&features=n%2CURL%2Csmoothscroll
    ];


    // getMode
    // retourne le mode du polyfill
    final public function getMode():?string
    {
        return $this->getAttr('mode');
    }


    // getBasename
    // retourne le basename du polyfill
    final public function getBasename():?string
    {
        $return = null;
        $mode = $this->getMode();

        if(!empty($mode))
        $return = 'polyfill-'.$mode.'.js';

        return $return;
    }


    // docOpenJs
    // retourne le polyfill javascript à lier en début de document
    final public function docOpenJs()
    {
        $path = $this->getPublicPath();
        return (!empty($path))? [0=>$path]:null;
    }
}

// init
Polyfill::__init();
?>