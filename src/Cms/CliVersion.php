<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/site/blob/master/LICENSE
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
    public static $config = [];
}

// init
CliVersion::__init();
?>