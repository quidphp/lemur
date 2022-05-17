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
        'polyfill.io'=>'https://polyfill.io/v3/polyfill.js?version=3.110.1&features=URL%2Csmoothscroll&flags=gated%2Calways',
        'paths'=>[
            'basename'=>'polyfill.js',
            'serverFrom'=>'[vendorInclude]/js/%basename%',
            'serverTo'=>'[publicJs]/%basename%',
            'public'=>'js/%basename%']
    ];


    // docOpenJs
    // retourne le polyfill javascript à lier en début de document
    // ce script est prioritaire
    final public function docOpenJs()
    {
        $path = $this->getPublicPath() ?? static::throw();
        return [0=>$path];
    }
}

// init
Polyfill::__init();
?>