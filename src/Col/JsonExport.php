<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/core/blob/master/LICENSE
 */

namespace Quid\Lemur\Col;
use Quid\Core;

// jsonExport
// extended class for a column that contains json which should be exported (similar to var_export)
class JsonExport extends Core\Col\JsonExport
{
	// config
	public static $config = [];


	// onGet
	// onGet spécial si contexte est cms, retourne le résultat debug/export
	public function onGet($return,array $option)
	{
		$return = parent::onGet($return,$option);

		if(is_array($return) && !empty($option['context']) && $option['context'] === 'cms:specific')
		$return = static::varExport($return);

		return $return;
	}
}

// config
JsonExport::__config();
?>