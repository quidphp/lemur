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

// slugPath
// class for a column dealing with an URI slug within a URI path
class SlugPath extends SlugAlias
{
    // config
    protected static array $config = [
        'validate'=>[1=>'slugPath']
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