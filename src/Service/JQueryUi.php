<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Service;
use Quid\Core;

// jQueryUi
// class to integrate jquery-ui library
class JQueryUi extends Core\ServiceAlias
{
	// config
	public static $config = [];


	// docOpenJs
	// retourne le javascript à lier en début de document
	public function docOpenJs()
	{
		return [1=>'js/jquery/jquery-ui.js'];
	}
}

// config
JQueryUi::__config();
?>