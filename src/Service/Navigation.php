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

// navigation
// class to integrate the quidphp-navigation javascript module
class Navigation extends Main\Service
{
    // trait
    use Routing\_service;


    // config
    protected static array $config = [
        'github'=>'https://github.com/quidphp/navigation',
        'test'=>false,
        'transpile'=>true,
        'paths'=>[
            'basename'=>null,
            'serverFrom'=>'[vendorNavigation]/dist/%basename%',
            'serverTo'=>'[publicJs]/%basename%',
            'public'=>'js/%basename%']
    ];


    // getBasename
    // retourne le basename du module navigation
    final public function getBasename():string
    {
        $return = 'navigation';
        $test = $this->getAttr('test');
        $transpile = $this->getAttr('transpile');

        if($test === true)
        $return .= '-test';

        if($transpile === false)
        $return .= '-es';

        $return .= '.js';

        return $return;
    }


    // docOpenJs
    // retourne le javascript à lier en début de document
    // ce script est prioritaire
    final public function docOpenJs()
    {
        $path = $this->getPublicPath() ?? static::throw();
        return [1=>$path];
    }
}

// init
Navigation::__init();
?>