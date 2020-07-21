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

// logHttp
// class to represent a row of the logHttp table, with cms config
class LogHttp extends Core\Row\LogHttp
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
LogHttp::__init();
?>