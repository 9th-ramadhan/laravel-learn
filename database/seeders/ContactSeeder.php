<?php

namespace Database\Seeders;

use App\Models\Contact;
use App\Models\ContactPhones;
use Illuminate\Database\Seeder;

class ContactSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Buat 15 data kontak dummy, masing-masing dengan 1-3 nomor telepon
        Contact::factory()
            ->count(15)
            ->create()
            ->each(function ($contact) {
                ContactPhones::factory()
                    ->count(rand(1, 3))
                    ->create([
                        'contact_id' => $contact->id,
                    ]);
            });
    }
}
