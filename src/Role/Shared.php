<?php
declare(strict_types=1);
namespace Quid\Lemur\Role;
use Quid\Core;

// shared
// extended class that contains the cms default configuration for the shared role (disabled per default)
class Shared extends Core\Role\Shared
{
	// config
	public static $config = [
		'ignore'=>true,
		'can'=>[
			'login'=>['cms'=>false]]
	];
}

// config
Shared::__config();
?>