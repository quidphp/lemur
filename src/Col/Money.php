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

// money
// class for a column managing money (money formatted string)
class Money extends Core\Col\FloatingAlias
{
    // config
    protected static array $config = [
        'money'=>null, // custom
        'check'=>false
    ];


    // onGet
    // ramène le nombre flottant dans un format monétaire
    final protected function onGet($return,array $option)
    {
        $return = parent::onGet($return,$option);
        $return = ($return instanceof Orm\Cell)? $this->value($return):$return;
        $moneyAttr = $this->getAttr('money');

        if(is_numeric($return) && $moneyAttr !== false)
        $return = Base\Num::moneyFormat($return,null,$moneyAttr);

        return $return;
    }


    // onSet
    // gère la logique onSet pour un champ argent
    // enlève tous les caractères non numérique
    final protected function onSet($return,array $row,?Orm\Cell $cell=null,array $option)
    {
        if(is_string($return))
        $return = Base\Str::keepNum($return,'.');

        return $return;
    }
}

// init
Money::__init();
?>