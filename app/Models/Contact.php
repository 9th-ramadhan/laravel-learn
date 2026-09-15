<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Contact extends Model
{
    use HasFactory;

    protected $table = 'contact';

    protected $fillable = [
        'user_id',
        'nama',
        'alamat',
        'tanggal_lahir',
    ];

    // Relasi Inverse One-to-Many ke User (belongsTo)
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    // Relasi One-to-Many ke ContactPhones (hasMany)
    public function phones()
    {
        return $this->hasMany(ContactPhones::class, 'contact_id');
    }
}
