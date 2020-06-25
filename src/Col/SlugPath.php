<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package <https://quidphp.com>
 * Author: Pierre-Philippe Emond <emondpph@gmail.com>
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Col;
use Quid\Base;

// slugPath
// class for a column dealing with an URI slug within a URI path
class SlugPath extends SlugAlias
{
    // config
    protected static array $config = [
        'validate'=>['slugPath']
    ];


    // slugMake
    // gère l'appel à la classe base/slugPath
    final public static function slugMake($value,?array $option=null):string
    {
        return Base\SlugPath::str($value,['slug'=>$option]);
    }
}

// init
SlugPath::__init();
?>