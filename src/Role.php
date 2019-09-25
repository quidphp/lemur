<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur;
use Quid\Core;

// role
// extended abstract class that provides cms logic for a role
abstract class Role extends Core\Role
{
    // config
    public static $config = [
        'can'=>[
            'login'=>[
                'cms'=>false]],  // défini ou l'utilisateur peut se connecter
        '@cms'=>[ // ceci définit les éléments d'interfaces du CMS à afficher/cache
            'can'=>[
                'account'=>true,
                'accountChangePassword'=>true,
                'logout'=>true,
                'footerTypes'=>true,
                'footerTypesCms'=>false,
                'footerModules'=>true,
                'about'=>true,
                'home'=>[
                    'info'=>true,
                    'infoPopup'=>false,
                    'search'=>true]],
            'db'=>[
                
                // paramètres par défaut pour toutes les tables
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
                    'tableRelation'=>true], // relatif aux relations, ne pas changer
                
                // ensuite ici paramètres spécifiques pour les tables
                'user'=>[
                    'userWelcome'=>false],
                'session'=>[
                    'remove'=>false,
                    'modify'=>false]]]
    ];
}

// config
Role::__config();
?>