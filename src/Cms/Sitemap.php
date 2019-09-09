<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Cms;
use Quid\Core;

// sitemap
// class for the automated sitemap.xml route of the CMS
class Sitemap extends Core\Route\Sitemap
{
    // config
    public static $config = [];
}

// config
Sitemap::__config();
?>