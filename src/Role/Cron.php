<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

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