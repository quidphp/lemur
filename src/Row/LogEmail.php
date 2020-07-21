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

// logEmail
// class to represent a row of the logEmail table, with cms config
class LogEmail extends Core\Row\LogEmail
{
    // trait
    use _log;


    // config
    protected static array $config = [
        'cols'=>[
            'json'=>['class'=>Lemur\Col\JsonExport::class]]
    ];
}

// init
LogEmail::__init();
?>