<?php
declare(strict_types=1);
namespace Quid\Lemur\Col;
use Quid\Lemur;
use Quid\Core;

// relation
// abstract extended class extended for relation
abstract class Relation extends Core\Col\Relation
{
	// config
	public static $config = [
		'@cms'=>[
			'route'=>[
				'specific'=>Lemur\Cms\Specific::class,
				'specificRelation'=>Lemur\Cms\SpecificRelation::class]]
	];
}

// config
Relation::__config();
?>