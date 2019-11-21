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
use Quid\Base;
use Quid\Main;

// react
// class to integrate react and react components
class React extends Main\Service
{
    // config
    public static $config = [
        'class'=>'react-component', // classe par défaut pour les components
        'id'=>true, // ajoute un id par défaut
        'namespace'=>'quid.react' // object globale js ou se trouve le component
    ];


    // callStatic
    // attrape toutes les méthodes statiques et renvoie vers la méthode component
    final public static function __callStatic(string $key,array $args):?string
    {
        return static::component($key,...$args);
    }


    // component
    // génère la balise pour un component react
    final public static function component(string $key,$value=null,?array $props=null,?array $option=null):string
    {
        $return = null;
        $option = Base\Arr::plus(static::$config,$option);
        $key = ucfirst($key);
        $data = ['component'=>$key,'namespace'=>$option['namespace'],'content'=>$value,'props'=>$props];
        $attr = ['react-component','id'=>$option['id'],'data'=>$data];
        $return = Base\Html::div(null,$attr,$option);

        return $return;
    }


    // docOpenJs
    // retourne le javascript à lier en début de document
    // inclut le polyfill pour support ie11
    final public function docOpenJs()
    {
        return [4=>'js/vendor/react/react.js',5=>'js/vendor/react/react-dom.js'];
    }
}

// init
React::__init();
?>