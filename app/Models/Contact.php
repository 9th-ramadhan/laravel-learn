<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Contact extends Model
{
    //
    use HasFactory;

    // Relasi One-to-Many ke ContactPhone (hasMany)
    public function phones()
    {
        return $this->hasMany(ContactPhones::class, 'contact_id');
    }
}
