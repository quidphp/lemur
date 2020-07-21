<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package <https://quidphp.com>
 * Author: Pierre-Philippe Emond <emondpph@gmail.com>
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Row;
use Quid\Core;

// logError
// class to represent a row of the logError table, with cms config
class LogError extends Core\Row\LogError
{
    // trait
    use _log;


    // config
    protected static array $config = [];
}

// init
LogError::__init();
?>