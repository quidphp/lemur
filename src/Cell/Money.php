<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package <https://quidphp.com>
 * Author: Pierre-Philippe Emond <emondpph@gmail.com>
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Cell;
use Quid\Core;

// money
// class to manage a cell managing money (money formatted string)
class Money extends Core\Cell\NumAlias
{
    // config
    protected static array $config = [];


    // pair
    // retourne la valeur monétaire formatté, sinon renvoie à parent
    final public function pair($value=null,...$args)
    {
        $return = $this;

        if(in_array($value,[true,'$'],true))
        $return = $this->moneyFormat(...$args);

        else
        $return = parent::pair($value,...$args);

        return $return;
    }
}

// init
Money::__init();
?>