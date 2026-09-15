<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ContactPhones extends Model
{
    use HasFactory;

    protected $table = 'contact_phones';

    protected $guarded = ['id'];

    // Relasi Inverse One-to-Many ke Contact (belongsTo)
    public function contact()
    {
        return $this->belongsTo(Contact::class, 'contact_id');
    }
}
