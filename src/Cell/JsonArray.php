<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Author: Pierre-Philippe Emond <emondpph@gmail.com>
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 * Readme: https://github.com/quidphp/lemur/blob/master/README.md
 */

namespace Quid\Lemur\Cell;
use Quid\Core;

// jsonArray
// class to manage a cell containing a json array
class JsonArray extends Core\CellAlias
{
    // config
    public static array $config = [];


    // index
    // retourne un index de jsonArray
    final public function index(int $value)
    {
        $return = null;
        $get = $this->get();

        if(is_array($get) && array_key_exists($value,$get))
        $return = $get[$value];

        return $return;
    }
}

// init
JsonArray::__init();
?>