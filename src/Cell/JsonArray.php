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
    protected static array $config = [];


    // isDataValid
    // retourne vrai si les réponses sont valides
    public function isDataValid($value):bool
    {
        return is_int($value) && array_key_exists($value,$this->getData());
    }


    // getData
    // retourne les données du json array
    final public function getData():array
    {
        return $this->get() ?? [];
    }


    // index
    // retourne un index de jsonArray
    final public function index(int $value)
    {
        $return = null;
        $data = $this->getData();

        if(array_key_exists($value,$data))
        $return = $data[$value];

        return $return;
    }
}

// init
JsonArray::__init();
?>