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

// robots
// class for the robots.txt route of the CMS
class Robots extends Core\Route\Robots
{
    // config
    public static array $config = [
        'allow'=>false
    ];
}

// init
Robots::__init();
?>