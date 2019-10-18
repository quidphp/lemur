<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur;
use Quid\Core;

// db
// extended class used to query the database, adds cms logic
class Db extends Core\Db
{
    // config
    public static $config = [];
}

// init
Db::__init();
?>