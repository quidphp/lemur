<?php
declare(strict_types=1);
namespace Quid\Lemur\Col;
use Quid\Core;

// email
// extended class for a column managing email
class Email extends Core\Col\Email
{
	// config
	public static $config = [
		'@cms'=>[
			'generalExcerptMin'=>null]
	];
}

// config
Email::__config();
?>