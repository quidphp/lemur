<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Test\Lemur;
use Quid\Lemur;
use Quid\Base;

// boot
// class for testing Quid\Lemur\Boot
class Boot extends Base\Test
{
	// trigger
	public static function trigger(array $data):bool
	{
		// prepare
		$boot = Lemur\Boot::inst();

		// isCms
		assert(!$boot->isCms());

		// lang
		$lang = $boot->lang();
		assert(count($lang->relation('contextType')) === 3);
		assert(!empty($lang->tableDescription('user')));
		assert(!empty($lang->colDescription('metaKeywords_en')));
		assert(!empty($lang->panelDescription('default')));

		return true;
	}
}
?>