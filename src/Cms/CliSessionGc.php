<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Author: Pierre-Philippe Emond <emondpph@gmail.com>
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 * Readme: https://github.com/quidphp/lemur/blob/master/README.md
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