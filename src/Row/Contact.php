<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Author: Pierre-Philippe Emond <emondpph@gmail.com>
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 * Readme: https://github.com/quidphp/lemur/blob/master/README.md
 */

namespace Quid\Lemur\Row;
use Quid\Base;
use Quid\Base\Html;
use Quid\Core;
use Quid\Main;

// contact
// class to work with a row of the contact table, stores contact messages
class Contact extends Core\RowAlias
{
    // config
    public static $config = [
        'cols'=>[
            'context'=>array('class'=>Core\Col\Context::class),
            'name'=>['required'=>true],
            'phone'=>['required'=>true,'general'=>true],
            'email'=>['required'=>true],
            'message'=>['required'=>true,'validate'=>['strLatin']]],
        'colsForm'=>array('name','phone','email','message'),
        'emailModel'=>[ // custom modèle de courriel
            'contactAdmin'=>'contactAdmin',
            'contactConfirm'=>'contactConfirm'],
        'fields'=>['name','phone','email','message'], // colonnes à afficher pour le formulaire
        'permission'=>array(
            '*'=>array('insert'=>true)),
        '@cms'=>[
            'permission'=>[
                'contributor'=>['view'=>false],
                'editor'=>['view'=>false]]]
    ];


    // contactAdminEmailModel
    // retourne le modele de courriel pour envoyer à l'administrateur si existant
    final public function contactAdminEmailModel():?Main\Contract\Email
    {
        $return = null;
        $key = $this->getAttr('emailModel/contactAdmin');

        if(!empty($key))
        $return = Core\Row\Email::find($key);

        return $return;
    }


    // contactConfirmEmailModel
    // retourne le modele de courriel pour envoyer au visiteur si existant
    final public function contactConfirmEmailModel():?Main\Contract\Email
    {
        $return = null;
        $key = $this->getAttr('emailModel/contactConfirm');

        if(!empty($key))
        $return = Core\Row\Email::find($key);

        return $return;
    }


    // hasEmailName
    // retourne vrai si le visiteur dans l'entrée de contact a un courriel et un nom
    final public function hasEmailName()
    {
        return ($this->cellName()->isNotEmpty() && $this->email()->is('email'))? true:false;
    }


    // email
    // retourne la cellule du email
    final public function email(...$args)
    {
        return $this->cell('email')->pair(...$args);
    }


    // toEmail
    // retourne email=>name lors de l'envoie dans un email
    final public function toEmail():?array
    {
        $return = null;

        if($this->hasEmailName())
        {
            $email = $this->email()->value();
            $name = $this->cellName()->value();
            $return = [$email=>$name];
        }

        return $return;
    }


    // onInserted
    // lors de l'insertion d'un nouveau contact, envoie le email
    final protected function onInserted(array $option)
    {
        $this->sendEmail($option);

        return;
    }


    // sendEmail
    // envoie les courriels de confirmation à l'administrateur et au visiteur
    final protected function sendEmail(?array $option=null):int
    {
        $return = 0;
        $option = Base\Arr::plus(['mailer'=>null,'method'=>'dispatch'],$option);

        $replace = $this->getReplaceEmail();
        $method = $option['method'];
        $adminEmail = $this->getAdminEmail();
        $contactAdmin = $this->contactAdminEmailModel();
        $contactConfirm = $this->contactConfirmEmailModel();

        if(!empty($contactConfirm))
        {
            $send = $contactConfirm->$method($option['mailer'],$this,$replace);

            if($send === true)
            $return++;
        }

        if(!empty($contactAdmin) && !empty($adminEmail))
        {
            $send = $contactAdmin->$method($option['mailer'],$adminEmail,$replace);

            if($send === true)
            $return++;
        }

        return $return;
    }


    // getReplaceEmail
    // retourne le tableau de remplacement pour les courriels
    final protected function getReplaceEmail():array
    {
        $return = [];
        $boot = static::boot();
        $option = ['context'=>'noHtml'];
        $cells = $this->cells()->gets(...static::getColsForm());
        $model = '%label%: %get%';

        $return['name'] = $boot->label();
        $return['host'] = $boot->schemeHost(true);
        $return['link'] = $this->route('cms')->uriAbsolute();
        $return['data'] = implode(PHP_EOL,$cells->htmlStr($model,false,$option));

        return $return;
    }


    // makeForm
    // génère le formulaire de contact
    final public static function makeForm(string $formWrap,$pattern=null,?array $flash=null):string
    {
        $r = '';
        $table = static::tableFromFqcn();

        foreach($table->cols(...static::getColsForm()) as $col)
        {
            $name = $col->name();
            $value = (is_array($flash) && array_key_exists($name,$flash))? $flash[$name]:null;

            $r .= Html::divOp(['field',$col]);
            $r .= $col->formWrap($formWrap,$pattern,$value);
            $r .= Html::divCl();
        }

        return $r;
    }


    // getCols
    // retourne les colonnes à mettre dans le formulaire
    final protected static function getColsForm():array
    {
        return static::$config['colsForm'];
    }
    
    
    // hasEmailModel
    // retourne vrai si les modèles de courriels existents
    final public static function hasEmailModel():bool
    {
        $return = false;
        $boot = static::boot();
        $db = $boot->db();
        $class = Core\Row\Email::class;
        
        if($db->hasTable($class))
        {
            foreach (static::$config['emailModel'] as $value) 
            {
                $model = $class::find($value);
                $return = (empty($model))? false:true;
                
                if($return === false)
                break;
            }
        }
        
        return $return;
    }
    
    
    // getAdminEmail
    // retourne le email du premier utilisateur administrateur
    public static function getAdminEmail():?array
    {
        $return = null;
        $roles = static::boot()->roles();
        $role = $roles->first(array('isAdmin'=>true));
        
        if(!empty($role))
        {
            $user = User::findByRole($role);
            if(!empty($user))
            $return = $user->toEmail();
        }
        
        return $return;
    }
    
    
    // canSendEmail
    // retourne vrai s'il est possible d'envoyer le email de contact
    final public static function canSendEmail():bool
    {
        return (static::hasEmailModel() && !empty(static::getAdminEmail()))? true:false;
    }
}

// init
Contact::__init();
?>