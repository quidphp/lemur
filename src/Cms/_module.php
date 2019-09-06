<?php
declare(strict_types=1);
namespace Quid\Lemur\Cms;

// _module
// trait that provides some initial configuration for a CMS module route
trait _module
{
	// config
	public static $configModule = [
		'match'=>[
			'role'=>'admin'],
		'response'=>[
			'timeLimit'=>30],
		'group'=>'cms/module',
		'sitemap'=>false,
		'navigation'=>false,
		'ignore'=>false
	];
}
?>