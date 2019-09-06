<?php
declare(strict_types=1);
namespace Quid\Lemur\Col;
use Quid\Lemur;
use Quid\Core;

// date
// extended class for a date column, supports many date formats
class Date extends Core\Col\Date
{
	// config
	public static $config = [
		'@cms'=>[
			'route'=>['calendar'=>Lemur\Cms\SpecificCalendar::class]]
	];
}

// config
Date::__config();
?>