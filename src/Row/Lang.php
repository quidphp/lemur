<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Row;
use Quid\Core;

// lang
// class to work with a row of the lang table, with cms logic
class Lang extends Core\Row\Lang
{
    // config
    public static $config = [
        '@cms'=>[
            'permission'=>[
                'contributor'=>['view'=>false],
                'editor'=>['view'=>false],
                'subAdmin'=>['export'=>true],
                'admin'=>['export'=>true]]]
    ];
}

// init
Lang::__init();
?>