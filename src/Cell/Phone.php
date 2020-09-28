<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package <https://quidphp.com>
 * Author: Pierre-Philippe Emond <emondpph@gmail.com>
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Cell;
use Quid\Base\Html;
use Quid\Core;

// phone
// class for a cell managing phone numbers
class Phone extends Core\Cell\NumAlias
{
    // config
    protected static array $config = [];


    // generalOutput
    // génère le output général pour une cellule phone
    public function generalOutput(array $option):?string
    {
        $return = null;

        $value = $this->get($option);
        if(!empty($value))
        $return = Html::a($value,true);

        return $return;
    }
}

// init
Phone::__init();
?>