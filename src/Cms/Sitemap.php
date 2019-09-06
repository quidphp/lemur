<?php
declare(strict_types=1);
namespace Quid\Lemur\Cms;
use Quid\Core;

// sitemap
// class for the sitemap.xml route of the CMS
class Sitemap extends Core\Route\Sitemap
{
	// config
	public static $config = [];
}

// config
Sitemap::__config();
?>