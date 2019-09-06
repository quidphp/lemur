<?php
declare(strict_types=1);
namespace Quid\Lemur\Role;
use Quid\Core;

// user
// extended class that contains the cms default configuration for the user role (disabled per default)
class User extends Core\Role\User
{
	// config
	public static $config = [
		'ignore'=>true,
		'can'=>[
			'login'=>['cms'=>false]]
	];
}

// config
User::__config();
?>