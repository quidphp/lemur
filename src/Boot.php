<?php
declare(strict_types=1);
namespace Quid\Lemur;
use Quid\Core;

// boot
abstract class Boot extends Core\Boot
{
	// config
	public static $config = array(
		'types'=>['app','cms'], // ajout cms comme type
		'finderShortcut'=>array( // shortcut pour finder
			'vendorLemur'=>'[vendor]/quidphp/lemur'),
		'symlink'=>array(
			'[vendorLemur]/js/jquery'=>'[publicJs]/jquery'),
		'concatenatePhp'=>[ // ajoute le namespace pour le concatenator php
			'quid'=>[
				'option'=>[
					'namespace'=>[
						__NAMESPACE__=>['closure'=>true],
						Test::class=>['closure'=>false]]]]],
		'@cms'=>[
			'option'=>[
				'background'=>null,
				'logo'=>null],
			'config'=>array(
				Core\Route::class=>array(
					'metaTitle'=>['typeLabel'=>true],
					'jsInit'=>'$(document).ready(function() { $(this).navigation(); });',
					'docOpen'=>[
						'head'=>[
							'css'=>[
								'type'=>'css/%type%.css'],
							'js'=>[
								'jquery'=>'js/jquery/jquery.js',
								'jquery-ui'=>'js/jquery/jquery-ui.js',
								'include'=>'js/include.js',
								'type'=>'js/%type%.js']],
						'wrapper'=>['#wrapper']]),
				Core\Col::class=>array(
					'generalExcerptMin'=>100)),
			'compileScss'=>[
				'[publicCss]/cms.css'=>[
					0=>'[vendorLemur]/scss/normalize/normalize.css',
					1=>'[vendorLemur]/scss/include/include.scss',
					2=>'[vendorLemur]/scss/include/component.scss',
					3=>'[vendorLemur]/scss/cms/include.scss',
					4=>'[privateScss]/cms/include.scss',
					20=>'[vendorLemur]/scss/cms/cms.scss',
					50=>'[privateScss]/cms/cms.scss']],
			'concatenateJs'=>[
				'[publicJs]/include.js'=>[
					0=>'[vendorLemur]/js/include'],
				'[publicJs]/cms.js'=>[
					0=>'[vendorLemur]/js/cms',
					10=>'[privateJs]/cms']]]
	);
	
	
	// isApp
	// retourne vrai si la clé de l'application roulant présentement est app
	public function isApp():bool
	{
		return ($this->type() === 'app')? true:false;
	}


	// isCms
	// retourne vrai si la clé de l'application roulant présentement est cms
	public function isCms():bool
	{
		return ($this->type() === 'cms')? true:false;
	}
}

// config
Boot::__config();
?>