<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Cms;
use Quid\Lemur;
use Quid\Base\Html;

// contact
// class for the contact form route of the CMS
class Contact extends Lemur\Route\Contact
{
    // trait
    use _modal;


    // config
    public static $config = [
        'formWrap'=>'divtable',
        'pattern'=>'%:'
    ];


    // canTrigger
    // retourne vrai si la route peut être trigger
    final public function canTrigger():bool
    {
        return (parent::canTrigger() && $this->hasPermission('contact'))? true:false;
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
        $return = array();
        $user = static::sessionUser();
        
        $return['name'] = $user->fullName();
        $return['phone'] = ($user->hasCell('phone'))? $user->cell('phone'):null;
        $return['email'] = $user->email();
        
        
        return $return;
    }
    
    
    // trigger
    // lance la route contact
    final public function trigger()
    {
        $r = '';
        $adminEmail = static::rowClass()::getAdminEmail();
        $replace = array();
        
        if(!empty($adminEmail))
        {
            $replace['email'] = key($adminEmail);
            $replace['name'] = current($adminEmail);
        }
        
        $info = static::langText('contact/info',$replace);
        
        $r .= Html::h1(static::label());
        $r .= Html::divCond($info,'info');
        $r .= Html::divCond($this->makeForm(),'form');
        
        return $r;
    }
}

// init
Contact::__init();
?>