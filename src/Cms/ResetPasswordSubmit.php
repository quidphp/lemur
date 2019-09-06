<?php
declare(strict_types=1);
namespace Quid\Lemur\Cms;
use Quid\Core;

// resetPasswordSubmit
// class for the submit reset password route of the CMS
class ResetPasswordSubmit extends Core\Route\ResetPasswordSubmit
{
	// config
	public static $config = [
		'parent'=>ResetPassword::class
	];
}

// config
ResetPasswordSubmit::__config();
?>