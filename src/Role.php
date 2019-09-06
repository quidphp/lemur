<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur;
use Quid\Core;

// role
// extended abstract class that provides cms logic for a role
abstract class Role extends Core\Role
{
	// config
	public static $config = [
		'@cms'=>[ // pour cms
			'can'=>[
				'account'=>true,
				'accountChangePassword'=>true,
				'logout'=>true,
				'footerTypes'=>true,
				'footerTypesCms'=>false,
				'footerModules'=>true,
				'about'=>true,
				'home'=>[
					'info'=>true,
					'infoPopup'=>false,
					'search'=>true]],
			'db'=>[
				'*'=>[ // permission pour toutes les tables
					'view'=>true,
					'limit'=>true,
					'perPage'=>true,
					'search'=>true,
					'searchNote'=>true,
					'cols'=>true,
					'filter'=>true,
					'order'=>true,
					'direction'=>true,
					'where'=>true,
					'page'=>true,
					'rows'=>true,
					'action'=>true,
					'in'=>true,
					'notIn'=>true,
					'info'=>true,
					'infoPopup'=>false,
					'highlight'=>true,
					'panelDescription'=>true,
					'add'=>true,
					'modify'=>true,
					'remove'=>true,
					'multiDelete'=>true,
					'reset'=>true,
					'nav'=>true,
					'back'=>true,
					'truncate'=>true,
					'empty'=>false,
					'navAdd'=>true,
					'download'=>true,
					'export'=>false,
					'viewApp'=>true,
					'relationChilds'=>true,
					'specific'=>true,
					'specificOperation'=>true,
					'duplicate'=>false,
					'description'=>true,
					'mediaDelete'=>true,
					'mediaRegenerate'=>false,
					'relation'=>true,
					'generalRelation'=>true,
					'specificRelation'=>true,
					'tableRelation'=>true],
				'user'=>[
					'userWelcome'=>false],
				'session'=>[
					'remove'=>false,
					'modify'=>false]]]
	];
}

// config
Role::__config();
?>