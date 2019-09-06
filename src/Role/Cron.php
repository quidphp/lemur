<?php
declare(strict_types=1);
namespace Quid\Lemur\Role;
use Quid\Core;

// cron
// extended class which contains the cms default configuration for the cron role
class Cron extends Core\Role\Cron
{
	// config
	public static $config = [
		'can'=>[
			'login'=>['cms'=>false]]
	];
}

// config
Cron::__config();
?>