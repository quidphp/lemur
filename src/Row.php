<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur;
use Quid\Core;

// row
// extended class to represent a row within a table, adds cms config
class Row extends Core\Row
{
    // config
    public static $config = [
        'permission'=>[
            'subAdmin'=>[
                'insert'=>true,
                'update'=>true,
                'delete'=>true,
                'create'=>true,
                'alter'=>true,
                'truncate'=>true,
                'drop'=>true,
                'nullPlaceholder'=>true]],
        '@cms'=>[
            'specificAddNavLink'=>null, // pour le cms, permet de diviser le lien add et view en deux
            'generalOperation'=>null, // pour le cms, méthode pour ajouter un bouton en haut à droite dans general
            'specificOperation'=>null, // pour le cms, méthode pour ajouter un bouton en haut à droite dans specific
            'order'=>['id'=>'desc'],
            'relation'=>['appendPrimary'=>true],
            'route'=>[
                0=>Cms\Specific::class,
                'general'=>Cms\General::class,
                'cms'=>Cms\Specific::class],
            'permission'=>[
                '*'=>[ // le cms a beaucoup plus de paramètres pour chaque table
                    'lemurInsert'=>true, // pouvoir ajouter
                    'lemurUpdate'=>true, // pouvoir modifier
                    'lemurDelete'=>true, // pouvoir effacer
                    'lemurTruncate'=>false, // afficher le bouton pour vider la table
                    'mainNavAdd'=>true, // ajouter le lien + dans le menu de navigation
                    'limit'=>true, // accès à l'outil limite par page
                    'perPage'=>true, // accès à l'outil limite par page
                    'page'=>true, // accès à l'outil pour changer de page
                    'order'=>true, // pouvoir ordonner le tableau
                    'direction'=>true, // pouvoir changer la direction du tri dans le tableau
                    'where'=>true, // ne pas changer
                    'filter'=>true, // pouvoir filtrer le tableau
                    'search'=>true, // accès à l'outil recherche
                    'rows'=>true, // accès aux checkboxes dans le tableau
                    'cols'=>true, // pouvoir changer les colonnes qui s'affichent dans le tableau
                    'action'=>true, // avoir accès à la colonne action à droite du tableau
                    'in'=>true, // accès à l'outil filterIn avec les checkboxes
                    'notIn'=>true, // accès à l'outil filterOut avec les checkboxes
                    'highlight'=>true, // ligne avec couleur bleu lors du retour
                    'reset'=>true, // bouton pour la réinitialisation
                    'multiDelete'=>true, // permettre d'effacer plusieurs lignes à la fois
                    'export'=>false, // pouvoir exporter les données en CSV
                    'relation'=>true, // relatif aux relations, ne pas changer
                    'generalOperation'=>true, // accès au module opération dans la page générale
                    'generalRelation'=>true, // relatif aux relations, ne pas changer
                    'description'=>true, // affiche la description de la table
                    'searchNote'=>true, // afficher la note sous la recherche
                    'generalCount'=>true, // count pour la page générale
                    'generalInfoPopup'=>false, // popup d'informations pour la page générale
                    'specific'=>true, // accès à la page du formulaire
                    'specificOperation'=>true, // accès au module opération dans la page du formulaire
                    'relationChilds'=>true, // affiche le bloc enfants direct
                    'nav'=>true, // afficher la boîte de navigation...
                    'navBack'=>true, // ... avec le bouton retour
                    'viewApp'=>true, // permettre le lien vers l'application si possible
                    'duplicate'=>false, // permettre la duplication
                    'panelDescription'=>true, // accès aux descriptions de panneaux
                    'colInfoPopup'=>false, // popup d'informations pour la colonne
                    'specificRelation'=>true, // relatif aux relations, ne pas changer
                    'tableRelation'=>true], // relatif aux relations, ne pas changer
                'nobody'=>[
                    'view'=>false,
                    'lemurInsert'=>false,
                    'lemurUpdate'=>false,
                    'lemurDelete'=>false],
                'shared'=>[
                    'view'=>false,
                    'lemurInsert'=>false,
                    'lemurUpdate'=>false,
                    'lemurDelete'=>false],
                'user'=>[
                    'view'=>false,
                    'lemurInsert'=>false,
                    'lemurUpdate'=>false,
                    'lemurDelete'=>false],
                'contributor'=>[
                    'insert'=>true,
                    'update'=>true,
                    'delete'=>true,
                    'rows'=>false,
                    'in'=>false,
                    'notIn'=>false],
                'editor'=>[
                    'insert'=>true,
                    'update'=>true,
                    'delete'=>true,
                    'rows'=>false,
                    'in'=>false,
                    'notIn'=>false],
                'subAdmin'=>[
                    'export'=>true,
                    'lemurTruncate'=>false,
                    'generalInfoPopup'=>true,
                    'colInfoPopup'=>true,
                    'mediaRegenerate'=>true,
                    'nullPlaceholder'=>true],
                'admin'=>[
                    'export'=>true,
                    'lemurTruncate'=>false,
                    'generalInfoPopup'=>true,
                    'colInfoPopup'=>true]]
            ]
    ];
}

// init
Row::__init();
?>