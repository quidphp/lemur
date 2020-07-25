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

// money
// class for a column managing money (money formatted string)
class Money extends Core\Col\NumAlias
{
    // config
    protected static array $config = [
        'cell'=>Lemur\Cell\Money::class,
        'money'=>null // custom
    ];


    // onGet
    // ramène le nombre flottant dans un format monétaire
    final protected function onGet($return,?Orm\Cell $cell=null,array $option)
    {
        $return = parent::onGet($return,$cell,$option);
        $moneyAttr = $this->getAttr('money');

        if(is_numeric($return) && $moneyAttr !== false)
        $return = Base\Num::moneyFormat($return,null,$moneyAttr);

        return $return;
    }


    // onSet
    // gère la logique onSet pour un champ argent
    // enlève tous les caractères non numérique
    final protected function onSet($return,?Orm\Cell $cell=null,array $row,array $option)
    {
        $return = parent::onSet($return,$cell,$row,$option);

        if(is_string($return))
        $return = Base\Str::keepNum($return,'.');

        return $return;
    }
}

// init
Money::__init();
?>