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
use Quid\Orm;

// percent
// class for a column percent value
class Percent extends Core\Col\NumAlias
{
    // config
    protected static array $config = [
        'percent'=>null // custom
    ];


    // onGet
    // ramène le nombre flottant dans un format de pourcentage
    final protected function onGet($return,?Orm\Cell $cell,array $option)
    {
        $return = parent::onGet($return,$cell,$option);

        if(is_scalar($return))
        $return = Base\Num::percentFormat($return,null,$this->getAttr('percent'));

        return $return;
    }


    // onSet
    // gère la logique onSet pour un champ de pourcentage
    // enlève tous les caractères non numérique
    final protected function onSet($return,?Orm\Cell $cell,array $row,array $option)
    {
        $return = parent::onSet($return,$cell,$row,$option);

        if(is_string($return))
        $return = Base\Str::keepNum($return);

        return $return;
    }
}

// init
Percent::__init();
?>