<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Cms;

// _modal
// trait that provides some initial configuration for CMS modal routes
trait _modal
{
    // config
    public static $configModal = [
        'group'=>'modal',
        'sitemap'=>false,
        'history'=>false
    ];
}
?>