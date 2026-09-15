<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Contact extends Model
{
    use HasFactory;

    protected $table = 'contact';

    protected $fillable = [
        'nama',
        'alamat',
        'tanggal_lahir',
    ];

    // Relasi One-to-Many ke ContactPhones (hasMany)
    public function phones()
    {
        return $this->hasMany(ContactPhones::class, 'contact_id');
    }
}
