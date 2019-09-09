<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Col;
use Quid\Lemur;
use Quid\Core;

// date
// extended class for a date column, supports many date formats
class Date extends Core\Col\Date
{
    // config
    public static $config = [
        '@cms'=>[
            'route'=>['calendar'=>Lemur\Cms\SpecificCalendar::class]]
    ];
}

// config
Date::__config();
?>