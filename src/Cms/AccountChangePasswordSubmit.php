<?php
declare(strict_types=1);
namespace Quid\Lemur\Cms;
use Quid\Core;

// accountChangePasswordSubmit
// class for the submit change password route in the CMS
class AccountChangePasswordSubmit extends Core\Route\AccountChangePasswordSubmit
{
	// config
	public static $config = [
		'parent'=>AccountChangePassword::class
	];


	// routeSuccess
	// route utilisé pour rediriger après le formulaire
	public function routeSuccess():Core\Route
	{
		return Home::makeOverload();
	}
}

// config
AccountChangePasswordSubmit::__config();
?>