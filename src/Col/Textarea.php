<?php
declare(strict_types=1);
namespace Quid\Lemur\Col;
use Quid\Lemur;
use Quid\Core;

// textarea
// extended class for a column which is editable through a textarea input
class Textarea extends Core\Col\Textarea
{
	// config
	public static $config = [
		'@cms'=>[
			'route'=>['tableRelation'=>Lemur\Cms\SpecificTableRelation::class]]
	];
}

// config
Textarea::__config();
?>