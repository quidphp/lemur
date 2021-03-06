<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package <https://quidphp.com>
 * Author: Pierre-Philippe Emond <emondpph@gmail.com>
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Cms;
use Quid\Base\Html;
use Quid\Lemur;

// contact
// class for the contact form route of the CMS
class Contact extends Lemur\Route\Contact
{
    // trait
    use Lemur\Route\_modal;


    // config
    protected static array $config = [
        'formWrap'=>'divtable',
        'pattern'=>'%:'
    ];


    // canTrigger
    // retourne vrai si la route peut être trigger
    final public function canTrigger():bool
    {
        return parent::canTrigger() && $this->hasPermission('contact');
    }


    // submitRoute
    // route à utiliser pour submit
    final public function submitRoute():Lemur\Route\ContactSubmit
    {
        return ContactSubmit::make();
    }


    // submitAttr
    // attribut pour le bouton submit du formulaire
    final public function submitAttr()
    {
        return ['with-icon','email'];
    }


    // getFormData
    // retourne les données par défaut du formulaire, moins prioritaire que flash
    final public function getFormData():array
    {
        $return = [];
        $user = static::session()->user();

        $return['name'] = $user->fullName();
        $return['phone'] = ($user->hasCell('phone'))? $user->cell('phone'):null;
        $return['email'] = $user->email();

        return $return;
    }


    // getAdminEmail
    // retourne le courriel pour admin, utilise celui stocke dans le modèle row
    final protected function getAdminEmail():array
    {
        $return = null;
        $row = static::rowClass();

        if(!empty($row))
        $return = $row::getAdminEmail();

        return $return;
    }


    // trigger
    // lance la route contact
    final public function trigger()
    {
        $r = '';
        $adminEmail = $this->getAdminEmail();
        $lang = static::lang();
        $replace = [];

        if(!empty($adminEmail))
        {
            $replace['email'] = key($adminEmail);
            $replace['name'] = current($adminEmail);
        }

        $info = $lang->text('contact/info',$replace);

        $r .= Html::h1(static::label());
        $r .= Html::divCond($info,'info');
        $r .= Html::divCond($this->makeForm(),'form');

        return $r;
    }
}

// init
Contact::__init();
?>