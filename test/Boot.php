<?php
declare(strict_types=1);
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
		
		// isApp
		assert(!$boot->isApp());

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