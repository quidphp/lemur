<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package <https://quidphp.com>
 * Author: Pierre-Philippe Emond <emondpph@gmail.com>
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Row;
use Quid\Core;
use Quid\Lemur;

// log
// class to represent a row of the log table, with cms config
class Log extends Core\Row\Log
{
    // trait
    use _log;


    // config
    protected static array $config = [
        'cols'=>[
            'json'=>['class'=>Lemur\Col\JsonExport::class]],
        '@cms'=>[
            'permission'=>[
                '*'=>['homeFeed'=>false]]]
    ];
}

// init
Log::__init();
?>