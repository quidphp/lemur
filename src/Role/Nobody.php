<?php
declare(strict_types=1);
namespace Quid\Lemur\Role;
use Quid\Core;

// nobody
// extended class that issues cms default configuration for the nobody role
class Nobody extends Core\Role\Nobody
{
	// config
	public static $config = [
		'db'=>[
			'*'=>[
				'view'=>false]
		]
	];
}

// config
Nobody::__config();
?>