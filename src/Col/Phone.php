<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package <https://quidphp.com>
 * Author: Pierre-Philippe Emond <emondpph@gmail.com>
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Col;
use Quid\Base;
use Quid\Core;
use Quid\Lemur;
use Quid\Orm;

// phone
// class for a column managing phone numbers, automatically formats the value
class Phone extends Core\ColAlias
{
    // config
    protected static array $config = [
        'cell'=>Lemur\Cell\Phone::class,
        'tag'=>'inputTel',
        'search'=>false,
        'validate'=>['phone'],
        'onComplex'=>true,
        'check'=>['kind'=>'char'],
        'phone'=>null // custom
    ];


    // onGet
    // ramène le numéro de téléphone dans un format nord-américain
    final protected function onGet($return,?Orm\Cell $cell,array $option)
    {
        if(is_scalar($return))
        $return = Base\Num::phoneFormat($return,null,$this->getAttr('phone'));

        return $return;
    }


    // onSet
    // gère la logique onSet pour un téléphone
    // enlève tous les caractères non numérique
    final protected function onSet($return,?Orm\Cell $cell,array $row,array $option)
    {
        if(is_string($return))
        $return = Base\Str::keepNumber($return);

        return $return;
    }
}

// init
Phone::__init();
?>