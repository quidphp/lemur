<?php
declare(strict_types=1);
namespace Quid\Lemur\Cms;
use Quid\Core;

// registerSubmit
// class for the register submit route of the CMS
class RegisterSubmit extends Core\Route\RegisterSubmit
{
	//  config
	public static $config = [
		'parent'=>Register::class
	];
}

// config
RegisterSubmit::__config();
?>