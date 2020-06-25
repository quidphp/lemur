<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package <https://quidphp.com>
 * Author: Pierre-Philippe Emond <emondpph@gmail.com>
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Cms;

// _link
// trait that provides some initial configuration for a CMS link route
trait _link
{
    // config
    protected static array $configLink = [
        'group'=>'link',
        'sitemap'=>false,
        'navigation'=>false,
        'ignore'=>false
    ];
}
?>