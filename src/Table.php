<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur;
use Quid\Core;

// table
// extended class to represent an existing table within a database, adds cms config
class Table extends Core\Table
{
    // config
    public static $config = [
        'permission'=>array(
            'subAdmin'=>array(
                'insert'=>true,
                'update'=>true,
                'delete'=>true,
                'create'=>true,
                'alter'=>true,
                'truncate'=>true,
                'drop'=>true,
                'nullPlaceholder'=>true)),
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
                'cms'=>Cms\Specific::class],
            'permission'=>array(
                '*'=>[ // le cms a beaucoup plus de paramètres pour chaque table
                    'view'=>true, // pouvoir voir la table dans le CMS
                    'limit'=>true, // accès à l'outil limite par page
                    'perPage'=>true, // accès à l'outil limite par page
                    'search'=>true, // accès à l'outil recherche
                    'searchNote'=>true, // afficher la note sous la recherche
                    'cols'=>true, // pouvoir changer les colonnes qui s'affichent dans le tableau
                    'filter'=>true, // pouvoir filtrer le tableau
                    'order'=>true, // pouvoir ordonner le tableau
                    'direction'=>true, // pouvoir changer la direction du tri dans le tableau
                    'where'=>true, // ne pas changer
                    'page'=>true, // accès à l'outil pour changer de page
                    'rows'=>true, // accès aux checkboxes dans le tableau
                    'action'=>true, // avoir accès à la colonne action à droite du tableau
                    'in'=>true, // accès à l'outil filterIn avec les checkboxes
                    'notIn'=>true, // accès à l'outil filterOut avec les checkboxes
                    'info'=>true, // popup d'informations
                    'infoPopup'=>false, // popup d'informations
                    'highlight'=>true, // ligne avec couleur bleu lors du retour
                    'panelDescription'=>true, // accès aux descriptions de panneaux
                    'add'=>true, // pouvoir ajouter
                    'modify'=>true, // pouvoir modifier
                    'remove'=>true, // pouvoir effacer
                    'multiDelete'=>true, // permettre d'effacer plusieurs lignes à la fois
                    'reset'=>true, // bouton pour la réinitialisation
                    'nav'=>true, // afficher la boîte de navigation...
                    'back'=>true, // ... avec le bouton retour
                    'truncate'=>true, // pouvoir vider la table
                    'empty'=>false, // afficher le bouton pour vider la table
                    'navAdd'=>true, // ajouter le lien + dans le menu de navigation
                    'download'=>true, // pouvoir télécharger les images
                    'export'=>false, // pouvoir exporter les données en CSV
                    'viewApp'=>true, // permettre le lien vers l'application si possible
                    'relationChilds'=>true, // affiche le bloc enfants direct
                    'specific'=>true, // accès à la page du formulaire
                    'specificOperation'=>true, // accès au module opération dans la page du formulaire (comme pour courriel de bienvenue)
                    'duplicate'=>false, // permettre la duplication
                    'description'=>true, // affiche la description de la table
                    'mediaDelete'=>true, // permettre d'effacer un media
                    'mediaRegenerate'=>false, // permettre de regénérer un media
                    'relation'=>true, // relatif aux relations, ne pas changer
                    'generalRelation'=>true, // relatif aux relations, ne pas changer
                    'specificRelation'=>true, // relatif aux relations, ne pas changer
                    'tableRelation'=>true]), // relatif aux relations, ne pas changer
                'nobody'=>array(
                    'view'=>false),
                'contributor'=>array(
                    'insert'=>true,
                    'update'=>true,
                    'delete'=>true,
                    'rows'=>false,
                    'in'=>false,
                    'notIn'=>false),
                'editor'=>array(
                    'insert'=>true,
                    'update'=>true,
                    'delete'=>true,
                    'rows'=>false,
                    'in'=>false,
                    'notIn'=>false),
                'subAdmin'=>array(
                    'truncate'=>false,
                    'infoPopup'=>true,
                    'mediaRegenerate'=>true,
                    'nullPlaceholder'=>true),
                'admin'=>array(
                    'truncate'=>false,
                    'infoPopup'=>true,
                    'mediaRegenerate'=>true,
                    'nullPlaceholder'=>true)
            ]
    ];
}

// init
Table::__init();
?>