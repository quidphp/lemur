<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Role;
use Quid\Core;

// contributor
// class which contains the cms default configuration for the contributor role (disabled per default)
class Contributor extends Core\RoleAlias
{
	// config
	public static $config = [
		'ignore'=>true,
		'permission'=>50,
		'can'=>[
			'login'=>['app'=>true,'cms'=>true]],
		'db'=>[
			'*'=>[
				'rows'=>false,
				'in'=>false,
				'notIn'=>false,
				'insert'=>true,
				'update'=>true,
				'delete'=>true],
			'user'=>[
				'add'=>false],
			'session'=>[
				'view'=>false],
			'lang'=>[
				'view'=>false],
			'redirection'=>[
				'view'=>false],
			'email'=>[
				'view'=>false],
			'option'=>[
				'view'=>false],
			'queueEmail'=>[
				'view'=>false],
			'log'=>[
				'view'=>false],
			'logEmail'=>[
				'view'=>false],
			'logCron'=>[
				'view'=>false],
			'logError'=>[
				'view'=>false],
			'logHttp'=>[
				'view'=>false],
			'logSql'=>[
				'view'=>false]
		]
	];
}

// config
Contributor::__config();
?>