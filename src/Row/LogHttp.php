<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Row;
use Quid\Core;

// logHttp
// class to represent a row of the logHttp table, with cms logic
class LogHttp extends Core\Row\LogHttp
{
    // config
    public static $config = [
        '@cms'=>[
            'permission'=>[
                'contributor'=>['view'=>false],
                'editor'=>['view'=>false],
                'subAdmin'=>['add'=>false],
                'admin'=>['add'=>false,'empty'=>true]]]
    ];
}

// init
LogHttp::__init();
?>