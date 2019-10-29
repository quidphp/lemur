<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur;
use Quid\Core;

// cell
// extended // class to represent an existing cell within a row
class Cell extends Core\Cell
{
    // config
    public static $config = [];


    // getDataAttr
    // retourne les dates attr pour la cellule
    public function getDataAttr(array $return):array
    {
        return $this->col()->getDataAttr($return);
    }
}

// init
Cell::__init();
?>