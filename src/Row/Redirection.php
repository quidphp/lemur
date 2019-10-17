<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Row;
use Quid\Core;

// redirection
// class to work with a row of the redirection table, with cms logic
class Redirection extends Core\Row\Redirection
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
Redirection::__init();
?>