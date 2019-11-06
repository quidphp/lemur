<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Cms;

// _link
// trait that provides some initial configuration for a CMS link route
trait _link
{
    // config
    public static $configLink = [
        'group'=>'link',
        'sitemap'=>false,
        'navigation'=>false,
        'ignore'=>false
    ];
}
?>