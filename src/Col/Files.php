<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Col;
use Quid\Lemur;
use Quid\Core;

// files
// extended abstract class extended by the media and medias cols
abstract class Files extends Core\Col\Files
{
	// config
	public static $config = [
		'@cms'=>[
			'route'=>['download'=>Lemur\Cms\SpecificDownload::class]]
	];
}

// config
Files::__config();
?>