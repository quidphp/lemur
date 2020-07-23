<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package <https://quidphp.com>
 * Author: Pierre-Philippe Emond <emondpph@gmail.com>
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur;
use Quid\Core;

// table
// extended class to represent an existing table within a database
class Table extends Core\Table
{
    // config
    protected static array $config = [
        'panel'=>true, // si panel sont actifs ou non
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
                    'mainNav'=>true, // si le lien s'affiche dans le menu de navigation
                    'mainNavAdd'=>true, // ajouter le lien + dans le menu de navigation
                    'general'=>true, // accès à la page de navigation générale
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
                    'multiModify'=>true, // permettre d'effacer plusieurs lignes à la fois
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
                    'relationParents'=>true, // affiche le bloc parents direct
                    'nav'=>true, // afficher la boîte de navigation...
                    'navCount'=>true, // ... avec le count au centre
                    'navBack'=>true, // ... avec le bouton retour
                    'viewRoute'=>true, // permettre le lien vers l'application si possible
                    'duplicate'=>false, // permettre la duplication
                    'panelDescription'=>true, // accès aux descriptions de panneaux
                    'colInfoPopup'=>false, // popup d'informations pour la colonne
                    'specificRelation'=>true, // relatif aux relations, ne pas changer
                    'tableRelation'=>true, // relatif aux relations, ne pas changer
                    'quickEdit'=>true, // active ou désactive l'edit rapide par la page générale
                    'homeOverview'=>true, // active ou désactive la présence de la table dans homeOverview
                    'homeFeed'=>true], // active ou désactive la présence de la table dans  homeFeed
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


    // hasPanel
    // retourne vrai si la table a des panels
    final public function hasPanel():bool
    {
        return $this->getAttr('panel') === true;
    }
}

// init
Table::__init();
?>