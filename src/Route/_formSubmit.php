<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Route;

// _formSubmit
// trait that provides methods and logic necessary to make a form submit route
trait _formSubmit
{
    // config
    public static $configFormSubmit = [
        'flashPost'=>false // si on flash post automatiquement lors d'une failure ou fallback
    ];


    // dynamique
    protected $success = false; // défini si l'utilisateur a soumis le formulaire avec succès


    // routeSuccess
    // méthode abstraite, retourne l'objet route à rediriger
    // peut aussi retoruner une string
    abstract protected function routeSuccess();


    // onFallback
    // sur fallback, set flash
    protected function onFallback($context=null)
    {
        $this->setFlash();

        return $this->fallbackRouteRedirect($context);
    }


    // fallbackRouteRedirect
    // permet de spécifier une route de redirection en cas de fallback
    protected function fallbackRouteRedirect($context=null)
    {
        return;
    }


    // onAfter
    // retourne la route vers laquelle il faut rediriger, différent si c'est succès ou non
    protected function onAfter()
    {
        $return = null;
        $this->onAfterSuccessOrFailure();
        
        if($this->isSuccess())
        $return = $this->routeSuccess();

        else
        $return = $this->routeFailure();
        
        return $return;
    }

    
    // onAfterSuccessOrFailure
    // méthode appelé dans onAfter peut importe si c'est un succès ou failure
    protected function onAfterSuccessOrFailure():void
    {
        return;
    }
    
    
    // onSuccess
    // callback appelé lors d'un succès
    protected function onSuccess():void
    {
        return;
    }


    // onFailure
    // callback appelé lors d'un échec
    protected function onFailure():void
    {
        return;
    }


    // onBeforeCommit
    // permet de faire des changements au tableau post avant le commit
    // si on retourne null, le commit est annulé
    protected function onBeforeCommit(array $return):?array
    {
        return $return;
    }


    // successComplete
    // traite le succès
    protected function successComplete():void
    {
        $this->setSuccess();
        $this->onSuccess();

        return;
    }


    // failureComplete
    // traite l'échec
    protected function failureComplete():void
    {
        $this->setFlash();
        $this->onFailure();

        return;
    }


    // routeFailure
    // retourne l'objet route en cas d'erreur, par défaut renvoie à success
    // peut aussi retoruner une string
    protected function routeFailure()
    {
        return $this->routeSuccess();
    }


    // isSuccess
    // retourne vrai si le formulaire est un succès
    protected function isSuccess()
    {
        return ($this->success === true)? true:false;
    }


    // setSuccess
    // permet d'attribuer une valeur à la propriété success
    protected function setSuccess(bool $value=true):self
    {
        $this->success = $value;

        return $this;
    }


    // setFlash
    // conserve les données flash, par défaut utilise la méthode flashPost de session
    // ceci peut être désactiver via config
    protected function setFlash():void
    {
        if(static::$config['flashPost'] === true)
        $this->session()->flashPost($this);

        return;
    }


    // post
    // retourne le tableau post pour le formulaire
    protected function post():array
    {
        return $this->request()->post(true,false,true);
    }


    // trigger
    // lance la méthode proceed et retoure null
    public function trigger()
    {
        $this->proceed();

        return;
    }
}
?>