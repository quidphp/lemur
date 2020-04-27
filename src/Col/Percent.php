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

// percent
// class for a column percent value
class Percent extends Core\Col\FloatingAlias
{
    // config
    protected static array $config = [
        'percent'=>null // custom
    ];


    // onGet
    // ramène le nombre flottant dans un format de pourcentage
    final protected function onGet($return,array $option)
    {
        $return = $this->value($return);

        if(!empty($return))
        $return = Base\Num::percentFormat($return,null,$this->getAttr('percent'));

        return $return;
    }


    // onSet
    // gère la logique onSet pour un champ de pourcentage
    // enlève tous les caractères non numérique
    final protected function onSet($return,array $row,?Orm\Cell $cell=null,array $option)
    {
        if(is_string($return))
        $return = Base\Str::keepNum($return);

        return $return;
    }
}

// init
Percent::__init();
?>