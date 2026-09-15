<?php

namespace Database\Seeders;

use App\Models\Contact;
use App\Models\ContactPhones;
use App\Models\User;
use Illuminate\Database\Seeder;

class ContactSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = User::firstOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Admin User',
                'password' => bcrypt('password123'),
            ]
        );

        // Buat 15 data kontak dummy milik user admin, masing-masing dengan 1-3 nomor telepon
        Contact::factory()
            ->count(15)
            ->create([
                'user_id' => $user->id,
            ])
            ->each(function ($contact) {
                ContactPhones::factory()
                    ->count(rand(1, 3))
                    ->create([
                        'contact_id' => $contact->id,
                    ]);
            });
    }
}
