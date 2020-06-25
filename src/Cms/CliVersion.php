<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package <https://quidphp.com>
 * Author: Pierre-Philippe Emond <emondpph@gmail.com>
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Cms;
use Quid\Core;

// cliVersion
// class for the version route of the CMS, accessible via the cli
class CliVersion extends Core\Route\CliVersion
{
    // trait
    use _cli;


    // config
    protected static array $config = [
        'priority'=>800
    ];
}

// init
CliVersion::__init();
?>