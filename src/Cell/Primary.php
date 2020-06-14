<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Author: Pierre-Philippe Emond <emondpph@gmail.com>
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/core/blob/master/LICENSE
 * Readme: https://github.com/quidphp/core/blob/master/README.md
 */

namespace Quid\Lemur\Cell;
use Quid\Base\Html;
use Quid\Core;

// primary
// class for dealing with a cell of a column which has an auto increment primary key
class Primary extends Core\Cell\Primary
{
    // config
    protected static array $config = [];


    // generalOutput
    // génère le output général pour une cellule primary
    public function generalOutput(array $option):?string
    {
        if(!$this->isNull() && !empty($option['specific']))
        $return = Html::a($option['specific'],$this);

        else
        $return = $this->get($option);

        return $return;
    }
}

// init
Primary::__init();
?>