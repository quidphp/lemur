<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Role;
use Quid\Core;

// admin
// extended class which contains the cms default configuration for the admin role
class Admin extends Core\Role\Admin
{
	// config
	public static $config = [
		'can'=>[
			'home'=>[
				'infoPopup'=>true],
			'login'=>['cms'=>true]],
		'db'=>[
			'*'=>[
				'truncate'=>false,
				'infoPopup'=>true,
				'mediaRegenerate'=>true,
				'colPopup'=>[
					'name','required','unique','editable','pattern','preValidate','validate','compare','type','length','unsigned',
					'default','acceptsNull','collation','orderable','filterable','searchable','priority','classCol','classCell']],
			'user'=>[
				'export'=>true,
				'userWelcome'=>true],
			'lang'=>[
				'export'=>true],
			'redirection'=>[
				'export'=>true],
			'queueEmail'=>[
				'add'=>false,
				'truncate'=>true],
			'session'=>[
				'add'=>false,
				'truncate'=>true],
			'log'=>[
				'add'=>false,
				'truncate'=>true,
				'empty'=>true],
			'logEmail'=>[
				'add'=>false,
				'truncate'=>true,
				'empty'=>true],
			'logCron'=>[
				'add'=>false,
				'truncate'=>true,
				'empty'=>true],
			'logError'=>[
				'add'=>false,
				'truncate'=>true,
				'empty'=>true],
			'logHttp'=>[
				'add'=>false,
				'truncate'=>true,
				'empty'=>true],
			'logSql'=>[
				'add'=>false,
				'truncate'=>true,
				'empty'=>true]
		]
	];
}

// config
Admin::__config();
?>