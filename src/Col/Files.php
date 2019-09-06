<?php
declare(strict_types=1);
namespace Quid\Lemur\Col;
use Quid\Lemur;
use Quid\Core;

// files
// abstract extended class extended by the media and medias cols
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