<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Author: Pierre-Philippe Emond <emondpph@gmail.com>
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 * Readme: https://github.com/quidphp/lemur/blob/master/README.md
 */

namespace Quid\Lemur\Col;
use Quid\Base;
use Quid\Core;
use Quid\Orm;

// phone
// class for a column managing phone numbers, automatically formats the value
class Phone extends Core\ColAlias
{
    // config
    protected static array $config = [
        'tag'=>'inputTel',
        'search'=>false,
        'validate'=>[1=>'phone'],
        'onComplex'=>true,
        'check'=>['kind'=>'char'],
        'phone'=>null // custom
    ];


    // onGet
    // ramène le numéro de téléphone dans un format nord-américain
    final protected function onGet($return,array $option)
    {
        $return = $this->value($return);

        if(!empty($return))
        $return = Base\Num::phoneFormat($return,null,$this->getAttr('phone'));

        return $return;
    }


    // onSet
    // gère la logique onSet pour un téléphone
    // enlève tous les caractères non numérique
    final protected function onSet($return,array $row,?Orm\Cell $cell=null,array $option)
    {
        if(is_string($return))
        $return = Base\Str::keepNum($return);

        return $return;
    }
}

// init
Phone::__init();
?>