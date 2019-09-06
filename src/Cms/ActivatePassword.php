<?php
declare(strict_types=1);
namespace Quid\Lemur\Cms;
use Quid\Core;

// activatePassword
// class for the activate password in the CMS
class ActivatePassword extends Core\Route\ActivatePassword
{
	// config
	public static $config = [
		'parent'=>Login::class,
		'row'=>Core\Row\User::class
	];
}

// config
ActivatePassword::__config();
?>