<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Service;
use Quid\Core;

// jQuery
// class to integrate jquery library
class JQuery extends Core\ServiceAlias
{
	// config
	public static $config = [];


	// docOpenJs
	// retourne le javascript à lier en début de document
	public function docOpenJs()
	{
		return [0=>'js/jquery/jquery.js'];
	}
}

// config
JQuery::__config();
?>