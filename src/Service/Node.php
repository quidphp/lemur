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

// node
// class to integrate the node javascript library
class Node extends Main\Service
{
    // trait
    use Routing\_service;


    // config
    protected static array $config = [
        'github'=>'https://github.com/quidphp/node',
        'test'=>false,
        'es5'=>true,
        'paths'=>[
            'basename'=>null,
            'serverFrom'=>'[vendorNode]/dist/%basename%',
            'serverTo'=>'[publicJs]/%basename%',
            'public'=>'js/%basename%']
    ];


    // getBasename
    // retourne le basename du script node
    final public function getBasename():string
    {
        $return = 'node';
        $test = $this->getAttr('test');
        $es5 = $this->getAttr('es5');

        if($test === true)
        $return .= '-test';

        if($es5 === true)
        $return .= '-es5';

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
Node::__init();
?>