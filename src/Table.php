<?php
declare(strict_types=1);
namespace Quid\Lemur;
use Quid\Core;

// table
// extended class to represent an existing table within a database, adds cms config
class Table extends Core\Table
{
	// config
	public static $config = [
		'@app'=>[
			'route'=>[
				'cms'=>Cms\Specific::class]],
		'@cms'=>[
			'homeTask'=>null, // pour cms, ajouter un lien vers la page d'ajout dans task
			'specificAddNavLink'=>null, // pour le cms, permet de diviser le lien add et view en deux
			'generalOperation'=>null, // pour le cms, méthode pour ajouter un bouton en haut à droite dans general
			'specificOperation'=>null, // pour le cms, méthode pour ajouter un bouton en haut à droite dans specific
			'order'=>['id'=>'desc'],
			'relation'=>['appendPrimary'=>true],
			'route'=>[
				0=>Cms\Specific::class,
				'general'=>Cms\General::class,
				'cms'=>Cms\Specific::class]]
	];
}

// config
Table::__config();
?>