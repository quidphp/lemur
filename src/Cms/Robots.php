<?php
declare(strict_types=1);
namespace Quid\Lemur\Cms;
use Quid\Core;

// robots
// class for the robots.txt route of the CMS
class Robots extends Core\Route\Robots
{
	// config
	public static $config = [
		'allow'=>false
	];
}

// config
Robots::__config();
?>