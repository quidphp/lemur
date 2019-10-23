<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Col;
use Quid\Base;

// slugPath
// class for a column dealing with URI slug within a URI path
class SlugPath extends SlugAlias
{
    // config
    public static $config = [
        'validate'=>[1=>'slugPath']
    ];


    // slugMake
    // gère l'appel à la classe base/slugPath
    public static function slugMake($value,?array $option=null):string
    {
        return Base\SlugPath::str($value,['slug'=>$option]);
    }
}

// init
SlugPath::__init();
?>