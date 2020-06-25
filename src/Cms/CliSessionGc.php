<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package <https://quidphp.com>
 * Author: Pierre-Philippe Emond <emondpph@gmail.com>
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Cms;
use Quid\Core;

// cliSessionGc
// class for a cli route to remove expired sessions for the CMS
class CliSessionGc extends Core\Route\CliSessionGc
{
    // trait
    use _cli;


    // config
    protected static array $config = [];
}

// init
CliSessionGc::__init();
?>