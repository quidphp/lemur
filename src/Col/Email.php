<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Col;
use Quid\Core;
use Quid\Base;

// email
// extended class for a column managing email
class Email extends Core\Col\Email
{
	// config
	public static $config = [
		'@cms'=>[
			'generalExcerptMin'=>null]
	];
	
	
	// onGet
	// sur onGet retourne le courriel dans un lien a:mailto
	public function onGet($return,array $option)
	{
		$return = $this->value($return);
		$option['context'] = (empty($option['context']))? null:$option['context'];

		if(is_string($return) && !empty($return))
		{
			if(!in_array($option['context'],['cms:generalExport','noHtml'],true))
			{
				if($option['context'] === 'cms:general' && empty($option['excerpt']))
				$option['excerpt'] = 30;

				$title = true;
				if(!empty($option['excerpt']))
				$title = Base\Str::excerpt($option['excerpt'],$return);

				$return = Base\Html::a($return,$title);
			}
		}

		return $return;
	}
}

// config
Email::__config();
?>